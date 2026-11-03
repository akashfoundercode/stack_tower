import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Crown,
  Sparkles,
  RotateCcw,
  TrendingUp,
  Zap,
  Coins,
  ShieldAlert,
  Layers,
  ArrowUpRight,
  Star,
} from 'lucide-react';
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
      soundFx.playCashOut();
      // Double Confetti Cannons from Left & Right for true Casino VIP feeling!
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 65,
        origin: { x: 0.12, y: 0.65 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#38bdf8', '#ffffff', '#ffd700'],
      });
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 65,
        origin: { x: 0.88, y: 0.65 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#38bdf8', '#ffffff', '#ffd700'],
      });

      // Follow-up golden star sparkle shower
      setTimeout(() => {
        confetti({
          particleCount: 45,
          spread: 85,
          origin: { y: 0.38 },
          colors: ['#fef08a', '#fbbf24', '#f59e0b', '#ffd700'],
        });
      }, 260);
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  const isWin = status === 'CASHED_OUT' && payout > betAmount;
  const netProfit = payout - betAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300 select-none">
      {/* 1. LUXURY BACKGROUND SUNBURST & AMBIENT AURA */}
      {isWin ? (
        <div className="absolute w-[440px] h-[440px] pointer-events-none -z-10 flex items-center justify-center">
          {/* Rotating 24K Gold Sunburst Rays */}
          <div
            className="absolute inset-0 rounded-full animate-spin-slow opacity-30"
            style={{
              background:
                'repeating-conic-gradient(from 0deg, rgba(251, 191, 36, 0.45) 0deg 12deg, transparent 12deg 24deg)',
            }}
          />
          {/* Luminous Golden / Emerald Nebula */}
          <div className="w-80 h-80 rounded-full bg-gradient-to-r from-amber-500/40 via-yellow-400/50 to-emerald-500/30 blur-3xl animate-pulse" />
        </div>
      ) : (
        <div className="absolute w-[440px] h-[440px] pointer-events-none -z-10 flex items-center justify-center">
          {/* Deep Ruby Nebula */}
          <div className="w-80 h-80 rounded-full bg-gradient-to-r from-rose-600/35 via-red-500/40 to-slate-900/60 blur-3xl animate-pulse" />
        </div>
      )}

      {/* 2. MAIN 3D LUXURY MODAL CARD */}
      <div
        className={`w-full max-w-[360px] sm:max-w-[385px] rounded-[32px] p-6 sm:p-7 relative overflow-hidden flex flex-col items-center text-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] animate-luxury-entry ${
          isWin
            ? 'bg-gradient-to-b from-[#14182b] via-[#0b0e1b] to-[#05070d] border-2 border-amber-300/60 shadow-[0_0_40px_rgba(245,158,11,0.35),inset_0_1px_2px_rgba(255,255,255,0.4)]'
            : 'bg-gradient-to-b from-[#1c0f16] via-[#10080d] to-[#060408] border-2 border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.25),inset_0_1px_2px_rgba(255,255,255,0.2)]'
        }`}
      >
        {/* Top Gold / Ruby Shimmer Line */}
        <div
          className={`absolute top-0 inset-x-8 h-[2px] ${
            isWin
              ? 'bg-gradient-to-r from-transparent via-yellow-300 to-transparent shadow-[0_0_10px_#fde047]'
              : 'bg-gradient-to-r from-transparent via-rose-400 to-transparent shadow-[0_0_10px_#fb7185]'
          }`}
        />

        {/* 3. 3D METALLIC CREST EMBLEM */}
        <div className="relative mb-3 flex flex-col items-center">
          {/* Top VIP Ribbon Pill */}
          <div
            className={`px-3.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-2 border shadow-md flex items-center gap-1.5 ${
              isWin
                ? 'bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 border-yellow-400/50 text-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.3)]'
                : 'bg-gradient-to-r from-rose-500/20 via-rose-400/30 to-rose-500/20 border-rose-400/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
            }`}
          >
            <Star className="w-2.5 h-2.5 fill-current" />
            <span>{isWin ? 'MEGA WINNER' : 'ROUND FINISHED'}</span>
            <Star className="w-2.5 h-2.5 fill-current" />
          </div>

          {/* 3D Multi-Tier Beveled Crest */}
          <div
            className={`p-1 rounded-[26px] shadow-2xl relative ${
              isWin
                ? 'bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 shadow-[0_12px_28px_rgba(245,158,11,0.55)]'
                : 'bg-gradient-to-br from-rose-400 via-rose-600 to-rose-900 shadow-[0_12px_28px_rgba(225,29,72,0.45)]'
            }`}
          >
            <div className="w-20 h-20 rounded-[22px] bg-gradient-to-b from-[#181d33] to-[#0a0d17] flex items-center justify-center relative overflow-hidden border border-white/15">
              {/* Internal Radiant Sheen */}
              <div
                className={`absolute inset-0 opacity-40 ${
                  isWin
                    ? 'bg-gradient-to-tr from-amber-400/30 via-transparent to-yellow-200/40'
                    : 'bg-gradient-to-tr from-rose-500/30 via-transparent to-rose-200/20'
                }`}
              />

              {isWin ? (
                <div className="relative flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-yellow-300 drop-shadow-[0_4px_12px_rgba(250,204,21,0.8)]" />
                  <Crown className="w-5 h-5 text-yellow-200 absolute -top-3.5 fill-yellow-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" />
                  <Sparkles className="w-4 h-4 text-white absolute -top-1 -right-2 animate-pulse" />
                </div>
              ) : (
                <div className="relative flex items-center justify-center">
                  <ShieldAlert className="w-10 h-10 text-rose-400 drop-shadow-[0_4px_12px_rgba(244,63,94,0.8)]" />
                  <Sparkles className="w-4 h-4 text-rose-300/60 absolute -top-1 -right-2" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. TITLE & MULTIPLIER BADGE */}
        <h2
          className={`text-2xl sm:text-3xl font-black italic tracking-wide uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] ${
            isWin ? 'text-white' : 'text-slate-100'
          }`}
        >
          {isWin ? 'CASHOUT SUCCESS!' : 'TOWER COLLAPSED!'}
        </h2>

        {/* Glowing Multiplier Pill */}
        <div className="mt-2 mb-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-xs sm:text-sm font-black tracking-widest shadow-lg ${
              isWin
                ? 'bg-gradient-to-r from-amber-400/20 via-yellow-300/30 to-amber-500/20 border-yellow-300/60 text-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.35)]'
                : 'bg-rose-500/15 border-rose-400/40 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.25)]'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isWin ? 'text-yellow-300 fill-yellow-300' : 'text-rose-400'}`} />
            <span>{multiplier.toFixed(2)}x MULTIPLIER</span>
          </div>
        </div>

        {/* 5. BIG HERO PAYOUT / LOSS AMOUNT */}
        <div className="my-2 flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
            {isWin ? 'Total Payout Received' : 'Net Round Loss'}
          </span>

          <div
            className={`text-4xl sm:text-5xl font-black font-mono tracking-tight my-1 drop-shadow-lg ${
              isWin
                ? 'text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fef08a] to-[#eab308] drop-shadow-[0_4px_18px_rgba(234,179,8,0.55)]'
                : 'text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#fca5a5] to-[#ef4444] drop-shadow-[0_4px_18px_rgba(239,68,68,0.45)]'
            }`}
          >
            {isWin
              ? `₹${payout.toLocaleString('en-IN')}`
              : `-₹${betAmount.toLocaleString('en-IN')}`}
          </div>

          {/* Net Profit Pill or Loss Encouragement */}
          {isWin ? (
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.3)] mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>PROFIT: +₹{netProfit.toLocaleString('en-IN')}</span>
            </div>
          ) : (
            <span className="text-xs text-rose-300/80 font-medium mt-1">
              Block missed on Floor {highestLevel + 1}
            </span>
          )}
        </div>

        {/* 6. GLASS STATS GRID (Initial Bet | Floor | Peak Mult) */}
        <div className="w-full grid grid-cols-3 gap-2 my-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-2.5 backdrop-blur-md">
          {/* Initial Stake */}
          <div className="flex flex-col items-center p-1.5 rounded-xl bg-slate-950/40 border border-white/5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Coins className="w-2.5 h-2.5 text-yellow-400" />
              STAKE
            </span>
            <span className="text-xs sm:text-sm font-black font-mono text-white mt-0.5">
              ₹{betAmount}
            </span>
          </div>

          {/* Floors Stacked */}
          <div className="flex flex-col items-center p-1.5 rounded-xl bg-slate-950/40 border border-white/5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-2.5 h-2.5 text-sky-400" />
              FLOORS
            </span>
            <span className="text-xs sm:text-sm font-black font-mono text-sky-300 mt-0.5">
              L.{highestLevel}
            </span>
          </div>

          {/* Peak Multiplier */}
          <div className="flex flex-col items-center p-1.5 rounded-xl bg-slate-950/40 border border-white/5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ArrowUpRight className="w-2.5 h-2.5 text-amber-400" />
              BOOST
            </span>
            <span className="text-xs sm:text-sm font-black font-mono text-amber-300 mt-0.5">
              {multiplier.toFixed(2)}x
            </span>
          </div>
        </div>

        {/* 7. 3D GOLD / RUBY TACTILE ACTION BUTTON */}
        <button
          onClick={() => {
            soundFx.playClick();
            onPlayAgain();
          }}
          className={`w-full py-4 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider text-slate-950 transition-all duration-150 flex items-center justify-center gap-2 active:scale-95 shadow-xl ${
            isWin
              ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 border-t-2 border-white/70 shadow-[0_8px_24px_rgba(245,158,11,0.5),inset_0_2px_2px_rgba(255,255,255,0.7)]'
              : 'bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 hover:brightness-110 border-t-2 border-white/70 shadow-[0_8px_24px_rgba(244,63,94,0.45),inset_0_2px_2px_rgba(255,255,255,0.7)]'
          }`}
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span>{isWin ? 'COLLECT & PLAY AGAIN' : 'TRY AGAIN'}</span>
        </button>
      </div>
    </div>
  );
};


