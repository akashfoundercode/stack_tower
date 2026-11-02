import React from 'react';
import { GameState } from '../types/game';
import { Minus, Plus, Zap, ArrowDownCircle, Banknote } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface BettingPanelProps {
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

export const BettingPanel: React.FC<BettingPanelProps> = ({
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
  const quickBets = [10, 25, 50, 100, 250, 500];

  const handleAdjust = (delta: number) => {
    soundFx.playClick();
    const next = Math.max(10, Math.min(demoBalance, betAmount + delta));
    onBetChange(next);
  };

  const handleQuickBet = (amt: number) => {
    soundFx.playClick();
    onBetChange(Math.min(demoBalance, amt));
  };

  const potentialPayout = Math.floor(betAmount * multiplier * 100) / 100;
  const isPlaying = gameState === 'PLAYING';
  const canCashOut = isPlaying && level >= 1;

  return (
    <div className="w-full bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-3 md:p-4 shadow-2xl flex flex-col gap-3">
      {/* Live Round Statistics / Multiplier Bar */}
      <div className="flex items-center justify-between bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Current Multiplier
          </span>
          <span className="text-xl md:text-2xl font-black text-amber-400 font-mono tracking-tight drop-shadow">
            {multiplier.toFixed(2)}x
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Current Floor
          </span>
          <span className="text-lg md:text-xl font-extrabold text-sky-400">
            {isPlaying ? `L.${level}` : 'READY'}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Potential Payout
          </span>
          <span className="text-xl md:text-2xl font-black text-emerald-400 font-mono tracking-tight">
            ₹{isPlaying ? potentialPayout.toLocaleString('en-IN') : '0.00'}
          </span>
        </div>
      </div>

      {/* Bet Adjuster Row (Visible when IDLE or can be locked during round) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Minus Button */}
          <button
            disabled={isPlaying || betAmount <= 10}
            onClick={() => handleAdjust(-10)}
            className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none active:scale-95 border border-slate-700 flex items-center justify-center text-slate-200 transition font-bold"
          >
            <Minus className="w-5 h-5" />
          </button>

          {/* Editable Bet Input */}
          <div className="flex-1 relative flex items-center justify-center bg-slate-950 rounded-xl border border-slate-700 py-1.5 px-3">
            <span className="text-amber-400 font-bold mr-1">₹</span>
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
              className="w-full bg-transparent text-center text-xl md:text-2xl font-black text-white outline-none font-mono"
            />
          </div>

          {/* Plus Button */}
          <button
            disabled={isPlaying || betAmount >= demoBalance}
            onClick={() => handleAdjust(10)}
            className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none active:scale-95 border border-slate-700 flex items-center justify-center text-slate-200 transition font-bold"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* 2X Double Bet Button (Inspired by screenshot [x2] pill) */}
          <button
            disabled={isPlaying || betAmount * 2 > demoBalance}
            onClick={() => {
              soundFx.playClick();
              onBetChange(Math.min(demoBalance, betAmount * 2));
            }}
            className="h-12 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none active:scale-95 border border-blue-400/50 flex items-center justify-center text-white font-extrabold text-sm transition shadow-md"
          >
            2X
          </button>
        </div>

        {/* Quick Bet Preset Chips */}
        <div className="grid grid-cols-6 gap-1.5">
          {quickBets.map((amt) => (
            <button
              key={amt}
              disabled={isPlaying || amt > demoBalance}
              onClick={() => handleQuickBet(amt)}
              className={`py-1.5 rounded-lg text-xs font-bold transition border active:scale-95 ${
                betAmount === amt
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              } disabled:opacity-30`}
            >
              ₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action Buttons (Inspired by Screenshot's iconic hazard stripes & big BUILD button) */}
      <div className="flex flex-col gap-2 pt-1">
        {!isPlaying ? (
          <button
            onClick={() => {
              soundFx.playClick();
              onStartGame();
            }}
            disabled={demoBalance < betAmount || betAmount < 10}
            className="w-full py-4 rounded-xl font-black text-xl tracking-wider uppercase text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:brightness-110 active:scale-[0.98] border-2 border-yellow-200 shadow-[0_6px_20px_rgba(245,158,11,0.5)] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-6 h-6 fill-slate-950" />
            START GAME (₹{betAmount})
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            {/* CASH OUT Button on LEFT */}
            {canCashOut && (
              <button
                onClick={() => {
                  onCashOut();
                }}
                className="w-full sm:w-1/2 py-4 px-4 rounded-xl font-black text-lg md:text-xl uppercase tracking-wide text-white bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:brightness-110 active:scale-95 border-2 border-emerald-300 shadow-[0_6px_20px_rgba(16,185,129,0.5)] transition flex items-center justify-center gap-2 animate-pulse-glow"
              >
                <Banknote className="w-6 h-6" />
                <span>
                  CASH OUT ₹{potentialPayout.toLocaleString('en-IN')}
                </span>
              </button>
            )}

            {/* The Famous Hazard-Striped BUILD Button on RIGHT! */}
            <button
              onClick={() => {
                onBuild();
              }}
              className="flex-1 relative py-4 px-4 rounded-xl font-black text-2xl uppercase tracking-wider text-slate-950 active:scale-95 transition shadow-[0_8px_24px_rgba(245,158,11,0.6)] border-2 border-yellow-200 overflow-hidden group"
              style={{
                background:
                  'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 20px, #d97706 20px, #d97706 40px)',
              }}
            >
              {/* Center glow plate */}
              <div className="absolute inset-1.5 bg-yellow-400 rounded-lg flex items-center justify-center gap-2 shadow-inner border border-yellow-200 group-hover:bg-yellow-300 transition-colors">
                <ArrowDownCircle className="w-7 h-7 text-slate-950 animate-bounce" />
                <span className="drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                  BUILD
                </span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

