import React from 'react';
import { BlockColorTheme } from '../types/game';
import { TowerBlock } from './TowerBlock';

export const HOOK_LOOP_TOP = 35; // Fixed at the very top edge of the screen
export const CABLE_LENGTH = 30;   // Compact suspension cables
export const SWING_TOP = HOOK_LOOP_TOP + CABLE_LENGTH; // Fixed starting top position of obstacle while swinging (65px)

interface MovingBlockProps {
  x: number; // center offset relative to game center in px
  width: number;
  height: number;
  theme: BlockColorTheme;
  level: number;
  dropOffsetY?: number; // visual drop top offset (from SWING_TOP down to tower roof)
  tilt?: number; // tilt swing angle in degrees
  isDropping?: boolean;
  hookX?: number; // horizontal trolley travel of the hook along top track
  winchY?: number; // vertical descent from top ceiling (starts negative, descends smoothly to 0)
}

export const MovingBlock: React.FC<MovingBlockProps> = ({
  x,
  width,
  height,
  theme,
  level,
  dropOffsetY = SWING_TOP,
  tilt = 0,
  isDropping = false,
  hookX = 0,
  winchY = 0,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Top Crane Track / Girder Beam across the ceiling where trolley moves */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-30"
        style={{
          width: '380px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent 0%, #334155 10%, #475569 50%, #334155 90%, transparent 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      />

      {/* 1. SINGLE UNIFIED CRANE TROLLEY, HOOK & OBSTACLE (All move left-right together & winch down from ceiling!) */}
      {!isDropping ? (
        <div
          className="absolute left-1/2 top-0 pointer-events-none z-40 flex flex-col items-center"
          style={{
            width: `${width}px`,
            marginLeft: `${-width / 2}px`,
            transform: `translate3d(${hookX}px, ${winchY}px, 0px)`,
            transition: 'none',
          }}
        >
          {/* Top Crane Trolley / Mounting Bracket at very top edge */}
          <div
            style={{
              width: '32px',
              height: '4px',
              backgroundColor: '#334155',
              borderRadius: '0 0 2px 2px',
              border: '1px solid #1e293b',
              borderTop: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          />

          {/* Short vertical crane cable (15px) */}
          <div
            style={{
              width: '3px',
              height: '15px',
              background: 'repeating-linear-gradient(0deg, #1e293b 0px, #1e293b 2.5px, #64748b 2.5px, #64748b 5px)',
            }}
          />

          {/* Yellow Crane Pulley Block */}
          <div className="w-5 h-5 rounded-md bg-yellow-400 border-[1.5px] border-yellow-600 shadow-sm flex items-center justify-center relative">
            <div className="w-2 h-2 rounded-full bg-slate-900 border border-yellow-200" />
          </div>

          {/* Black Hook Loop: Bottom inside of this loop is at exactly HOOK_LOOP_TOP (35px) */}
          <div className="w-3.5 h-3.5 border-[2.5px] border-stone-800 rounded-b-full border-t-0 -mt-0.5 shadow-sm" />

          {/* PENDULUM SWING (Hanging directly from hook loop, swinging with tilt) */}
          <div
            className="flex flex-col items-center pointer-events-none -mt-1.5"
            style={{
              width: `${width}px`,
              transformOrigin: 'top center', // Exact hook loop pivot point!
              transform: `rotate(${tilt}deg)`,
              transition: 'none',
            }}
          >
            {/* Triangular suspension cables from Hook Loop down to Obstacle */}
            <svg
              className="overflow-visible block"
              width={width}
              height={CABLE_LENGTH}
              style={{ width: `${width}px`, height: `${CABLE_LENGTH}px` }}
            >
              {/* Top eyelet attachment ring interlocking inside the hook loop */}
              <circle
                cx={width / 2}
                cy={2}
                r={2.2}
                fill="none"
                stroke="#1e293b"
                strokeWidth="1.5"
              />

              {/* Left suspension cable */}
              <line
                x1={width / 2}
                y1={2}
                x2={width * 0.22}
                y2={CABLE_LENGTH}
                stroke="#334155"
                strokeWidth="1.5"
              />
              <line
                x1={width / 2}
                y1={2}
                x2={width * 0.22}
                y2={CABLE_LENGTH}
                stroke="#94a3b8"
                strokeWidth="0.5"
              />

              {/* Right suspension cable */}
              <line
                x1={width / 2}
                y1={2}
                x2={width * 0.78}
                y2={CABLE_LENGTH}
                stroke="#334155"
                strokeWidth="1.5"
              />
              <line
                x1={width / 2}
                y1={2}
                x2={width * 0.78}
                y2={CABLE_LENGTH}
                stroke="#94a3b8"
                strokeWidth="0.5"
              />

              {/* Left shackle clamp on obstacle roof */}
              <rect
                x={width * 0.22 - 2.5}
                y={CABLE_LENGTH - 2.5}
                width={5}
                height={2.5}
                fill="#475569"
                stroke="#1e293b"
                strokeWidth="0.5"
                rx={0.5}
              />
              {/* Right shackle clamp on obstacle roof */}
              <rect
                x={width * 0.78 - 2.5}
                y={CABLE_LENGTH - 2.5}
                width={5}
                height={2.5}
                fill="#475569"
                stroke="#1e293b"
                strokeWidth="0.5"
                rx={0.5}
              />
            </svg>

            {/* Obstacle Building Block */}
            <div
              style={{
                width: `${width}px`,
                height: `${height}px`,
              }}
            >
              <TowerBlock
                width={width}
                height={height}
                theme={theme}
                level={level}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Top Hook stays at top release position when obstacle drops */}
          <div
            className="absolute left-1/2 top-0 pointer-events-none z-40 flex flex-col items-center"
            style={{
              width: `${width}px`,
              marginLeft: `${-width / 2}px`,
              transform: `translate3d(${hookX}px, 0px, 0px)`,
              transition: 'none',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '4px',
                backgroundColor: '#334155',
                borderRadius: '0 0 2px 2px',
                border: '1px solid #1e293b',
                borderTop: 'none',
              }}
            />
            <div
              style={{
                width: '3px',
                height: '15px',
                background: 'repeating-linear-gradient(0deg, #1e293b 0px, #1e293b 2.5px, #64748b 2.5px, #64748b 5px)',
              }}
            />
            <div className="w-5 h-5 rounded-md bg-yellow-400 border-[1.5px] border-yellow-600 shadow-sm flex items-center justify-center relative">
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-yellow-200" />
            </div>
            <div className="w-3.5 h-3.5 border-[2.5px] border-stone-800 rounded-b-full border-t-0 -mt-0.5 shadow-sm" />
          </div>

          {/* 2. DROPPING OBSTACLE (Falls in exact tilted position from top hook onto tower roof — ZERO JHATKA!) */}
          <div
            className="absolute left-1/2 pointer-events-none"
            style={{
              top: `${dropOffsetY}px`,
              width: `${width}px`,
              height: `${height}px`,
              marginLeft: `${-width / 2}px`,
              transform: `translate3d(${x}px, 0px, 0px) rotate(${tilt}deg)`,
              transformOrigin: 'center center',
              transition: 'none',
            }}
          >
            <TowerBlock
              width={width}
              height={height}
              theme={theme}
              level={level}
            />
          </div>
        </>
      )}
    </div>
  );
};
