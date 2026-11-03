import React from 'react';
import { Menu, Wifi, MoreHorizontal } from 'lucide-react';
import { GameDifficulty, GameState } from '../types/game';
import { soundFx } from '../utils/sound';

interface MobileHeaderProps {
  demoBalance: number;
  onResetBalance: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  onOpenTutorial?: () => void;
  difficulty?: GameDifficulty;
  onDifficultyChange?: (mode: GameDifficulty) => void;
  gameState?: GameState;
}

const MobileHeaderComponent: React.FC<MobileHeaderProps> = ({
  demoBalance,
  onResetBalance,
  onOpenHistory,
  onOpenTutorial,
  difficulty = 'MEDIUM',
  onDifficultyChange,
  gameState = 'IDLE',
}) => {
  const isPlaying = gameState === 'PLAYING';

  return (
    <div className="w-full px-2 sm:px-4 pt-2 sm:pt-3 pb-2 flex items-center justify-between pointer-events-auto bg-transparent gap-1">
      {/* Left: Hamburger Menu + How To Play (?) Button */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenHistory();
          }}
          className="text-white hover:text-white p-2 rounded-xl bg-sky-950/40 hover:bg-sky-950/60 backdrop-blur-md border border-white/20 active:scale-95 transition shadow-sm"
          title="Menu & History"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        {onOpenTutorial && (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenTutorial();
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-sky-950/40 hover:bg-sky-950/60 backdrop-blur-md border border-white/20 active:scale-95 transition shadow-sm text-xs font-black text-amber-300 hover:text-white"
            title="How to Play Tutorial"
          >
            <span className="text-xs sm:text-sm">❓</span>
            <span className="hidden md:inline font-mono uppercase tracking-wider text-[11px]">Help</span>
          </button>
        )}
      </div>

      {/* Center: Sleek 3-Difficulty Level Segmented Switcher (EASY | MED | HARD) */}
      <div className="flex items-center justify-center flex-shrink min-w-0">
        {!isPlaying ? (
          <div className="flex items-center p-0.5 sm:p-1 bg-black/60 backdrop-blur-xl rounded-full border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.15)] gap-0.5 sm:gap-1">
            {/* EASY */}
            <button
              onClick={() => {
                soundFx.playClick();
                onDifficultyChange?.('EASY');
              }}
              className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider transition-all duration-150 flex items-center gap-0.5 sm:gap-1 ${
                difficulty === 'EASY'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_2px_8px_rgba(16,185,129,0.7)] border border-emerald-300 scale-[1.04]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-[10px]">🛡️</span>
              <span>EASY</span>
            </button>

            {/* MEDIUM */}
            <button
              onClick={() => {
                soundFx.playClick();
                onDifficultyChange?.('MEDIUM');
              }}
              className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider transition-all duration-150 flex items-center gap-0.5 sm:gap-1 ${
                difficulty === 'MEDIUM'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-[0_2px_8px_rgba(245,158,11,0.7)] border border-amber-300 scale-[1.04]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-[10px]">⚡</span>
              <span>MED</span>
            </button>

            {/* HARD */}
            <button
              onClick={() => {
                soundFx.playClick();
                onDifficultyChange?.('HARD');
              }}
              className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider transition-all duration-150 flex items-center gap-0.5 sm:gap-1 ${
                difficulty === 'HARD'
                  ? 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-[0_2px_8px_rgba(239,68,68,0.7)] border border-rose-300 scale-[1.04]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-[10px]">🔥</span>
              <span>HARD</span>
            </button>
          </div>
        ) : (
          <div
            className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-black border flex items-center gap-1.5 shadow-md backdrop-blur-md ${
              difficulty === 'EASY'
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                : difficulty === 'HARD'
                ? 'bg-rose-950/80 border-rose-400 text-rose-200 animate-pulse'
                : 'bg-amber-950/80 border-amber-400 text-amber-200'
            }`}
          >
            <span>{difficulty === 'EASY' ? '🛡️' : difficulty === 'HARD' ? '🔥' : '⚡'}</span>
            <span className="tracking-wider">{difficulty} MODE</span>
          </div>
        )}
      </div>

      {/* Right: Network signal + ID and Currency Balance */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Right Info: ID & Balance (green signal bar + ID + INR) */}
        <div className="flex flex-col items-end leading-none bg-sky-950/40 backdrop-blur-md border border-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-sm">
          <div className="flex items-center gap-1 mb-0.5">
            <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 rotate-90" />
            <span className="text-[9px] sm:text-[10px] text-white/80 font-mono tracking-tight font-semibold">
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
            <span className="text-xs sm:text-base font-black text-white font-mono tracking-tight">
              {Math.floor(demoBalance).toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-300">INR</span>
          </button>
        </div>

        {/* Right Circular Blue Dots Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onResetBalance();
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-sky-400 to-sky-600 border border-sky-300/60 shadow flex items-center justify-center text-white active:scale-95 transition hover:brightness-110"
          title="Game Options"
        >
          <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export const MobileHeader = React.memo(MobileHeaderComponent);

