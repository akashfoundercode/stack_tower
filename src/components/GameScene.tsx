import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BlockLayer, FallingDebris, GameState } from '../types/game';
import {
  BASE_BLOCK_WIDTH,
  BLOCK_HEIGHT,
  COLOR_THEMES,
  calculatePlacement,
  calculateSpeed,
  calculateMultiplier,
} from '../utils/gamePhysics';
import { CityBackground } from './CityBackground';
import { Tower } from './Tower';
import { MovingBlock } from './MovingBlock';
import { FallingBlock } from './FallingBlock';
import { soundFx } from '../utils/sound';

interface GameSceneProps {
  gameState: GameState;
  onStackSuccess: (level: number, multiplier: number, bonus: number) => void;
  onGameOver: (finalLevel: number, finalMultiplier: number) => void;
  onPerfectStack: () => void;
  buildTrigger: number; // Increment to trigger build from outside button
}

export const GameScene: React.FC<GameSceneProps> = ({
  gameState,
  onStackSuccess,
  onGameOver,
  onPerfectStack,
  buildTrigger,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Tower state
  const [layers, setLayers] = useState<BlockLayer[]>([
    {
      id: 0,
      level: 0,
      x: 0,
      width: BASE_BLOCK_WIDTH,
      height: BLOCK_HEIGHT,
      colorTheme: COLOR_THEMES[0],
    },
  ]);

  // Active moving block
  const [movingX, setMovingX] = useState<number>(0);
  const [movingWidth, setMovingWidth] = useState<number>(BASE_BLOCK_WIDTH);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [debris, setDebris] = useState<FallingDebris[]>([]);
  const [perfectFlash, setPerfectFlash] = useState<boolean>(false);
  const [cameraY, setCameraY] = useState<number>(0);

  // Ref tracking values for high-frequency requestAnimationFrame loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const movingXRef = useRef<number>(0);
  const directionRef = useRef<number>(1); // 1 = right, -1 = left
  const movingWidthRef = useRef<number>(BASE_BLOCK_WIDTH);
  const isPlacingRef = useRef<boolean>(false);

  // Max range moving block sweeps left and right
  const SWEEP_BOUNDS = 170; // px from center

  // Synchronize refs with state
  movingWidthRef.current = movingWidth;

  // When game state changes
  useEffect(() => {
    if (gameState === 'PLAYING') {
      // Start fresh tower
      setLayers([
        {
          id: 0,
          level: 0,
          x: 0,
          width: BASE_BLOCK_WIDTH,
          height: BLOCK_HEIGHT,
          colorTheme: COLOR_THEMES[0],
        },
      ]);
      setMovingWidth(BASE_BLOCK_WIDTH);
      movingWidthRef.current = BASE_BLOCK_WIDTH;
      setCurrentLevel(1);
      setDebris([]);
      setCameraY(0);
      movingXRef.current = -SWEEP_BOUNDS;
      directionRef.current = 1;
      isPlacingRef.current = false;
    }
  }, [gameState]);

  // Physics stacking placement action
  const handleDropBlock = useCallback(() => {
    if (gameState !== 'PLAYING' || isPlacingRef.current) return;
    isPlacingRef.current = true;

    const currentX = movingXRef.current;
    const currentW = movingWidthRef.current;
    const topPlacedLayer = layers[layers.length - 1];

    const result = calculatePlacement(
      currentX,
      currentW,
      topPlacedLayer.x,
      topPlacedLayer.width
    );

    if (result.status === 'MISS') {
      // Complete miss: entire block drops off
      soundFx.playGameOver();
      const missDebris: FallingDebris = {
        id: `miss-${Date.now()}`,
        x: currentX,
        width: currentW,
        height: BLOCK_HEIGHT,
        y: 0,
        colorTheme: COLOR_THEMES[currentLevel % COLOR_THEMES.length],
        direction: currentX > topPlacedLayer.x ? 'right' : 'left',
        rotation: currentX > topPlacedLayer.x ? 25 : -25,
        velocity: 400,
      };
      setDebris((prev) => [...prev, missDebris]);

      onGameOver(currentLevel - 1, calculateMultiplier(currentLevel - 1));
      return;
    }

    const isPerfect = result.status === 'PERFECT';

    if (isPerfect) {
      soundFx.playPlace(true);
      setPerfectFlash(true);
      setTimeout(() => setPerfectFlash(false), 800);
      onPerfectStack();
    } else {
      soundFx.playPlace(false);
      soundFx.playCut();

      // Spawn falling cut overhang debris
      if (result.cutWidth > 0) {
        const cutPiece: FallingDebris = {
          id: `cut-${Date.now()}`,
          x: result.cutX,
          width: result.cutWidth,
          height: BLOCK_HEIGHT,
          y: 0,
          colorTheme: COLOR_THEMES[currentLevel % COLOR_THEMES.length],
          direction: result.cutSide === 'right' ? 'right' : 'left',
          rotation: result.cutSide === 'right' ? 30 : -30,
          velocity: 350,
        };
        setDebris((prev) => [...prev, cutPiece]);
      }
    }

    // New layer added to tower
    const newLayer: BlockLayer = {
      id: currentLevel,
      level: currentLevel,
      x: result.overlapX,
      width: result.overlapWidth,
      height: BLOCK_HEIGHT,
      colorTheme: COLOR_THEMES[currentLevel % COLOR_THEMES.length],
      isPerfect,
    };

    const nextLevel = currentLevel + 1;
    const nextMultiplier = calculateMultiplier(currentLevel);

    setLayers((prev) => [...prev, newLayer]);
    setMovingWidth(result.overlapWidth);
    movingWidthRef.current = result.overlapWidth;
    setCurrentLevel(nextLevel);

    // Smooth camera elevation after floor 3
    if (currentLevel >= 3) {
      setCameraY((currentLevel - 2) * (BLOCK_HEIGHT - 6));
    }

    onStackSuccess(currentLevel, nextMultiplier, result.bonusPoints);

    // Reset moving block sweep position from opposite side
    directionRef.current = directionRef.current * -1;
    movingXRef.current = directionRef.current > 0 ? -SWEEP_BOUNDS : SWEEP_BOUNDS;

    // Small debounce timeout to prevent accidental double clicks
    setTimeout(() => {
      isPlacingRef.current = false;
    }, 120);
  }, [gameState, layers, currentLevel, onStackSuccess, onGameOver, onPerfectStack]);

  // Listen to external buildTrigger
  const lastTriggerRef = useRef(buildTrigger);
  useEffect(() => {
    if (buildTrigger > lastTriggerRef.current) {
      lastTriggerRef.current = buildTrigger;
      handleDropBlock();
    }
  }, [buildTrigger, handleDropBlock]);

  // Smooth debris falling animation loop
  useEffect(() => {
    if (debris.length === 0) return;
    const timer = setInterval(() => {
      setDebris((prev) =>
        prev
          .map((d) => ({
            ...d,
            y: d.y + 16,
            rotation: d.rotation + (d.direction === 'right' ? 4 : -4),
          }))
          .filter((d) => d.y < 600)
      );
    }, 25);
    return () => clearInterval(timer);
  }, [debris.length]);

  // Main high-performance RAF loop for active block sweep
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      return;
    }

    const currentSpeed = calculateSpeed(currentLevel);

    const updateFrame = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Update position
      const moveDelta = currentSpeed * delta * directionRef.current;
      movingXRef.current += moveDelta;

      // Bounce at screen edges
      if (movingXRef.current > SWEEP_BOUNDS) {
        movingXRef.current = SWEEP_BOUNDS;
        directionRef.current = -1;
      } else if (movingXRef.current < -SWEEP_BOUNDS) {
        movingXRef.current = -SWEEP_BOUNDS;
        directionRef.current = 1;
      }

      setMovingX(movingXRef.current);
      animFrameRef.current = requestAnimationFrame(updateFrame);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameState, currentLevel]);

  // Active theme for current moving block
  const activeTheme = COLOR_THEMES[currentLevel % COLOR_THEMES.length];

  return (
    <div
      ref={containerRef}
      onClick={handleDropBlock}
      className="relative w-full h-[460px] md:h-[500px] overflow-hidden rounded-2xl border-4 border-slate-700/80 shadow-2xl cursor-pointer select-none bg-sky-300"
    >
      {/* Dynamic Visual City Environment */}
      <CityBackground />

      {/* PERFECT! Toast Celebration */}
      {perfectFlash && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-slate-950 font-black text-xl md:text-2xl px-6 py-2 rounded-full border-2 border-white shadow-[0_0_24px_rgba(250,204,21,0.9)] tracking-wider">
            ⭐ PERFECT! +100 ⭐
          </div>
        </div>
      )}

      {/* Floating HUD Badges inside game scene */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-600/70 text-xs font-bold text-white shadow-md flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>FLOOR {currentLevel}</span>
        </div>

        <div className="bg-amber-500/90 backdrop-blur-md px-3 py-1 rounded-xl border border-amber-300 text-xs font-black text-slate-950 shadow-md">
          {calculateMultiplier(Math.max(1, currentLevel - 1))}x
        </div>
      </div>

      {/* Camera Stage: Smooth vertical transition follows tower growth */}
      <div
        className="absolute inset-x-0 bottom-14 flex flex-col items-center justify-end transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `translate3d(0px, ${cameraY}px, 0px)`,
        }}
      >
        {/* The Vertical Stack of Built Floors */}
        <div className="relative z-10 w-full flex justify-center">
          <Tower layers={layers} />
        </div>

        {/* Falling cut debris particles */}
        <FallingBlock debrisList={debris} />

        {/* Active Moving Crane Block */}
        {gameState === 'PLAYING' && (
          <div
            className="absolute z-30"
            style={{
              bottom: `${layers.length * (BLOCK_HEIGHT - 1)}px`,
              width: '100%',
              height: `${BLOCK_HEIGHT}px`,
            }}
          >
            <MovingBlock
              x={movingX}
              width={movingWidth}
              height={BLOCK_HEIGHT}
              theme={activeTheme}
              level={currentLevel}
            />
          </div>
        )}
      </div>

      {/* Idle / Click to start hint if not active */}
      {gameState === 'IDLE' && (
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] z-40 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
          <div className="bg-slate-900/95 border-2 border-yellow-400/80 p-6 rounded-2xl shadow-2xl max-w-xs transform hover:scale-105 transition-all">
            <span className="text-3xl">🏗️</span>
            <h3 className="text-xl font-extrabold text-white mt-2">
              SKY TOWER CRASH
            </h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Drop moving blocks with pinpoint accuracy. Overhangs fall away!
              Cash out anytime before you miss!
            </p>
            <div className="mt-4 px-3 py-1 bg-yellow-400 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider shadow">
              Select Bet & Press START GAME
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

