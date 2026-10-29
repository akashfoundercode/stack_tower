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

interface FullscreenGameSceneProps {
  gameState: GameState;
  onStackSuccess: (level: number, multiplier: number, bonus: number) => void;
  onGameOver: (finalLevel: number, finalMultiplier: number) => void;
  onPerfectStack: () => void;
  buildTrigger: number;
}

export const FullscreenGameScene: React.FC<FullscreenGameSceneProps> = ({
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

  // RAF references
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const movingXRef = useRef<number>(0);
  const directionRef = useRef<number>(1);
  const movingWidthRef = useRef<number>(BASE_BLOCK_WIDTH);
  const isPlacingRef = useRef<boolean>(false);

  const SWEEP_BOUNDS = 160; // Sweep range inside mobile width

  movingWidthRef.current = movingWidth;

  // Reset when game starts
  useEffect(() => {
    if (gameState === 'PLAYING') {
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

  // Drop block placement
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

    // Camera smoothly follows tower growth once it reaches 3 floors
    if (currentLevel >= 2) {
      setCameraY((currentLevel - 1) * (BLOCK_HEIGHT - 4));
    }

    onStackSuccess(currentLevel, nextMultiplier, result.bonusPoints);

    directionRef.current = directionRef.current * -1;
    movingXRef.current = directionRef.current > 0 ? -SWEEP_BOUNDS : SWEEP_BOUNDS;

    setTimeout(() => {
      isPlacingRef.current = false;
    }, 120);
  }, [gameState, layers, currentLevel, onStackSuccess, onGameOver, onPerfectStack]);

  // External trigger
  const lastTriggerRef = useRef(buildTrigger);
  useEffect(() => {
    if (buildTrigger > lastTriggerRef.current) {
      lastTriggerRef.current = buildTrigger;
      handleDropBlock();
    }
  }, [buildTrigger, handleDropBlock]);

  // Falling debris animation loop
  useEffect(() => {
    if (debris.length === 0) return;
    const timer = setInterval(() => {
      setDebris((prev) =>
        prev
          .map((d) => ({
            ...d,
            y: d.y + 18,
            rotation: d.rotation + (d.direction === 'right' ? 5 : -5),
          }))
          .filter((d) => d.y < 800)
      );
    }, 25);
    return () => clearInterval(timer);
  }, [debris.length]);

  // RAF loop for moving block sweep
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

      const moveDelta = currentSpeed * delta * directionRef.current;
      movingXRef.current += moveDelta;

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

  const activeTheme = COLOR_THEMES[currentLevel % COLOR_THEMES.length];

  return (
    <div
      ref={containerRef}
      onClick={handleDropBlock}
      className="absolute inset-0 overflow-hidden cursor-pointer select-none"
    >
      {/* Background World: Sky, Clouds, Balloons, Background Buildings & Ground */}
      <CityBackground />

      {/* PERFECT! Toast Celebration */}
      {perfectFlash && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-slate-950 font-black text-xl px-5 py-1.5 rounded-full border-2 border-white shadow-[0_0_24px_rgba(250,204,21,0.9)] tracking-wider">
            ⭐ PERFECT! +100 ⭐
          </div>
        </div>
      )}

      {/* Camera Stage: Base sits right above the bottom betting overlay area */}
      <div
        className="absolute inset-x-0 bottom-44 sm:bottom-48 flex flex-col items-center justify-end transition-transform duration-300 ease-out will-change-transform pointer-events-none"
        style={{
          transform: `translate3d(0px, ${cameraY}px, 0px)`,
        }}
      >
        {/* Tower Stack */}
        <div className="relative z-10 w-full flex justify-center">
          <Tower layers={layers} />
        </div>

        {/* Falling cut debris particles */}
        <FallingBlock debrisList={debris} />

        {/* Moving Block Suspended by Crane Hook */}
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
    </div>
  );
};
