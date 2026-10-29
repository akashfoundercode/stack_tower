import React from 'react';
import { BlockColorTheme } from '../types/game';
import { TowerBlock } from './TowerBlock';

interface MovingBlockProps {
  x: number; // center offset relative to game center in px
  width: number;
  height: number;
  theme: BlockColorTheme;
  level: number;
}

export const MovingBlock: React.FC<MovingBlockProps> = ({
  x,
  width,
  height,
  theme,
  level,
}) => {
  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-30"
      style={{
        transform: `translate3d(calc(-50% + ${x}px), 0px, 0px)`,
        width: `${width}px`,
        height: `${height}px`,
        transition: 'none', // Handled strictly by requestAnimationFrame
      }}
    >
      {/* Crane Hook & Suspension Ropes (Inspired by screenshot construction crane hook) */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        {/* Steel Cable going up offscreen */}
        <div className="w-1 h-8 bg-gradient-to-b from-stone-400 to-stone-600 shadow-sm" />

        {/* Industrial Crane Hook (Yellow/Black striped pulley) */}
        <div className="w-6 h-6 rounded-md bg-yellow-400 border border-yellow-600 shadow-md flex items-center justify-center relative">
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-yellow-200" />
          {/* Hook metallic curved loop */}
          <div className="absolute -bottom-2 w-3.5 h-3.5 border-2 border-stone-800 rounded-b-full border-t-0" />
        </div>

        {/* Diagonal wire harness spread across block width */}
        <svg
          className="overflow-visible"
          width={width}
          height="16"
          style={{ width: `${width}px`, height: '16px' }}
        >
          <line
            x1={width / 2}
            y1={0}
            x2={Math.min(width * 0.15, 20)}
            y2={16}
            stroke="#475569"
            strokeWidth="1.5"
          />
          <line
            x1={width / 2}
            y1={0}
            x2={Math.max(width * 0.85, width - 20)}
            y2={16}
            stroke="#475569"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Pulsing Highlight Aura around active block */}
      <div className="absolute -inset-1 rounded-sm bg-yellow-300/30 blur-sm animate-pulse-glow" />

      {/* Building Floor */}
      <div className="relative">
        <TowerBlock
          width={width}
          height={height}
          theme={theme}
          level={level}
        />
      </div>
    </div>
  );
};

