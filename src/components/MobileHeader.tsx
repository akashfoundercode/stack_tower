import React from 'react';
import { Menu, Wifi, MoreHorizontal, HelpCircle, Shield, Zap, Flame, BarChart3, UserCheck, LogIn } from 'lucide-react';
import { GameDifficulty, GameState } from '../types/game';
import { soundFx } from '../utils/sound';

interface MobileHeaderProps {
  demoBalance: number;
  onResetBalance?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  onOpenTutorial?: () => void;
  onOpenStats?: () => void;
  onOpenLogin?: () => void;
  isLoggedIn?: boolean;
  userId?: string | number;
  username?: string;
  difficulty?: GameDifficulty;
  onDifficultyChange?: (mode: GameDifficulty) => void;
  gameState?: GameState;
}

const MobileHeaderComponent: React.FC<MobileHeaderProps> = ({
  demoBalance,
  onOpenHistory,
  onOpenTutorial,
  onOpenStats,
  onOpenLogin,
  isLoggedIn = false,
  userId = '489214',
  difficulty = 'MEDIUM',
  onDifficultyChange,
  gameState = 'IDLE',
}) => {
  const isPlaying = gameState === 'PLAYING';

  return (
    <div className="w-full px-2 sm:px-4 pt-2 sm:pt-3 pb-2 flex items-center justify-between pointer-events-auto bg-transparent gap-1">
      {/* Left: Hamburger Menu + Stats + How To Play (?) Button */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenHistory();
          }}
          className="text-white hover:text-white p-2 rounded-xl bg-sky-950/40 hover:bg-sky-950/60 backdrop-blur-md border border-white/20 active:scale-95 transition shadow-sm"
          title="Bet History"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        {onOpenStats && (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenStats();
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-sky-950/40 hover:bg-sky-950/60 backdrop-blur-md border border-white/20 active:scale-95 transition shadow-sm text-xs font-black text-amber-300 hover:text-white"
            title="Tower Build Stats"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline font-mono uppercase tracking-wider text-[11px]">Stats</span>
          </button>
        )}

        {onOpenTutorial && (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenTutorial();
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-sky-950/40 hover:bg-sky-950/60 backdrop-blur-md border border-white/20 active:scale-95 transition shadow-sm text-xs font-black text-amber-300 hover:text-white"
            title="How to Play Tutorial"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
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
                soundFx.speak('Easy Mode');
                onDifficultyChange?.('EASY');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider transition-all duration-150 flex items-center gap-1 ${
                difficulty === 'EASY'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_2px_8px_rgba(16,185,129,0.7)] border border-emerald-300 scale-[1.04]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className={`w-3 h-3 ${difficulty === 'EASY' ? 'text-white fill-white/20' : 'text-emerald-400'}`} />
              <span>EASY</span>
            </button>

            {/* MEDIUM */}
            <button
              onClick={() => {
                soundFx.playClick();
                soundFx.speak('Medium Mode');
                onDifficultyChange?.('MEDIUM');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider transition-all duration-150 flex items-center gap-1 ${
                difficulty === 'MEDIUM'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-[0_2px_8px_rgba(245,158,11,0.7)] border border-amber-300 scale-[1.04]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Zap className={`w-3 h-3 ${difficulty === 'MEDIUM' ? 'text-white fill-white' : 'text-amber-400'}`} />
              <span>MED</span>
            </button>

            {/* HARD */}
            <button
              onClick={() => {
                soundFx.playClick();
                soundFx.speak('Hard Mode');
                onDifficultyChange?.('HARD');
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider transition-all duration-150 flex items-center gap-1 ${
                difficulty === 'HARD'
                  ? 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-[0_2px_8px_rgba(239,68,68,0.7)] border border-rose-300 scale-[1.04]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flame className={`w-3 h-3 ${difficulty === 'HARD' ? 'text-white fill-white' : 'text-rose-400'}`} />
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
            {difficulty === 'EASY' ? (
              <Shield className="w-3 h-3 text-emerald-300 fill-emerald-300/30" />
            ) : difficulty === 'HARD' ? (
              <Flame className="w-3 h-3 text-rose-300 fill-rose-300" />
            ) : (
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
            )}
            <span className="tracking-wider">{difficulty} MODE</span>
          </div>
        )}
      </div>

      {/* Right: Network signal + ID and Currency Balance */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Auth / Login Status Pill */}
        {onOpenLogin && (
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenLogin();
            }}
            className={`px-2 py-1 sm:py-1.5 rounded-xl border flex items-center gap-1 active:scale-95 transition shadow-sm font-mono text-[10px] sm:text-xs font-black uppercase ${
              isLoggedIn
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-yellow-300 animate-pulse'
            }`}
            title={isLoggedIn ? 'Account Verified (Click to view)' : 'Click to Login'}
          >
            {isLoggedIn ? (
              <>
                <UserCheck className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Auth</span>
              </>
            ) : (
              <>
                <LogIn className="w-3 h-3 text-slate-950" />
                <span>Login</span>
              </>
            )}
          </button>
        )}

        {/* Right Info: ID & Balance (green signal bar + ID + INR) - Non-clickable balance display */}
        <div className="flex flex-col items-end leading-none bg-sky-950/40 backdrop-blur-md border border-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-sm select-none">
          <div className="flex items-center gap-1 mb-0.5">
            <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 rotate-90" />
            <span className="text-[9px] sm:text-[10px] text-white/80 font-mono tracking-tight font-semibold">
              ID : {userId}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs sm:text-base font-black text-white font-mono tracking-tight">
              {Math.floor(demoBalance).toLocaleString('en-IN')}
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-300">INR</span>
          </div>
        </div>

        {/* Right Circular Blue Dots Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            if (onOpenTutorial) {
              onOpenTutorial();
            }
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-b from-sky-400 to-sky-600 border border-sky-300/60 shadow flex items-center justify-center text-white active:scale-95 transition hover:brightness-110"
          title="Game Info & Rules"
        >
          <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export const MobileHeader = React.memo(MobileHeaderComponent);

