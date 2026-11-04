import React, { useState } from 'react';
import {
  Menu,
  X,
  Wifi,
  MoreHorizontal,
  HelpCircle,
  Shield,
  Zap,
  Flame,
  BarChart3,
  UserCheck,
  LogIn,
  LogOut,
  User,
  History,
  Volume2,
  VolumeX,
} from 'lucide-react';
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
  onOpenProfile?: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
  userId?: string | number;
  username?: string;
  userimage?: string;
  difficulty?: GameDifficulty;
  onDifficultyChange?: (mode: GameDifficulty) => void;
  gameState?: GameState;
}

const MobileHeaderComponent: React.FC<MobileHeaderProps> = ({
  demoBalance,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
  onOpenTutorial,
  onOpenStats,
  onOpenLogin,
  onOpenProfile,
  onLogout,
  isLoggedIn = false,
  userId = 'ADMIN_123',
  username = 'Admin',
  userimage,
  difficulty = 'MEDIUM',
  onDifficultyChange,
  gameState = 'IDLE',
}) => {
  const isPlaying = gameState === 'PLAYING';
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <>
      {/* ========================================================
          1. TOP NAVBAR
          ======================================================== */}
      <div className="w-full px-2 sm:px-4 pt-2 sm:pt-3 pb-2 flex items-center justify-between pointer-events-auto bg-transparent gap-1">
        {/* Left: 3-Line Hamburger Menu Button + Desktop Stats & Help buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsMenuOpen((prev) => !prev);
            }}
            className="text-white hover:text-white p-2 rounded-xl bg-sky-950/40 hover:bg-sky-950/60 backdrop-blur-md border border-white/20 active:scale-95 transition shadow-sm"
            title="Menu (Profile, History, Stats, Settings)"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>

          {/* Desktop-only Quick Stats Shortcut */}
          {onOpenStats && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenStats();
              }}
              className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-xl bg-sky-950/40 hover:bg-sky-950/60 backdrop-blur-md border border-white/20 active:scale-95 transition shadow-sm text-xs font-black text-amber-300 hover:text-white"
              title="Tower Build Stats"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Stats</span>
            </button>
          )}

          {/* Desktop-only Help Shortcut */}
          {onOpenTutorial && (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenTutorial();
              }}
              className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-xl bg-sky-950/40 hover:bg-sky-950/60 backdrop-blur-md border border-white/20 active:scale-95 transition shadow-sm text-xs font-black text-amber-300 hover:text-white"
              title="How to Play Tutorial"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-mono uppercase tracking-wider text-[11px]">Help</span>
            </button>
          )}
        </div>

        {/* Center (Desktop Only): Horizontal Difficulty Segmented Switcher */}
        <div className="hidden md:flex items-center justify-center flex-shrink min-w-0">
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
          {/* Desktop-Only: Top Profile / Login Pill (On mobile, Profile & Logout are inside the 3-line Menu) */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => {
                soundFx.playClick();
                if (isLoggedIn && onOpenProfile) {
                  onOpenProfile();
                } else if (onOpenLogin) {
                  onOpenLogin();
                }
              }}
              className={`px-2 py-1 sm:py-1.5 rounded-xl border flex items-center gap-1 active:scale-95 transition shadow-sm font-mono text-[10px] sm:text-xs font-black uppercase ${
                isLoggedIn
                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-yellow-300 animate-pulse'
              }`}
              title={isLoggedIn ? 'Player Profile (Click to view & update)' : 'Click to Login'}
            >
              {isLoggedIn ? (
                <>
                  {userimage && userimage.startsWith('http') ? (
                    <img
                      src={userimage}
                      alt="Avatar"
                      className="w-3.5 h-3.5 rounded-full object-cover border border-emerald-400"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <UserCheck className="w-3 h-3 text-emerald-400" />
                  )}
                  <span>Profile</span>
                </>
              ) : (
                <>
                  <LogIn className="w-3 h-3 text-slate-950" />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>

          {/* Right Info: ID & Balance (green signal bar + ID + INR) */}
          <div className="flex flex-col items-end leading-none bg-sky-950/40 backdrop-blur-md border border-white/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-sm select-none">
            <div className="flex items-center gap-1 mb-0.5">
              <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 rotate-90" />
              <span className="text-[9px] sm:text-[10px] text-white/80 font-mono tracking-tight font-semibold">
                ID : {userId}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-base font-black text-white font-mono tracking-tight">
                {demoBalance.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
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

      {/* ========================================================
          2. MOBILE VIEW: VERTICAL DIFFICULTY SELECTOR (LEFT SIDE)
          ======================================================== */}
      <div className="fixed left-2 sm:left-3 top-14 sm:top-16 z-30 flex md:hidden flex-col items-center pointer-events-auto">
        {!isPlaying ? (
          <div className="flex flex-col items-center p-1 bg-black/65 backdrop-blur-xl rounded-2xl border border-white/25 shadow-[0_6px_20px_rgba(0,0,0,0.7)] gap-1.5">
            {/* EASY */}
            <button
              onClick={() => {
                soundFx.playClick();
                soundFx.speak('Easy Mode');
                onDifficultyChange?.('EASY');
              }}
              className={`w-11 py-1.5 rounded-xl text-[9px] font-black tracking-wider transition-all duration-150 flex flex-col items-center justify-center gap-0.5 font-mono ${
                difficulty === 'EASY'
                  ? 'bg-gradient-to-b from-emerald-500 to-teal-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.7)] border border-emerald-300 scale-105'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
              title="Easy Mode"
            >
              <Shield
                className={`w-3.5 h-3.5 ${
                  difficulty === 'EASY' ? 'text-white fill-white/20' : 'text-emerald-400'
                }`}
              />
              <span>EASY</span>
            </button>

            {/* MEDIUM */}
            <button
              onClick={() => {
                soundFx.playClick();
                soundFx.speak('Medium Mode');
                onDifficultyChange?.('MEDIUM');
              }}
              className={`w-11 py-1.5 rounded-xl text-[9px] font-black tracking-wider transition-all duration-150 flex flex-col items-center justify-center gap-0.5 font-mono ${
                difficulty === 'MEDIUM'
                  ? 'bg-gradient-to-b from-amber-500 to-yellow-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.7)] border border-amber-300 scale-105'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
              title="Medium Mode"
            >
              <Zap
                className={`w-3.5 h-3.5 ${
                  difficulty === 'MEDIUM' ? 'text-white fill-white' : 'text-amber-400'
                }`}
              />
              <span>MED</span>
            </button>

            {/* HARD */}
            <button
              onClick={() => {
                soundFx.playClick();
                soundFx.speak('Hard Mode');
                onDifficultyChange?.('HARD');
              }}
              className={`w-11 py-1.5 rounded-xl text-[9px] font-black tracking-wider transition-all duration-150 flex flex-col items-center justify-center gap-0.5 font-mono ${
                difficulty === 'HARD'
                  ? 'bg-gradient-to-b from-rose-600 to-red-700 text-white shadow-[0_0_10px_rgba(239,68,68,0.7)] border border-rose-300 scale-105'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
              title="Hard Mode"
            >
              <Flame
                className={`w-3.5 h-3.5 ${
                  difficulty === 'HARD' ? 'text-white fill-white' : 'text-rose-400'
                }`}
              />
              <span>HARD</span>
            </button>
          </div>
        ) : (
          <div
            className={`w-11 py-1.5 rounded-xl text-[9px] font-black border flex flex-col items-center justify-center gap-0.5 shadow-lg backdrop-blur-xl font-mono ${
              difficulty === 'EASY'
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200'
                : difficulty === 'HARD'
                ? 'bg-rose-950/90 border-rose-400 text-rose-200 animate-pulse'
                : 'bg-amber-950/90 border-amber-400 text-amber-200'
            }`}
          >
            {difficulty === 'EASY' ? (
              <Shield className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300/30" />
            ) : difficulty === 'HARD' ? (
              <Flame className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            )}
            <span>{difficulty === 'MEDIUM' ? 'MED' : difficulty}</span>
          </div>
        )}
      </div>

      {/* ========================================================
          3. MOBILE 3-LINE MENU DRAWER OVERLAY
          ======================================================== */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex pointer-events-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Body (slides in from left) */}
          <div className="relative z-10 w-72 max-w-[85vw] h-full bg-slate-900 border-r border-yellow-500/30 shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200 backdrop-blur-xl">
            {/* Drawer Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-xs font-mono shadow-md">
                  ST
                </div>
                <div>
                  <h3 className="font-mono font-black text-sm text-white tracking-wider leading-tight">
                    STACK TOWER
                  </h3>
                  <span className="text-[10px] text-amber-300 font-mono block">Game Menu</span>
                </div>
              </div>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsMenuOpen(false);
                }}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info Card inside 3-Line Menu */}
            <div className="my-3 p-3 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-emerald-500/30 shadow-md">
              {isLoggedIn ? (
                <div
                  onClick={() => {
                    soundFx.playClick();
                    setIsMenuOpen(false);
                    onOpenProfile?.();
                  }}
                  className="cursor-pointer active:scale-98 transition flex items-center gap-2.5"
                  title="Click to view & edit profile"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {userimage && userimage.startsWith('http') ? (
                      <img
                        src={userimage}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-6 h-6 text-emerald-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-white truncate block">
                        {username || 'Admin'}
                      </span>
                      <span className="text-[9px] font-mono text-emerald-300 uppercase font-black bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40">
                        Profile
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      ID: {userId}
                    </span>
                    <span className="text-xs font-mono font-black text-amber-300 block mt-0.5">
                      ₹{demoBalance.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      <span className="text-[9px] text-amber-400">INR</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-1">
                  <span className="text-xs font-mono text-slate-300 block mb-2 font-semibold">
                    Player Not Logged In
                  </span>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      setIsMenuOpen(false);
                      onOpenLogin?.();
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
                  >
                    <LogIn className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Login & Play</span>
                  </button>
                </div>
              )}
            </div>

            {/* Navigation List inside 3-Line Menu */}
            <div className="flex-1 space-y-1.5 overflow-y-auto font-mono text-xs">
              {/* Profile Option */}
              {isLoggedIn && onOpenProfile && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIsMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 border border-slate-800 transition active:scale-98"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Player Profile</span>
                </button>
              )}

              {/* History Option */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsMenuOpen(false);
                  onOpenHistory();
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 border border-slate-800 transition active:scale-98"
              >
                <History className="w-4 h-4 text-sky-400" />
                <span className="font-bold">Bet History</span>
              </button>

              {/* Stats Option */}
              {onOpenStats && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIsMenuOpen(false);
                    onOpenStats();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 border border-slate-800 transition active:scale-98"
                >
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span className="font-bold">Tower Build Stats</span>
                </button>
              )}

              {/* How to Play / Rules */}
              {onOpenTutorial && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIsMenuOpen(false);
                    onOpenTutorial();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center gap-2.5 border border-slate-800 transition active:scale-98"
                >
                  <HelpCircle className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold">How to Play</span>
                </button>
              )}

              {/* Sound FX Toggle */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  onToggleSound();
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between border border-slate-800 transition active:scale-98"
              >
                <div className="flex items-center gap-2.5">
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="font-bold">Sound FX</span>
                </div>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                    soundEnabled
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {soundEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Logout Option in 3-Line Menu */}
              {isLoggedIn && onLogout && (
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full mt-3 px-3 py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 hover:text-rose-100 flex items-center gap-2.5 border border-rose-500/50 transition active:scale-98"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span className="font-black">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const MobileHeader = React.memo(MobileHeaderComponent);
