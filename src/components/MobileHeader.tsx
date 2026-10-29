import React from 'react';
import { Volume2, VolumeX, RotateCcw, History, ArrowLeft, Plus } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface MobileHeaderProps {
  demoBalance: number;
  onResetBalance: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  demoBalance,
  onResetBalance,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
}) => {
  return (
    <div className="absolute top-0 inset-x-0 z-40 px-3 pt-3 pb-2 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/60 via-black/30 to-transparent">
      {/* Left: Back / Title / Sound */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            soundFx.playClick();
          }}
          className="flex items-center text-xs font-bold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 active:scale-95 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Lobby</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={onToggleSound}
          className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 active:scale-95 transition"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-yellow-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-white/50" />
          )}
        </button>
      </div>

      {/* Center: Currency & Live Balance Pill */}
      <div className="flex items-center bg-black/50 backdrop-blur-md border border-white/15 rounded-full pl-3 pr-1 py-1 shadow-lg">
        <div className="flex flex-col items-center mr-2">
          <span className="text-[8px] font-extrabold text-amber-400/90 tracking-widest leading-none">
            INR ₹
          </span>
          <span className="text-sm font-black text-white font-mono leading-none tracking-tight">
            {demoBalance.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Deposit / Add Demo Credits Button (Green pill exactly like "Isi ulang" in screenshot) */}
        <button
          onClick={() => {
            soundFx.playClick();
            onResetBalance();
          }}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-0.5 active:scale-95 transition uppercase tracking-wide"
          title="Reset to ₹10,000"
        >
          <Plus className="w-3 h-3 stroke-[3]" />
          <span>Top Up</span>
        </button>
      </div>

      {/* Right: History & Reset options */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenHistory();
          }}
          className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 active:scale-95 transition"
          title="Round History"
        >
          <History className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundFx.playClick();
            onResetBalance();
          }}
          className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-amber-400 active:scale-95 transition"
          title="Reset Balance"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
