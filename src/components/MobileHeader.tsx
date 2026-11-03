import React from 'react';
import { Menu, Wifi, MoreHorizontal } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface MobileHeaderProps {
  demoBalance: number;
  onResetBalance: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  onOpenTutorial?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  demoBalance,
  onResetBalance,
  onOpenHistory,
  onOpenTutorial,
}) => {
  return (
    <div className="w-full px-4 pt-3 pb-2 flex items-center justify-between pointer-events-auto bg-transparent">
      {/* Left: Hamburger Menu + How To Play (?) Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenHistory();
          }}
          className="text-white hover:text-white p-2 rounded-xl bg-sky-950/30 hover:bg-sky-950/50 backdrop-blur-md border border-white/20 active:scale-95 transition shadow-sm"
          title="Menu & History"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>

        {onOpenTutorial && (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenTutorial();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-950/30 hover:bg-sky-950/50 backdrop-blur-md border border-white/20 active:scale-95 transition shadow-sm text-xs font-black text-amber-300 hover:text-white"
            title="How to Play Tutorial"
          >
            <span className="text-sm">❓</span>
            <span className="hidden sm:inline font-mono uppercase tracking-wider text-[11px]">Help</span>
          </button>
        )}
      </div>

      {/* Center / Right: Network signal + ID and Currency Balance */}
      <div className="flex items-center gap-2.5">
        {/* Right Info: ID & Balance (green signal bar + ID + INR) */}
        <div className="flex flex-col items-end leading-none bg-sky-950/35 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl shadow-sm">
          <div className="flex items-center gap-1 mb-0.5">
            <Wifi className="w-3 h-3 text-emerald-400 rotate-90" />
            <span className="text-[10px] text-white/80 font-mono tracking-tight font-semibold">
              ID : 0
            </span>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onResetBalance();
            }}
            title="Click to reset balance"
            className="flex items-center gap-1 active:scale-95 transition"
          >
            <span className="text-sm sm:text-base font-black text-white font-mono tracking-tight">
              {Math.floor(demoBalance).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-extrabold text-amber-300">INR</span>
          </button>
        </div>

        {/* Right Circular Blue Dots Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onResetBalance();
          }}
          className="w-8 h-8 rounded-full bg-gradient-to-b from-sky-400 to-sky-600 border border-sky-300/60 shadow flex items-center justify-center text-white active:scale-95 transition hover:brightness-110"
          title="Game Options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

