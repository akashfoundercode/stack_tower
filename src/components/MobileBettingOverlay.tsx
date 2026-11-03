import React from 'react';
import { GameState } from '../types/game';
import { Minus, Plus, Banknote } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface MobileBettingOverlayProps {
  gameState: GameState;
  betAmount: number;
  onBetChange: (val: number) => void;
  onStartGame: () => void;
  onBuild: () => void;
  onCashOut: () => void;
  multiplier: number;
  level: number;
  demoBalance: number;
  dropTimeLeft?: number;
}

export const MobileBettingOverlay: React.FC<MobileBettingOverlayProps> = ({
  gameState,
  betAmount,
  onBetChange,
  onStartGame,
  onBuild,
  onCashOut,
  multiplier,
  level,
  demoBalance,
  dropTimeLeft,
}) => {
  const isPlaying = gameState === 'PLAYING';
  const potentialPayout = Math.floor(betAmount * multiplier * 100) / 100;
  const canCashOut = isPlaying && level >= 1;

  const handleAdjust = (delta: number) => {
    soundFx.playClick();
    const next = Math.max(10, Math.min(demoBalance, betAmount + delta));
    onBetChange(next);
  };

  const handleAllIn = () => {
    soundFx.playClick();
    onBetChange(Math.max(10, demoBalance));
  };

  const handleDouble = () => {
    soundFx.playClick();
    const next = Math.min(demoBalance, betAmount * 2);
    onBetChange(next);
  };

  return (
    <div className="w-full flex flex-col gap-2 pointer-events-auto select-none">
      {/* Hazard Warning Strip Border Top (Exact black/yellow diagonal stripes as reference) */}
      <div
        className="w-full h-2.5 sm:h-3 rounded-full shadow-md border border-black/40 overflow-hidden"
        style={{
          background:
            'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 14px, #111827 14px, #111827 28px)',
        }}
      />

      {/* Betting Control Container:
          Mobile: Stacked rows (ALL IN / Stepper / x2 on top, BUILD on bottom)
          Desktop (md+): Side-by-side horizontal dock (ALL IN / Stepper / x2 on LEFT, BUILD on RIGHT) */}
      <div className="w-full flex flex-col md:flex-row md:items-center md:gap-3 gap-2">
        {/* LEFT SIDE ON DESKTOP: [ ALL IN ]  [ -   10   + ]  [ x2 ] */}
        <div className="flex items-stretch gap-2 w-full md:flex-1">
          {/* ALL IN Button (Bright Blue Glossy Pill with bevel & shadow) */}
          <button
            disabled={isPlaying || demoBalance <= 0}
            onClick={handleAllIn}
            className="flex-1 md:max-w-[120px] h-12 sm:h-13 rounded-2xl font-black text-sm sm:text-base tracking-wider text-white uppercase disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition flex items-center justify-center shadow-[0_6px_16px_rgba(37,99,235,0.45)] border-t border-b-2 border-x border-t-sky-300/60 border-b-blue-900 border-x-blue-600 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, #3b82f6 0%, #2563eb 45%, #1d4ed8 75%, #1e40af 100%)',
            }}
          >
            {/* Top glass highlight reflection */}
            <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
            <span className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">ALL IN</span>
          </button>

          {/* Stepper Capsule [ -   AMOUNT   + ] (Dark metallic frame with sunken circular buttons) */}
          <div
            className="flex-[1.6] sm:flex-[1.8] md:flex-1 h-12 sm:h-13 rounded-2xl border-2 border-stone-600/70 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.4)] flex items-center justify-between px-2 relative"
            style={{
              background: 'linear-gradient(180deg, #374151 0%, #1f2937 55%, #111827 100%)',
            }}
          >
            {/* Circular Minus Button */}
            <button
              disabled={isPlaying || betAmount <= 10}
              onClick={() => handleAdjust(-10)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full disabled:opacity-30 disabled:pointer-events-none text-white/90 active:scale-90 transition flex items-center justify-center shadow-[inset_0_2px_3px_rgba(255,255,255,0.15),0_2px_4px_rgba(0,0,0,0.6)] border border-stone-600"
              style={{
                background: 'linear-gradient(180deg, #4b5563 0%, #374151 50%, #1f2937 100%)',
              }}
            >
              <Minus className="w-4 h-4 stroke-[3]" />
            </button>

            {/* Editable Amount Input */}
            <div className="flex-1 flex items-center justify-center px-1">
              <input
                type="number"
                disabled={isPlaying}
                value={betAmount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (!isNaN(val) && val >= 0) {
                    onBetChange(Math.min(demoBalance, val));
                  }
                }}
                className="w-full bg-transparent text-center text-xl sm:text-2xl font-black text-white outline-none font-mono tracking-tight drop-shadow-md select-text"
              />
            </div>

            {/* Circular Plus Button */}
            <button
              disabled={isPlaying || betAmount >= demoBalance}
              onClick={() => handleAdjust(10)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full disabled:opacity-30 disabled:pointer-events-none text-white/90 active:scale-90 transition flex items-center justify-center shadow-[inset_0_2px_3px_rgba(255,255,255,0.15),0_2px_4px_rgba(0,0,0,0.6)] border border-stone-600"
              style={{
                background: 'linear-gradient(180deg, #4b5563 0%, #374151 50%, #1f2937 100%)',
              }}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* x2 Button (Bright Blue Glossy Pill matching ALL IN) */}
          <button
            disabled={isPlaying || betAmount * 2 > demoBalance}
            onClick={handleDouble}
            className="flex-1 md:max-w-[100px] h-12 sm:h-13 rounded-2xl font-black text-sm sm:text-base tracking-wider text-white uppercase disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition flex items-center justify-center shadow-[0_6px_16px_rgba(37,99,235,0.45)] border-t border-b-2 border-x border-t-sky-300/60 border-b-blue-900 border-x-blue-600 relative overflow-hidden"
            style={{
              background:
                'linear-gradient(180deg, #3b82f6 0%, #2563eb 45%, #1d4ed8 75%, #1e40af 100%)',
            }}
          >
            {/* Top glass highlight reflection */}
            <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
            <span className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">x2</span>
          </button>
        </div>

        {/* RIGHT SIDE ON DESKTOP: PRIMARY BIG BUILD BUTTON */}
        <div className="w-full md:flex-1">
          {!isPlaying ? (
            /* START GAME / BET BUTTON */
            <button
              onClick={() => {
                soundFx.playClick();
                onStartGame();
              }}
              disabled={demoBalance < betAmount || betAmount < 10}
              className="w-full relative h-12 sm:h-14 rounded-2xl active:scale-[0.98] transition-all shadow-[0_8px_25px_rgba(245,158,11,0.55)] border-2 border-black/90 overflow-hidden flex flex-col justify-between group disabled:opacity-50"
              style={{
                background:
                  'repeating-linear-gradient(45deg, #18181b 0px, #18181b 12px, #f59e0b 12px, #f59e0b 24px)',
              }}
            >
              {/* Top diagonal stripe bar */}
              <div className="w-full h-1.5 sm:h-2 opacity-95 bg-yellow-400/30" />

              {/* Inner Golden 24K Luxury Bullion Slab with 3D Bevel & Rivets */}
              <div
                className="flex-1 mx-1.5 mb-1.5 rounded-xl border border-yellow-100/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(113,63,18,0.5)] flex items-center justify-between px-3 relative overflow-hidden"
                style={{
                  background:
                    'linear-gradient(180deg, #fffbeb 0%, #fef08a 18%, #facc15 45%, #ca8a04 80%, #a16207 100%)',
                }}
              >
                {/* Top glass reflection sheen */}
                <div className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/45 to-transparent pointer-events-none" />

                {/* Left metallic screw rivet */}
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-200 to-amber-700 border border-amber-900/60 shadow flex-shrink-0 flex items-center justify-center">
                  <div className="w-1.5 h-[1px] bg-amber-950/70 transform rotate-45" />
                </div>

                {/* Center Title */}
                <div className="flex-1 flex items-center justify-center min-w-0 px-1">
                  <span className="text-lg sm:text-2xl font-black tracking-widest text-white uppercase drop-shadow-[0_2px_4px_rgba(69,26,3,0.8)] font-mono whitespace-nowrap">
                    BUILD
                  </span>
                </div>

                {/* Right metallic screw rivet */}
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-200 to-amber-700 border border-amber-900/60 shadow flex-shrink-0 flex items-center justify-center">
                  <div className="w-1.5 h-[1px] bg-amber-950/70 transform -rotate-45" />
                </div>
              </div>
            </button>
          ) : (
            /* ACTIVE PLAYING: CASHOUT (LEFT) & BUILD DROP (RIGHT) */
            <div className="flex items-center gap-2.5 w-full">
              {/* 1. CASHOUT BUTTON ON THE LEFT */}
              {canCashOut ? (
                <button
                  onClick={onCashOut}
                  className="w-[42%] sm:w-[38%] md:w-[36%] h-12 sm:h-14 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border-2 border-emerald-300 shadow-[0_8px_25px_rgba(16,185,129,0.7),inset_0_2px_4px_rgba(255,255,255,0.7)] active:scale-95 transition-all group animate-pulse-glow"
                  style={{
                    background:
                      'linear-gradient(180deg, #10b981 0%, #059669 45%, #047857 85%, #064e3b 100%)',
                  }}
                >
                  {/* Top glass specular reflection */}
                  <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

                  <div className="relative flex items-center gap-1.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    <Banknote className="w-4 h-4 text-emerald-200 stroke-[2.5]" />
                    <span className="font-black text-xs sm:text-sm uppercase tracking-wider font-mono">
                      CASH OUT
                    </span>
                  </div>

                  <span className="relative text-white font-mono text-sm sm:text-base font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] text-emerald-100">
                    ₹{potentialPayout.toLocaleString('en-IN')}
                  </span>
                </button>
              ) : (
                <div
                  className="w-[42%] sm:w-[38%] md:w-[36%] h-12 sm:h-14 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-700/80 bg-slate-900/80 opacity-50 select-none pointer-events-none shadow-inner"
                >
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Banknote className="w-4 h-4 text-slate-500" />
                    <span className="font-extrabold text-xs uppercase tracking-wider font-mono">
                      CASH OUT
                    </span>
                  </div>
                  <span className="text-slate-500 font-mono text-xs font-bold tracking-tight">
                    LOCKED
                  </span>
                </div>
              )}

              {/* 2. BUILD DROP BUTTON ON THE RIGHT */}
              <button
                onClick={onBuild}
                className="flex-1 relative h-12 sm:h-14 rounded-2xl active:scale-[0.98] transition-all shadow-[0_8px_25px_rgba(245,158,11,0.65)] border-2 border-black/90 overflow-hidden flex flex-col justify-between group"
                style={{
                  background:
                    'repeating-linear-gradient(45deg, #18181b 0px, #18181b 12px, #f59e0b 12px, #f59e0b 24px)',
                }}
              >
                {/* Top diagonal stripe accent line */}
                <div className="w-full h-1.5 sm:h-2 opacity-95 bg-yellow-400/30" />

                {/* Inner Golden 24K Luxury Bullion Slab with 3D Bevel & Rivets */}
                <div
                  className="flex-1 mx-1.5 mb-1.5 rounded-xl border border-yellow-100/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(113,63,18,0.5)] flex items-center justify-between px-2 sm:px-3 relative overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(180deg, #fffbeb 0%, #fef08a 18%, #facc15 45%, #ca8a04 80%, #a16207 100%)',
                  }}
                >
                  {/* Top glass reflection sheen */}
                  <div className="absolute top-0 inset-x-0 h-[40%] bg-gradient-to-b from-white/45 to-transparent pointer-events-none" />

                  {/* Left metallic screw rivet */}
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-br from-yellow-200 to-amber-700 border border-amber-900/60 shadow flex-shrink-0 flex items-center justify-center">
                    <div className="w-1.5 h-[1px] bg-amber-950/70 transform rotate-45" />
                  </div>

                  {/* Center Action Label */}
                  <div className="flex-1 flex items-center justify-center min-w-0 px-1 gap-1.5">
                    <span className="text-xs min-[360px]:text-sm sm:text-base md:text-xl font-black tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(69,26,3,0.8)] font-mono whitespace-nowrap animate-pulse">
                      {isPlaying && dropTimeLeft !== undefined && dropTimeLeft <= 3.0 ? 'DROP NOW!' : 'DROP / BUILD'}
                    </span>
                    {isPlaying && dropTimeLeft !== undefined && (
                      <span className={`text-[11px] sm:text-xs font-black font-mono px-1.5 py-0.5 rounded shadow-sm ${
                        dropTimeLeft <= 3.0
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-black/35 text-amber-950 font-black'
                      }`}>
                        {dropTimeLeft.toFixed(1)}s
                      </span>
                    )}
                  </div>

                  {/* Right metallic screw rivet */}
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-br from-yellow-200 to-amber-700 border border-amber-900/60 shadow flex-shrink-0 flex items-center justify-center">
                    <div className="w-1.5 h-[1px] bg-amber-950/70 transform -rotate-45" />
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
