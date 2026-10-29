import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Skull, RotateCcw, TrendingUp } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface ResultModalProps {
  isOpen: boolean;
  status: 'CASHED_OUT' | 'GAME_OVER';
  betAmount: number;
  multiplier: number;
  payout: number;
  highestLevel: number;
  onPlayAgain: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  status,
  betAmount,
  multiplier,
  payout,
  highestLevel,
  onPlayAgain,
}) => {
  useEffect(() => {
    if (isOpen && status === 'CASHED_OUT') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#ffffff'],
      });
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  const isWin = status === 'CASHED_OUT' && payout > betAmount;
  const netProfit = payout - betAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Glowing aura header */}
        <div
          className={`absolute -top-24 inset-x-0 h-40 blur-3xl rounded-full ${
            isWin ? 'bg-emerald-500/30' : 'bg-rose-500/20'
          }`}
        />

        {/* Badge Icon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 shadow-xl border-2 ${
            isWin
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
              : 'bg-rose-500/20 border-rose-400 text-rose-400'
          }`}
        >
          {isWin ? <Trophy className="w-9 h-9" /> : <Skull className="w-9 h-9" />}
        </div>

        {/* Status text */}
        <h2 className="text-2xl font-black text-white tracking-tight">
          {isWin ? 'CASHED OUT!' : 'TOWER CRASHED!'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isWin
            ? 'Great timing! You cashed out before the tower fell.'
            : 'The block missed the tower structure!'}
        </p>

        {/* Big Payout / Loss Number */}
        <div className="my-5 flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            {isWin ? 'Total Payout' : 'Net Loss'}
          </span>
          <span
            className={`text-4xl font-black font-mono tracking-tight ${
              isWin ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isWin
              ? `₹${payout.toLocaleString('en-IN')}`
              : `-₹${betAmount.toLocaleString('en-IN')}`}
          </span>
          {isWin && (
            <span className="text-xs font-bold text-emerald-400/90 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Net Profit: +₹{netProfit.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Detailed Breakdown */}
        <div className="w-full bg-slate-950/70 rounded-xl p-3 border border-slate-800 flex flex-col gap-2 mb-6">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Original Bet:</span>
            <span className="text-white font-mono font-bold">₹{betAmount}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Floors Reached:</span>
            <span className="text-sky-400 font-bold">{highestLevel} Floors</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Multiplier:</span>
            <span className="text-amber-400 font-mono font-black">
              {multiplier.toFixed(2)}x
            </span>
          </div>
        </div>

        {/* Play Again button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onPlayAgain();
          }}
          className="w-full py-3.5 rounded-xl font-black text-lg uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 active:scale-95 border-2 border-yellow-200 shadow-[0_4px_16px_rgba(245,158,11,0.4)] transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
};
