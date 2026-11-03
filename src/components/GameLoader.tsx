import React, { useEffect, useState } from 'react';
import balloon1Img from '../assets/games/baloon1.png';
import balloon2Img from '../assets/games/balloon2.png';
import frameBg from '../assets/FRAMES/FRAMES (1).png';
import solidBlueSkyBg from '../assets/FRAMES/Solid bright sky blue background.png';
import bottomShopImg from '../assets/FRAMES/BOTTOMSHOP.png';
import obs1 from '../assets/obstacle/obs1.png';
import obs2 from '../assets/obstacle/obs2.png';
import obs3 from '../assets/obstacle/obs3.png';
import obs4 from '../assets/obstacle/obs4.png';

export const GAME_ASSETS = [
  { src: solidBlueSkyBg, name: 'Sky Scene' },
  { src: frameBg, name: 'City Background' },
  { src: bottomShopImg, name: 'Base Store' },
  { src: obs1, name: 'Obstacle 1' },
  { src: obs2, name: 'Obstacle 2' },
  { src: obs3, name: 'Obstacle 3' },
  { src: obs4, name: 'Obstacle 4' },
  { src: balloon1Img, name: 'Air Balloon 1' },
  { src: balloon2Img, name: 'Air Balloon 2' },
];

interface GameLoaderProps {
  onLoaded: () => void;
}

export const GameLoader: React.FC<GameLoaderProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Loading game assets...');
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    let loadedCount = 0;
    const total = GAME_ASSETS.length;
    let isCancelled = false;

    const updateStatus = (pct: number) => {
      if (pct < 30) setStatusText('Loading high-res city graphics...');
      else if (pct < 65) setStatusText('Building tower assets & textures...');
      else if (pct < 95) setStatusText('Calibrating physics & crane...');
      else setStatusText('Ready to Play!');
    };

    const handleAssetDone = () => {
      if (isCancelled) return;
      loadedCount++;
      const targetPct = Math.round((loadedCount / total) * 100);
      setProgress(targetPct);
      updateStatus(targetPct);

      if (loadedCount >= total) {
        // Hold for 350ms so user smoothly sees 100% completion before gentle fade-out
        setTimeout(() => {
          if (isCancelled) return;
          setIsFadingOut(true);
          setTimeout(() => {
            if (isCancelled) return;
            onLoaded();
          }, 450); // Matches transition-opacity duration
        }, 350);
      }
    };

    // Preload each game asset with automatic multi-attempt retry on mobile network failure
    GAME_ASSETS.forEach((asset) => {
      let attempts = 0;
      const maxAttempts = 3;

      const tryLoad = () => {
        if (isCancelled) return;
        const img = new Image();
        // First attempt uses direct asset URL; retries use cache-busting timestamp
        const srcUrl = attempts === 0 ? asset.src : `${asset.src}?retry=${attempts}_${Date.now()}`;
        img.src = srcUrl;

        const onSuccess = () => {
          if (isCancelled) return;
          if ('decode' in img) {
            img.decode().then(handleAssetDone).catch(() => handleAssetDone());
          } else {
            handleAssetDone();
          }
        };

        const onFailure = () => {
          if (isCancelled) return;
          attempts++;
          if (attempts < maxAttempts) {
            // Exponential backoff retry for mobile network resilience
            setTimeout(tryLoad, attempts * 350);
          } else {
            // Loader failsafe so game doesn't stall indefinitely if asset unreachable
            handleAssetDone();
          }
        };

        if (img.complete && img.naturalWidth > 0) {
          onSuccess();
        } else {
          img.onload = () => {
            if (img.naturalWidth > 0) {
              onSuccess();
            } else {
              onFailure();
            }
          };
          img.onerror = onFailure;
        }
      };

      tryLoad();
    });

    return () => {
      isCancelled = true;
    };
  }, [onLoaded]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none bg-gradient-to-b from-[#0a1e3f] via-[#097cd9] to-[#041a33] text-white transition-opacity duration-450 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-black/60 pointer-events-none" />

      {/* Center Loader Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Animated Swinging Crane & Mini Building Hook */}
        <div className="relative mb-6 flex flex-col items-center">
          {/* Top Girder Track */}
          <div className="w-48 h-1.5 bg-slate-700 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.5)] border border-slate-600 mb-0.5" />

          {/* Swinging Pendulum */}
          <div className="origin-top animate-[pendulum_2.2s_ease-in-out_infinite] flex flex-col items-center">
            {/* Cable */}
            <div className="w-0.5 h-10 bg-slate-300 shadow-sm" />

            {/* Pulley block & Hook */}
            <div className="w-5 h-5 rounded-md bg-yellow-400 border border-yellow-600 shadow flex items-center justify-center -mt-0.5">
              <div className="w-2 h-2 rounded-full bg-slate-900" />
            </div>
            <div className="w-3 h-3 border-2 border-stone-800 rounded-b-full border-t-0 -mt-0.5" />

            {/* Preview Building House hanging from hook */}
            <div className="mt-1 w-14 h-12 bg-gradient-to-b from-amber-500 to-amber-700 rounded border-2 border-amber-300 shadow-xl flex flex-col items-center justify-between p-1">
              <div className="w-8 h-1 bg-amber-200 rounded-full" />
              <div className="w-6 h-5 bg-sky-200/90 rounded border border-amber-900/40 flex items-center justify-center">
                <span className="text-[9px]">🏢</span>
              </div>
              <div className="w-full h-1 bg-amber-900/60 rounded-xs" />
            </div>
          </div>
        </div>

        {/* 3D Game Title */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-wider uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 mb-1">
          STACK TOWER
        </h1>

        <p className="text-xs sm:text-sm font-semibold text-sky-200/90 tracking-wide mb-6">
          CRASH ARCADE
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900/80 rounded-full p-1 border-2 border-sky-400/40 shadow-[0_0_20px_rgba(14,165,233,0.3)] backdrop-blur-md mb-3">
          <div
            className="h-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-yellow-400 shadow-[0_0_12px_#facc15] transition-all duration-200 ease-out relative overflow-hidden"
            style={{ width: `${Math.max(6, progress)}%` }}
          >
            {/* Shimmer light reflection effect traveling along the progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.4s_infinite]" />
          </div>
        </div>

        {/* Percentage & Status Text */}
        <div className="w-full flex items-center justify-between px-1 text-xs text-sky-200 font-mono font-bold">
          <span className="text-left truncate max-w-[220px] font-sans text-white/90">
            {statusText}
          </span>
          <span className="text-yellow-300 font-black tracking-wider text-sm drop-shadow">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};

