import React from 'react';
import { GameState } from '../types/game';
import { Minus, Plus, Zap, Banknote } from 'lucide-react';
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
}) => {
  const quickBets = [50, 100, 200, 500, 1000];
  const isPlaying = gameState === 'PLAYING';
  const potentialPayout = Math.floor(betAmount * multiplier * 100) / 100;
  const canCashOut = isPlaying && level >= 1;

  const handleAdjust = (delta: number) => {
    soundFx.playClick();
    const next = Math.max(10, Math.min(demoBalance, betAmount + delta));
    onBetChange(next);
  };

  const handleQuickBet = (amt: number) => {
    soundFx.playClick();
    onBetChange(Math.min(demoBalance, amt));
  };

  return (
    <div className="w-full flex flex-col gap-2 pointer-events-auto select-none">
      {/* Live In-Game Floating Stats Ribbon (only during play or cashout) */}
      {isPlaying && (
        <div className="flex items-center justify-between bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-xl shadow-lg mx-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-extrabold text-white uppercase tracking-wider">
              Floor {level}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-medium">Multiplier:</span>
            <span className="text-base font-black text-amber-400 font-mono">
              {multiplier.toFixed(2)}x
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-300 font-medium">Payout:</span>
            <span className="text-sm font-black text-emerald-400 font-mono">
              ₹{potentialPayout.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}

      {/* Hazard Warning Strip Border Top (Exact element above controls in screenshot) */}
      <div
        className="w-full h-3 rounded-full shadow-md border border-black/30 overflow-hidden"
        style={{
          background:
            'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 12px, #1e293b 12px, #1e293b 24px)',
        }}
      />

      {/* Main Glass Control Dock */}
      <div className="bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col gap-2">
        {/* Row 1: Left Quick Button, Center Minus/Input/Plus, Right x2 Multiplier */}
        <div className="flex items-center gap-2">
          {/* Left Mini Quick-Bet / Min Button */}
          <button
            disabled={isPlaying}
            onClick={() => handleQuickBet(50)}
            className="h-11 px-3 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 disabled:opacity-40 disabled:pointer-events-none text-white font-black text-xs shadow-md border border-blue-400/30 active:scale-95 transition flex items-center justify-center min-w-[48px]"
          >
            MIN
          </button>

          {/* Center Capsule: Minus, Editable Amount, Plus (Identical to reference capsule) */}
          <div className="flex-1 h-11 bg-slate-800/90 rounded-xl border border-slate-700/80 flex items-center justify-between px-1.5 shadow-inner">
            {/* Minus */}
            <button
              disabled={isPlaying || betAmount <= 10}
              onClick={() => handleAdjust(-10)}
              className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none text-white font-black flex items-center justify-center active:scale-95 transition shadow"
            >
              <Minus className="w-4 h-4 stroke-[3]" />
            </button>

            {/* Bet Input */}
            <div className="flex items-center justify-center px-1">
              <span className="text-amber-400 font-black text-xs mr-0.5">₹</span>
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
                className="w-16 sm:w-20 bg-transparent text-center text-lg sm:text-xl font-black text-white outline-none font-mono tracking-tight"
              />
            </div>

            {/* Plus */}
            <button
              disabled={isPlaying || betAmount >= demoBalance}
              onClick={() => handleAdjust(10)}
              className="w-8 h-8 rounded-lg bg-slate-700/80 hover:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none text-white font-black flex items-center justify-center active:scale-95 transition shadow"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Right x2 Multiplier Pill (Exact button from the screenshot [x2]) */}
          <button
            disabled={isPlaying || betAmount * 2 > demoBalance}
            onClick={() => {
              soundFx.playClick();
              onBetChange(Math.min(demoBalance, betAmount * 2));
            }}
            className="h-11 px-3.5 rounded-xl bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 disabled:opacity-40 disabled:pointer-events-none text-white font-black text-xs shadow-md border border-blue-400/30 active:scale-95 transition flex items-center justify-center min-w-[48px]"
          >
            x2
          </button>
        </div>

        {/* Quick Bet Pills (when not actively placing) */}
        {!isPlaying && (
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
            {quickBets.map((amt) => (
              <button
                key={amt}
                onClick={() => handleQuickBet(amt)}
                className={`flex-1 py-1 rounded-lg text-[11px] font-black tracking-tight transition active:scale-95 border ${
                  betAmount === amt
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        )}

        {/* Primary Action Button (The BIG Iconic BUILD or START Button) */}
        <div className="pt-0.5">
          {!isPlaying ? (
            <button
              onClick={() => {
                soundFx.playClick();
                onStartGame();
              }}
              disabled={demoBalance < betAmount || betAmount < 10}
              className="w-full py-3.5 sm:py-4 rounded-xl font-black text-lg sm:text-xl uppercase tracking-wider text-slate-950 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 active:scale-[0.98] border-2 border-yellow-200 shadow-[0_6px_20px_rgba(245,158,11,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-5 h-5 fill-slate-950" />
              START GAME (₹{betAmount})
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {/* Massive Hazard-Striped BUILD Button */}
              <button
                onClick={onBuild}
                className="flex-1 relative h-14 sm:h-16 rounded-xl font-black text-xl sm:text-2xl uppercase tracking-wider text-slate-950 active:scale-95 transition shadow-[0_8px_24px_rgba(245,158,11,0.6)] border-2 border-yellow-300 overflow-hidden group"
                style={{
                  background:
                    'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 16px, #1e293b 16px, #1e293b 32px)',
                }}
              >
                {/* Yellow center core */}
                <div className="absolute inset-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 rounded-lg flex items-center justify-center gap-2 shadow-inner border border-yellow-200 group-hover:brightness-105 transition">
                  <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] font-black text-slate-950 tracking-widest">
                    BUILD
                  </span>
                </div>
              </button>

              {/* Cash Out Button (appears immediately once eligible) */}
              {canCashOut && (
                <button
                  onClick={onCashOut}
                  className="w-2/5 sm:w-1/2 h-14 sm:h-16 px-2 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wide text-white bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:brightness-110 active:scale-95 border-2 border-emerald-300 shadow-[0_6px_20px_rgba(16,185,129,0.5)] transition flex flex-col items-center justify-center animate-pulse-glow"
                >
                  <div className="flex items-center gap-1">
                    <Banknote className="w-4 h-4" />
                    <span>CASH OUT</span>
                  </div>
                  <span className="text-emerald-100 font-mono text-sm sm:text-base font-black">
                    ₹{potentialPayout.toLocaleString('en-IN')}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
