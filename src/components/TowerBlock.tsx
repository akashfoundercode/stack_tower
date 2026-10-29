import React from 'react';
import { BlockColorTheme } from '../types/game';

interface TowerBlockProps {
  width: number;
  height: number;
  theme: BlockColorTheme;
  level: number;
  isBase?: boolean;
  isPerfect?: boolean;
}

export const TowerBlock: React.FC<TowerBlockProps> = ({
  width,
  height,
  theme,
  level,
  isBase = false,
  isPerfect = false,
}) => {
  // If base shop (Level 0, like in screenshot with "1win" / "MEGA TOWER" blue shop with awning and doors)
  if (isBase) {
    return (
      <div
        className="relative rounded-t-sm shadow-2xl flex flex-col justify-between overflow-hidden"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: `linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%)`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.4)',
          border: '2px solid #172554',
        }}
      >
        {/* Signboard Banner */}
        <div className="w-full bg-blue-600/95 py-1 px-3 border-b-2 border-blue-400/50 flex items-center justify-center shadow-md">
          <span className="text-white font-extrabold tracking-wider text-xs md:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] uppercase">
            ⚡ SKY TOWER
          </span>
        </div>

        {/* Storefront Window and Double Doors */}
        <div className="flex-1 px-4 py-1.5 flex items-end justify-center gap-3">
          {/* Glass window */}
          <div className="w-10 h-8 bg-sky-200/90 rounded-t border-2 border-blue-300 shadow-inner flex items-center justify-center relative overflow-hidden">
            <div className="absolute -top-3 -right-3 w-6 h-12 bg-white/40 transform rotate-45 pointer-events-none" />
            <div className="w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_#fde047]" />
          </div>

          {/* Double Door */}
          <div className="w-12 h-10 bg-slate-900 rounded-t border-2 border-blue-400 flex justify-between p-0.5 shadow-md">
            <div className="w-[48%] h-full bg-blue-900 border-r border-blue-700 rounded-tl flex items-center justify-end pr-0.5">
              <div className="w-1 h-1.5 bg-yellow-400 rounded-full shadow" />
            </div>
            <div className="w-[48%] h-full bg-blue-900 rounded-tr flex items-center justify-start pl-0.5">
              <div className="w-1 h-1.5 bg-yellow-400 rounded-full shadow" />
            </div>
          </div>

          {/* Second Window */}
          <div className="w-10 h-8 bg-sky-200/90 rounded-t border-2 border-blue-300 shadow-inner flex items-center justify-center relative overflow-hidden">
            <div className="absolute -top-3 -right-3 w-6 h-12 bg-white/40 transform rotate-45 pointer-events-none" />
            <div className="w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_#fde047]" />
          </div>
        </div>

        {/* Stone foundation strip */}
        <div className="h-1.5 bg-slate-800 border-t border-slate-700" />
      </div>
    );
  }

  // Stacked Building Floor (Architectural details: shutters, windows, laundry line, brick textures)
  const windowCount = Math.max(1, Math.min(4, Math.floor(width / 50)));

  return (
    <div
      className={`relative rounded-xs flex flex-col justify-between overflow-hidden transition-all duration-150 ${
        isPerfect ? 'ring-2 ring-yellow-300 brightness-110' : ''
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: theme.primary,
        backgroundImage: `
          linear-gradient(180deg, ${theme.secondary} 0%, ${theme.primary} 70%, ${theme.roof} 100%),
          repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(0,0,0,0.06) 18px, rgba(0,0,0,0.06) 19px)
        `,
        boxShadow: '0 6px 16px rgba(0,0,0,0.35), inset 0 2px 3px rgba(255,255,255,0.35)',
        border: '1.5px solid rgba(0,0,0,0.3)',
      }}
    >
      {/* Ledge / Molded cornice on top */}
      <div
        className="w-full h-2 shadow-sm flex items-center justify-between px-1"
        style={{ backgroundColor: theme.roof }}
      >
        <div className="w-2 h-0.5 bg-white/40 rounded-full" />
        <div className="text-[9px] font-black text-white/70 tracking-widest px-1">
          L.{level}
        </div>
        <div className="w-2 h-0.5 bg-white/40 rounded-full" />
      </div>

      {/* Floor Windows and Architectural facade */}
      <div className="flex-1 flex items-center justify-around px-2 py-1">
        {Array.from({ length: windowCount }).map((_, i) => (
          <div
            key={i}
            className="relative flex items-center justify-center"
            style={{ width: `${Math.min(36, (width - 24) / windowCount)}px`, height: '36px' }}
          >
            {/* Green / Wood Shutters like Italian screenshot */}
            <div className="absolute -left-1 top-0 bottom-0 w-1.5 bg-emerald-800 rounded-l border border-emerald-950 shadow-sm" />
            <div className="absolute -right-1 top-0 bottom-0 w-1.5 bg-emerald-800 rounded-r border border-emerald-950 shadow-sm" />

            {/* Window frame */}
            <div className="w-full h-full bg-slate-900 rounded-sm border border-stone-200/60 p-0.5 flex flex-col justify-between shadow-inner">
              <div className="w-full h-1/2 bg-amber-100/90 rounded-xs flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-[1px] bg-stone-700/50 absolute" />
                <div className="w-[1px] h-full bg-stone-700/50 absolute" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-80" />
              </div>
              <div className="w-full h-1/2 bg-amber-100/80 rounded-xs flex items-center justify-center relative overflow-hidden">
                <div className="w-full h-[1px] bg-stone-700/50 absolute" />
                <div className="w-[1px] h-full bg-stone-700/50 absolute" />
              </div>
            </div>

            {/* Window flower box */}
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-stone-800 rounded-xs flex justify-around items-center px-0.5">
              <span className="w-1 h-1 rounded-full bg-rose-500" />
              <span className="w-1 h-1 rounded-full bg-yellow-400" />
              <span className="w-1 h-1 rounded-full bg-emerald-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Laundry line or balcony details if wider than 140px */}
      {width > 140 && (level % 2 === 0) && (
        <div className="absolute bottom-1 left-4 right-4 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[1px] bg-stone-400/80 relative flex justify-around">
            <span className="w-2 h-2.5 bg-white rounded-b-xs shadow -mt-0.5" />
            <span className="w-2.5 h-2 bg-sky-300 rounded-b-xs shadow -mt-0.5" />
            <span className="w-2 h-2.5 bg-yellow-300 rounded-b-xs shadow -mt-0.5" />
          </div>
        </div>
      )}

      {/* Bottom Trim */}
      <div className="w-full h-1.5 bg-black/25" />
    </div>
  );
};
