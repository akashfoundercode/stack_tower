import React from 'react';
import balloon1Img from '../assets/games/baloon1.png';
import balloon2Img from '../assets/games/balloon2.png';
import frameBg from '../assets/FRAMES/FRAMES (1).png';
import solidBlueSkyBg from '../assets/FRAMES/Solid bright sky blue background.png';

interface CityBackgroundProps {
  cameraY?: number;
}

export const CityBackground: React.FC<CityBackgroundProps> = ({ cameraY = 0 }) => {
  // Parallax factor: as tower climbs high, background continuously scrolls down
  const parallaxOffset = cameraY * 0.38;

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{
        backgroundImage: `url("${solidBlueSkyBg}")`,
        backgroundRepeat: 'repeat-y',
        backgroundPosition: 'center bottom',
        backgroundSize: '100% auto',
      }}
    >
      {/* Parallax Moving Stack: Ground Frame 1 at bottom (exits as tower rises), Solid Blue Sky looping upward */}
      <div
        className="absolute inset-x-0 bottom-0 h-full w-full transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `translate3d(0px, ${parallaxOffset}px, 0px)`,
        }}
      >
        {/* Sky Level 4 (Very High Atmosphere) - Infinite Blue Sky Loop */}
        <div className="absolute inset-x-0 bottom-[calc(400%-8px)] h-full w-full pointer-events-none">
          <img
            src={solidBlueSkyBg}
            alt="Sky Level 4"
            className="w-full h-full object-cover object-bottom"
          />
        </div>

        {/* Sky Level 3 (High Sky) - Infinite Blue Sky Loop */}
        <div className="absolute inset-x-0 bottom-[calc(300%-6px)] h-full w-full pointer-events-none">
          <img
            src={solidBlueSkyBg}
            alt="Sky Level 3"
            className="w-full h-full object-cover object-bottom"
          />
        </div>

        {/* Sky Level 2 (Mid Sky) - Infinite Blue Sky Loop */}
        <div className="absolute inset-x-0 bottom-[calc(200%-4px)] h-full w-full pointer-events-none">
          <img
            src={solidBlueSkyBg}
            alt="Sky Level 2"
            className="w-full h-full object-cover object-bottom"
          />
        </div>

        {/* Sky Level 1 (Upper Sky above Ground Frame) - Infinite Blue Sky Loop */}
        <div className="absolute inset-x-0 bottom-[calc(100%-2px)] h-full w-full pointer-events-none z-10">
          <img
            src={solidBlueSkyBg}
            alt="Upper Sky Frame 1"
            className="w-full h-full object-cover object-bottom"
          />
        </div>

        {/* Ground Frame 1 (FRAMES (1).png) with Sun Light Reflections Right on the Center Sun */}
        <div className="relative w-full h-full pointer-events-none">
          <img
            src={frameBg}
            alt="Ground World Background Frame"
            className="w-full h-full object-cover object-bottom relative z-10"
          />

          {/* =========================================================================
              REALISTIC SUN LIGHT REFLECTION & RAYS (COMPLETE 360° CIRCULAR REFLECTION)
              Full circular radial reflection, 360° sunbeams, corona & lens reflection
              ========================================================================= */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[40.5%] z-20 pointer-events-none select-none flex items-center justify-center">
            {/* 1. Complete 360° Atmospheric Circular Sky Glow */}
            <div
              className="absolute w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full pointer-events-none animate-sun-pulse"
              style={{
                background:
                  'radial-gradient(circle, rgba(254, 240, 138, 0.32) 0%, rgba(253, 224, 71, 0.18) 35%, rgba(250, 204, 21, 0.06) 60%, transparent 80%)',
                mixBlendMode: 'screen',
              }}
            />

            {/* 2. Complete 360° Circular Volumetric Sun Rays (Full continuous circular beams) */}
            <div
              className="absolute w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full pointer-events-none animate-sun-rays-spin opacity-60"
              style={{
                background:
                  'repeating-conic-gradient(from 0deg, rgba(255, 255, 255, 0.3) 0deg 8deg, transparent 8deg 22deg, rgba(254, 240, 138, 0.22) 22deg 32deg, transparent 32deg 45deg)',
                maskImage: 'radial-gradient(circle, black 25%, rgba(0,0,0,0.6) 55%, transparent 75%)',
                WebkitMaskImage: 'radial-gradient(circle, black 25%, rgba(0,0,0,0.6) 55%, transparent 75%)',
              }}
            />

            {/* 3. Complete 360° Circular Corona Aura */}
            <div
              className="absolute w-36 sm:w-44 h-36 sm:h-44 rounded-full pointer-events-none animate-sun-pulse"
              style={{
                background:
                  'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(254, 240, 138, 0.45) 40%, rgba(250, 204, 21, 0.15) 70%, transparent 100%)',
                filter: 'blur(6px)',
              }}
            />

            {/* 4. Complete 360° Circular Lens Halo Ring (Optical circular reflection around sun) */}
            <div
              className="absolute w-28 sm:w-36 h-28 sm:h-36 rounded-full border border-yellow-200/40 pointer-events-none blur-[0.5px] animate-sun-pulse"
            />

            {/* 5. Complete Sun Core Disc (Warm golden sphere) */}
            <div
              className="relative w-14 sm:w-16 h-14 sm:h-16 rounded-full pointer-events-none shadow-[0_0_20px_#fde047,0_0_42px_rgba(250,204,21,0.55)]"
              style={{
                background:
                  'radial-gradient(circle, #ffffff 0%, #fffef0 35%, #fef08a 65%, #facc15 100%)',
              }}
            />

            {/* 6. Soft Anamorphic Specular Horizon Beam */}
            <div
              className="absolute w-[240px] sm:w-[320px] h-[1.5px] pointer-events-none animate-flare-shimmer opacity-85"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(254, 240, 138, 0.15) 20%, rgba(255, 255, 255, 0.8) 50%, rgba(254, 240, 138, 0.15) 80%, transparent 100%)',
                boxShadow: '0 0 8px 1px rgba(255, 255, 255, 0.6)',
              }}
            />

            {/* 7. Diagonal Starburst Flare Streaks (45 deg) */}
            <div
              className="absolute w-[160px] sm:w-[220px] h-[1.5px] pointer-events-none rotate-45 opacity-65"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(254, 240, 138, 0.1) 20%, rgba(255, 255, 255, 0.7) 50%, rgba(254, 240, 138, 0.1) 80%, transparent 100%)',
                boxShadow: '0 0 6px 1px rgba(255, 255, 255, 0.5)',
              }}
            />

            {/* 8. CINEMATIC LENS FLARE REFLECTION GHOSTS (Circular optical refraction orbs) */}
            <div
              className="absolute w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-yellow-200/40 bg-yellow-300/10 pointer-events-none blur-[0.5px]"
              style={{
                transform: 'translate(-40px, -55px)',
              }}
            />
            <div
              className="absolute w-2.5 h-2.5 rounded-full bg-cyan-200/65 pointer-events-none blur-[0.6px] shadow-[0_0_6px_rgba(103,232,249,0.75)]"
              style={{
                transform: 'translate(-80px, -105px)',
              }}
            />
            <div
              className="absolute w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gradient-to-tr from-amber-400/15 via-yellow-200/20 to-transparent pointer-events-none blur-[2px]"
              style={{
                transform: 'translate(-125px, -165px)',
              }}
            />
            <div
              className="absolute w-16 sm:w-20 h-16 sm:h-20 rounded-full border border-sky-300/25 bg-gradient-to-br from-yellow-300/10 via-sky-400/10 to-transparent pointer-events-none blur-[3px]"
              style={{
                transform: 'translate(-180px, -235px)',
              }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          DISTANT HIGH-SKY BALLOONS (Deep in Background on Outer Edges)
          ========================================================================= */}

      {/* 1. Distant Small Balloon (baloon1): Far Left Upper Sky */}
      <div
        className="absolute top-[11%] left-3 sm:left-7 z-0 animate-balloon-side-left pointer-events-none"
      >
        <img
          src={balloon1Img}
          alt="Distant balloon left"
          className="w-7 sm:w-8 h-auto opacity-60 filter blur-[0.4px] brightness-105"
        />
      </div>

      {/* 2. Distant Tiny Balloon (balloon2): Far Right Upper Sky */}
      <div
        className="absolute top-[16%] right-3 sm:right-7 z-0 animate-balloon-side-right pointer-events-none"
        style={{ animationDelay: '-8s' }}
      >
        <img
          src={balloon2Img}
          alt="Distant balloon right"
          className="w-6 sm:w-7 h-auto opacity-55 filter blur-[0.5px] brightness-100"
        />
      </div>

      {/* 3. Deep Background Speck (baloon1): Far Left Mid-High Sky */}
      <div
        className="absolute top-[30%] left-5 sm:left-10 z-0 animate-balloon-side-left pointer-events-none"
        style={{ animationDelay: '-14s' }}
      >
        <img
          src={balloon1Img}
          alt="Deep background balloon"
          className="w-5 sm:w-6 h-auto opacity-45 filter blur-[0.6px] brightness-100"
        />
      </div>
    </div>
  );
};
