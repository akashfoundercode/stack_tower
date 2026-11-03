import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BlockLayer, FallingDebris, GameState, GameDifficulty } from '../types/game';
import {
  COLOR_THEMES,
  calculatePlacement,
  calculateMultiplier,
  getDifficultyParams,
  PERFECT_TOLERANCE_PX,
} from '../utils/gamePhysics';
import { CityBackground } from './CityBackground';
import { Tower } from './Tower';
import { MovingBlock, SWING_TOP, CABLE_LENGTH, HOOK_LOOP_TOP } from './MovingBlock';
import { FallingBlock } from './FallingBlock';
import { getObstacleForLevel } from './TowerBlock';
import { soundFx } from '../utils/sound';

interface FullscreenGameSceneProps {
  gameState: GameState;
  difficulty?: GameDifficulty;
  onStackSuccess: (level: number, multiplier: number, bonus: number) => void;
  onGameOver: (finalLevel: number, finalMultiplier: number) => void;
  onPerfectStack: () => void;
  buildTrigger: number;
}

export const FullscreenGameScene: React.FC<FullscreenGameSceneProps> = ({
  gameState,
  difficulty = 'MEDIUM',
  onStackSuccess,
  onGameOver,
  onPerfectStack,
  buildTrigger,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const towerRef = useRef<HTMLDivElement>(null);

  // Responsive mobile obstacle detection (scaled down on phone screens, untouched on desktop)
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const baseCfg = getObstacleForLevel(0, isMobile);
  const firstCfg = getObstacleForLevel(1, isMobile);

  // Tower state
  const [layers, setLayers] = useState<BlockLayer[]>([
    {
      id: 0,
      level: 0,
      x: 0,
      width: baseCfg.width,
      height: baseCfg.height,
      colorTheme: COLOR_THEMES[0],
    },
  ]);

  // Active moving block
  const [movingX, setMovingX] = useState<number>(0);
  const [movingTilt, setMovingTilt] = useState<number>(0);
  const [hookX, setHookX] = useState<number>(0);
  const [movingWidth, setMovingWidth] = useState<number>(firstCfg.width);
  const [movingHeight, setMovingHeight] = useState<number>(firstCfg.height);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [debris, setDebris] = useState<FallingDebris[]>([]);
  const [feedbackToast, setFeedbackToast] = useState<{
    text: string;
    subtext?: string;
    type: 'perfect' | 'great' | 'good' | 'miss';
  } | null>(null);
  const [cameraY, setCameraY] = useState<number>(0);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.0);
  // Floating fly-up multiplier numbers on the right side of the tower
  const [flyingMultipliers, setFlyingMultipliers] = useState<
    { id: string; text: string; x: number; y: number }[]
  >([]);

  // Dropping animation state: Box starts suspended from fixed top hook (SWING_TOP = 65px)
  const [dropY, setDropY] = useState<number>(SWING_TOP);
  const [isDropping, setIsDropping] = useState<boolean>(false);

  // Winch-down descent animation (Crane lowers obstacle smoothly from above the ceiling!)
  const [winchY, setWinchY] = useState<number>(0);
  const [isLowering, setIsLowering] = useState<boolean>(false);
  const isLoweringRef = useRef<boolean>(false);
  const winchStartTimeRef = useRef<number | null>(null);

  // RAF references
  const animFrameRef = useRef<number | null>(null);
  const dropAnimRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const movingXRef = useRef<number>(0);
  const movingTiltRef = useRef<number>(0);
  const swingPhaseRef = useRef<number>(0);
  const movingWidthRef = useRef<number>(firstCfg.width);
  const movingHeightRef = useRef<number>(firstCfg.height);
  const isPlacingRef = useRef<boolean>(false);

  movingWidthRef.current = movingWidth;
  movingHeightRef.current = movingHeight;

  // Winch-down descent function: Crane hook lowers the straight obstacle into view from ceiling
  const startWinchDown = useCallback(() => {
    setIsLowering(true);
    isLoweringRef.current = true;
    setWinchY(-135);
    setMovingTilt(0);
    movingTiltRef.current = 0;
    setMovingX(0);
    movingXRef.current = 0;
    setHookX(0);
    winchStartTimeRef.current = performance.now();
  }, []);

  // Reset when game starts
  useEffect(() => {
    if (gameState === 'PLAYING') {
      const baseObj = getObstacleForLevel(0, isMobile);
      const firstObj = getObstacleForLevel(1, isMobile);
      setLayers([
        {
          id: 0,
          level: 0,
          x: 0,
          width: baseObj.width,
          height: baseObj.height,
          colorTheme: COLOR_THEMES[0],
          tilt: 0,
        },
      ]);
      setMovingWidth(firstObj.width);
      setMovingHeight(firstObj.height);
      movingWidthRef.current = firstObj.width;
      movingHeightRef.current = firstObj.height;
      setCurrentLevel(1);
      setCurrentMultiplier(1.0);
      setHookX(0);
      setDebris([]);
      setCameraY(0);
      setDropY(SWING_TOP);
      setIsDropping(false);
      setFeedbackToast(null);
      setMovingTilt(0);
      movingTiltRef.current = 0;
      setFlyingMultipliers([]);
      movingXRef.current = 0;
      swingPhaseRef.current = 0;
      isPlacingRef.current = false;

      // Start by lowering the first obstacle down from above the screen!
      startWinchDown();
    }
  }, [gameState, isMobile, startWinchDown]);

  // Drop block placement with physics drop & natural resting tilt (box does NOT get cut!)
  const handleDropBlock = useCallback(() => {
    if (gameState !== 'PLAYING' || isPlacingRef.current || isLoweringRef.current) return;
    isPlacingRef.current = true;
    setIsDropping(true);

    const dropStartX = movingXRef.current;
    const dropStartTilt = movingTiltRef.current;
    const currentW = movingWidthRef.current;
    const currentCfg = getObstacleForLevel(currentLevel, isMobile);
    const topPlacedLayer = layers[layers.length - 1];

    // Measure exact tower roof position relative to game container
    const containerRect = containerRef.current?.getBoundingClientRect();
    const towerRect = towerRef.current?.getBoundingClientRect();

    const containerTop = containerRect ? containerRect.top : 0;
    // Tower roof top coordinate relative to container:
    const towerRoofY = towerRect ? towerRect.top - containerTop : 480;
    // Target Y for the top of the landing block (with +2px for blocks, +32px on level 1 for flush fit on shop roof):
    const endY = towerRoofY - currentCfg.height + (currentLevel === 1 ? 32 : 2);
    // Exact starting Y matching swinging obstacle position at release (Center-aligned, 0 jump!)
    const centerY =
      HOOK_LOOP_TOP +
      Math.cos((dropStartTilt * Math.PI) / 180) * (CABLE_LENGTH + currentCfg.height / 2);
    const startY = centerY - currentCfg.height / 2;

    setDropY(startY);

    const dropStartTime = performance.now();
    const dropDist = Math.max(80, endY - startY);
    // Smooth, relaxed drop duration (approx 380ms - 480ms, pleasing arcade fall speed)
    const DROP_DURATION = Math.min(480, Math.max(380, Math.round(dropDist * 1.05)));

    const animateDrop = (now: number) => {
      const elapsed = now - dropStartTime;
      const progress = Math.min(1, elapsed / DROP_DURATION);
      // Realistic smooth gravity acceleration (v = at^2) with soft landing cushion:
      const eased = progress < 0.88
        ? Math.pow(progress / 0.88, 2) * 0.96
        : 0.96 + ((progress - 0.88) / 0.12) * 0.04;
      const currentDropY = startY + (endY - startY) * eased;
      setDropY(currentDropY);

      if (progress < 1) {
        dropAnimRef.current = requestAnimationFrame(animateDrop);
      } else {
        // LANDED on tower top!
        setDropY(endY);

        const result = calculatePlacement(
          dropStartX,
          currentW,
          topPlacedLayer.x,
          topPlacedLayer.width,
          PERFECT_TOLERANCE_PX,
          currentLevel,
          difficulty
        );

        if (result.status === 'MISS') {
          soundFx.playGameOver();
          const currentCfg = getObstacleForLevel(currentLevel, isMobile);
          const currentStackHeight = layers.reduce(
            (acc, l) => acc + (l.height - (l.level === 1 ? 32 : 2)),
            0
          );

          // Whole box tumbles and plummets down off the tower
          const missDebris: FallingDebris = {
            id: `miss-${Date.now()}`,
            x: dropStartX,
            bottom: currentStackHeight,
            width: currentCfg.width,
            height: currentCfg.height,
            direction: dropStartX > topPlacedLayer.x ? 'right' : 'left',
            image: currentCfg.img,
          };
          setDebris([missDebris]);
          setIsDropping(false);
          setFeedbackToast({
            text: 'MISSED!',
            subtext: 'Block fell off the tower',
            type: 'miss',
          });

          // Allow the user to visibly see the box tumble & fall before Game Over modal appears
          setTimeout(() => {
            onGameOver(currentLevel - 1, currentMultiplier);
          }, 1150);
          return;
        }

        const isPerfect = result.status === 'PERFECT';

        // Multiplier progression: tuned to difficulty level table + precision bonus
        const baseTargetMult = calculateMultiplier(currentLevel, difficulty);
        const perfectBonus = isPerfect
          ? difficulty === 'HARD'
            ? 0.35
            : difficulty === 'MEDIUM'
            ? 0.20
            : 0.10
          : 0;
        const newMultiplier = Number((baseTargetMult + perfectBonus).toFixed(2));
        const gain = Number((newMultiplier - currentMultiplier).toFixed(2));
        setCurrentMultiplier(newMultiplier);

        const currentCfg = getObstacleForLevel(currentLevel, isMobile);
        const currentStackHeight = layers.reduce(
          (acc, l) => acc + (l.height - (l.level === 1 ? 32 : 2)),
          0
        );

        // Spawn popping flying number badge on right side of tower
        const flyId = `fly-${Date.now()}`;
        const newFlyingItem = {
          id: flyId,
          text: `+${gain > 0 ? gain.toFixed(2) : result.multiplierGain.toFixed(2)}x (${newMultiplier.toFixed(2)}x)`,
          x: result.overlapX + currentCfg.width / 2 + 10, // right side of block
          y: currentStackHeight + 15,
        };
        setFlyingMultipliers((prev) => [...prev, newFlyingItem]);
        setTimeout(() => {
          setFlyingMultipliers((prev) => prev.filter((item) => item.id !== flyId));
        }, 1300);

        if (isPerfect) {
          soundFx.playPlace(true);
          setFeedbackToast({
            text: 'PERFECT!',
            subtext: `+${(gain > 0 ? gain : result.multiplierGain).toFixed(2)}x BOOST (${newMultiplier.toFixed(2)}x)`,
            type: 'perfect',
          });
          onPerfectStack();
        } else if (result.status === 'GREAT') {
          soundFx.playPlace(false);
          setFeedbackToast({
            text: 'GREAT DROP!',
            subtext: `+${(gain > 0 ? gain : result.multiplierGain).toFixed(2)}x BOOST (${newMultiplier.toFixed(2)}x)`,
            type: 'great',
          });
        } else {
          soundFx.playPlace(false);
          setFeedbackToast({
            text: 'NICE STACK!',
            subtext: `+${(gain > 0 ? gain : result.multiplierGain).toFixed(2)}x BOOST (${newMultiplier.toFixed(2)}x)`,
            type: 'good',
          });
        }

        // Show celebration announcement briefly (1.1s punch)
        setTimeout(() => {
          setFeedbackToast(null);
        }, 1100);

        // Entire box stays on tower - Lands at exact build position & tilt, then smoothly settles into place!
        const placedLevel = currentLevel;
        const newLayer: BlockLayer = {
          id: placedLevel,
          level: placedLevel,
          x: dropStartX, // Lands at exact falling horizontal position
          width: currentCfg.width, // Stable constant width - NEVER shrinks!
          height: currentCfg.height, // Exact image height - 0 gap!
          colorTheme: COLOR_THEMES[placedLevel % COLOR_THEMES.length],
          isPerfect,
          tilt: dropStartTilt, // Lands at exact falling tilt
        };

        const nextLevel = currentLevel + 1;
        const nextCfg = getObstacleForLevel(nextLevel, isMobile);

        setLayers((prev) => [...prev, newLayer]);
        setCurrentLevel(nextLevel);
        setMovingWidth(nextCfg.width);
        setMovingHeight(nextCfg.height);
        movingWidthRef.current = nextCfg.width;
        movingHeightRef.current = nextCfg.height;

        // Smoothly settle to aligned position and straighten upright (0 deg) with ZERO jerk
        requestAnimationFrame(() => {
          setLayers((prev) =>
            prev.map((l) =>
              l.id === placedLevel
                ? { ...l, x: result.overlapX, tilt: 0 }
                : l
            )
          );
        });

        // Camera Sinking: Top box is fully visible, floor underneath it ("jispe gira hai") is AADHA (half) visible!
        const allLayers = [...layers, newLayer];
        if (allLayers.length === 2) {
          // Level 1 landed on bottom shop: shop sinks down so its top half/roof is "AADHA" visible
          setCameraY(isMobile ? 42 : 55);
        } else if (allLayers.length > 2) {
          // Level N landed on Level N-1:
          // Older floors below N-1 are completely sunken
          const completelySunken = allLayers.slice(0, allLayers.length - 2);
          const sumOlder = completelySunken.reduce((sum, l) => {
            if (l.level === 0) {
              return sum + (l.height - 32 + 55);
            }
            return sum + (l.height - 2);
          }, 0);
          // Floor N-1 (jispe wo gira hai) is half-sunken so it's "AADHA" visible underneath!
          const previousFloor = allLayers[allLayers.length - 2];
          const halfFloorOffset = Math.round(previousFloor.height * 0.48);
          setCameraY(sumOlder + halfFloorOffset);
        } else {
          setCameraY(0);
        }

        onStackSuccess(currentLevel, newMultiplier, result.bonusPoints);

        setIsDropping(false);
        setDropY(SWING_TOP);

        // Next floor obstacle lowers down gracefully from the top crane
        startWinchDown();
      }
    };

    dropAnimRef.current = requestAnimationFrame(animateDrop);
  }, [
    gameState,
    layers,
    currentLevel,
    currentMultiplier,
    onStackSuccess,
    onGameOver,
    onPerfectStack,
    isMobile,
    difficulty,
    startWinchDown,
  ]);

  // External trigger
  const lastTriggerRef = useRef(buildTrigger);
  useEffect(() => {
    if (buildTrigger > lastTriggerRef.current) {
      lastTriggerRef.current = buildTrigger;
      handleDropBlock();
    }
  }, [buildTrigger, handleDropBlock]);

  // Master RAF loop for pendulum swing & crane winch descent
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      winchStartTimeRef.current = null;
      isLoweringRef.current = false;
      setIsLowering(false);
      isPlacingRef.current = false;
      setWinchY(0);
      return;
    }

    // Dynamic progressive difficulty parameters based on current level & selected difficulty mode
    const diffParams = getDifficultyParams(currentLevel, isMobile, difficulty);
    const SWEEP_TRAVEL = diffParams.sweepTravel; // Travel width across the tower
    const MAX_SWING_ANGLE = diffParams.maxSwingAngle; // degrees dynamic pendulum tilt swing
    const angularSpeed = diffParams.angularSpeed; // rad/s swing speed

    const updateFrame = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // 1. Crane smooth winch descent from top ceiling (guaranteed to complete, never freezes!)
      if (winchStartTimeRef.current !== null) {
        const elapsed = timestamp - winchStartTimeRef.current;
        const WINCH_DURATION = 380; // ms smooth descent
        if (elapsed < WINCH_DURATION) {
          const progress = Math.min(1, elapsed / WINCH_DURATION);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentY = -135 + 135 * easeOut;
          setWinchY(Math.round(currentY * 10) / 10);
          setMovingTilt(0);
          setMovingX(0);
          setHookX(0);
          movingTiltRef.current = 0;
          movingXRef.current = 0;
        } else {
          setWinchY(0);
          winchStartTimeRef.current = null;
          isLoweringRef.current = false;
          setIsLowering(false);
          isPlacingRef.current = false;
          swingPhaseRef.current = 0;
        }
      } else if (!isPlacingRef.current) {
        // Normal pendulum swing across the screen
        swingPhaseRef.current += angularSpeed * delta;
        const currentTrolleyX = Math.sin(swingPhaseRef.current) * SWEEP_TRAVEL;
        const currentTilt = Math.sin(swingPhaseRef.current) * MAX_SWING_ANGLE;
        const currentArm = CABLE_LENGTH + movingHeightRef.current / 2;
        const pendulumX = Math.sin((currentTilt * Math.PI) / 180) * currentArm;
        const totalX = Math.round((currentTrolleyX + pendulumX) * 10) / 10;
        const roundedTilt = Math.round(currentTilt * 10) / 10;
        const roundedHookX = Math.round(currentTrolleyX * 10) / 10;

        movingTiltRef.current = roundedTilt;
        movingXRef.current = totalX;
        setMovingTilt(roundedTilt);
        setMovingX(totalX);
        setHookX(roundedHookX);
      }
      animFrameRef.current = requestAnimationFrame(updateFrame);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (dropAnimRef.current) {
        cancelAnimationFrame(dropAnimRef.current);
      }
    };
  }, [gameState, currentLevel, isMobile, difficulty]);

  const activeTheme = COLOR_THEMES[currentLevel % COLOR_THEMES.length];

  return (
    <div
      ref={containerRef}
      onClick={handleDropBlock}
      className={`absolute inset-0 overflow-hidden select-none ${isLowering ? 'cursor-default' : 'cursor-pointer'}`}
    >
      {/* Background World: Sky Canvas, Floating Clouds, Frame Parallax & Balloons */}
      <CityBackground cameraY={cameraY} />

      {/* Center Ultra-Premium Arcade Announcement (Crisp, High-Contrast 3D Punch) */}
      {feedbackToast && (
        <div className="absolute top-[38%] left-1/2 z-50 pointer-events-none select-none flex flex-col items-center justify-center animate-arcade-pop text-center">
          {/* Radiant Glow Burst Behind Text */}
          <div
            className={`absolute w-72 h-44 rounded-full blur-3xl pointer-events-none animate-radial-aura -z-10 ${
              feedbackToast.type === 'perfect'
                ? 'bg-amber-400/50'
                : feedbackToast.type === 'great'
                ? 'bg-teal-400/45'
                : feedbackToast.type === 'miss'
                ? 'bg-rose-500/50'
                : 'bg-sky-400/40'
            }`}
          />

          {/* Golden Stars for PERFECT hit */}
          {feedbackToast.type === 'perfect' && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-yellow-300 text-xl sm:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">★</span>
              <span className="text-yellow-200 text-2xl sm:text-3xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] -translate-y-1">★</span>
              <span className="text-yellow-300 text-xl sm:text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">★</span>
            </div>
          )}

          {/* Big 3D Extruded Arcade Typography with Solid Fill & Crisp Outline */}
          <div
            className="font-black italic tracking-wider text-4xl sm:text-5xl md:text-6xl uppercase whitespace-nowrap transform select-none"
            style={{
              color:
                feedbackToast.type === 'perfect'
                  ? '#fffbeb'
                  : feedbackToast.type === 'great'
                  ? '#ecfdf5'
                  : feedbackToast.type === 'miss'
                  ? '#fff1f2'
                  : '#f0f9ff',
              WebkitTextStroke:
                feedbackToast.type === 'perfect'
                  ? '3px #78350f'
                  : feedbackToast.type === 'great'
                  ? '3px #064e3b'
                  : feedbackToast.type === 'miss'
                  ? '3px #881337'
                  : '3px #0c4a6e',
              paintOrder: 'stroke fill',
              textShadow:
                feedbackToast.type === 'perfect'
                  ? '0 2px 0 #fbbf24, 0 4px 0 #d97706, 0 6px 0 #b45309, 0 8px 0 #78350f, 0 10px 24px rgba(0, 0, 0, 0.85), 0 0 40px rgba(251, 191, 36, 0.95)'
                  : feedbackToast.type === 'great'
                  ? '0 2px 0 #34d399, 0 4px 0 #059669, 0 6px 0 #047857, 0 8px 0 #064e3b, 0 10px 24px rgba(0, 0, 0, 0.85), 0 0 40px rgba(52, 211, 153, 0.95)'
                  : feedbackToast.type === 'miss'
                  ? '0 2px 0 #fb7185, 0 4px 0 #e11d48, 0 6px 0 #be123c, 0 8px 0 #881337, 0 10px 24px rgba(0, 0, 0, 0.85), 0 0 40px rgba(244, 63, 94, 0.9)'
                  : '0 2px 0 #38bdf8, 0 4px 0 #0284c7, 0 6px 0 #0369a1, 0 8px 0 #0c4a6e, 0 10px 24px rgba(0, 0, 0, 0.85), 0 0 35px rgba(56, 189, 248, 0.9)',
            }}
          >
            {feedbackToast.text}
          </div>

          {/* Floating Boost Glassmorphic Pill */}
          {feedbackToast.subtext && (
            <div className="mt-2.5 px-4 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.6)] flex items-center gap-1.5">
              <span className="text-yellow-400 text-xs font-bold animate-pulse">⚡</span>
              <span className="font-extrabold text-xs sm:text-sm text-white font-mono tracking-wider drop-shadow-sm">
                {feedbackToast.subtext}
              </span>
            </div>
          )}
        </div>
      )}


      {/* Camera Stage: Sits comfortably on mobile and slightly lowered on desktop */}
      <div
        className="absolute inset-x-0 bottom-[204px] sm:bottom-46 md:bottom-[184px] flex flex-col items-center justify-end transition-transform duration-300 ease-out will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(0px, ${cameraY}px, 0px)`,
        }}
      >
        {/* Tower Stack (Building floors sit right on the shop roof) */}
        <div className="relative z-20 w-full flex justify-center">
          <Tower
            ref={towerRef}
            layers={layers}
          />
        </div>

        {/* Flying +X Multiplier Pop Numbers flying out towards the right */}
        {flyingMultipliers.map((fly) => (
          <div
            key={fly.id}
            className="absolute z-40 pointer-events-none animate-fly-multiplier left-1/2"
            style={{
              bottom: `${fly.y}px`,
              transform: `translate3d(${fly.x}px, 0, 0)`,
            }}
          >
            <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-sm sm:text-base px-2.5 py-1 rounded-xl shadow-[0_4px_16px_rgba(245,158,11,0.7)] border border-yellow-100 flex items-center gap-1 font-mono tracking-tight whitespace-nowrap">
              <span>⚡</span>
              <span>{fly.text}</span>
            </div>
          </div>
        ))}

        {/* Falling cut debris particles */}
        <FallingBlock debrisList={debris} />
      </div>

      {/* Moving Block Suspended from Top Crane Hook (Every obstacle hangs & drops from here!) */}
      {gameState === 'PLAYING' && (
        <MovingBlock
          x={movingX}
          width={movingWidth}
          height={movingHeight}
          theme={activeTheme}
          level={currentLevel}
          dropOffsetY={dropY}
          tilt={movingTilt}
          isDropping={isDropping}
          hookX={hookX}
          winchY={winchY}
        />
      )}
    </div>
  );
};

