import React from 'react';
import { Volume2, VolumeX, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface HeaderProps {
  demoBalance: number;
  onResetBalance: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  demoBalance,
  onResetBalance,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
}) => {
  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-lg">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 p-0.5 shadow-md flex items-center justify-center">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <span className="text-xl">🏗️</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-lg md:text-xl tracking-tight bg-gradient-to-r from-yellow-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
              TOWER CRASH
            </span>
            <span className="bg-yellow-400/20 text-yellow-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-yellow-400/30 uppercase">
              PRO
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Fair Arcade Stacking Engine</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Demo Wallet, Sound & History */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Demo Wallet Display */}
        <div className="flex flex-col items-end bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-inner">
          <span className="text-[10px] text-amber-400/90 font-bold uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> DEMO CREDITS
          </span>
          <div className="flex items-center gap-1">
            <span className="text-sm md:text-base font-extrabold text-emerald-400 font-mono">
              ₹{demoBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <button
              onClick={() => {
                soundFx.playClick();
                onResetBalance();
              }}
              title="Reset Demo Balance to ₹10,000"
              className="text-slate-400 hover:text-yellow-400 p-1 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* History Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenHistory();
          }}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 md:px-3 md:py-2 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5 shadow"
        >
          <span className="hidden md:inline">History</span>
          <span>📋</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={() => {
            onToggleSound();
          }}
          className={`p-2 rounded-xl border transition ${
            soundEnabled
              ? 'bg-slate-800 text-yellow-400 border-yellow-400/40'
              : 'bg-slate-800/60 text-slate-400 border-slate-700'
          }`}
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
      </div>
    </header>
  );
};
