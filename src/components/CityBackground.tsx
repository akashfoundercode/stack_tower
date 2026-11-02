import React from 'react';
import balloon1Img from '../assets/games/baloon1.png';
import balloon2Img from '../assets/games/balloon2.png';
import frameBg from '../assets/FRAMES/FRAMES (1).png';
import frame2Bg from '../assets/FRAMES/frame2 (1).png';

interface CityBackgroundProps {
  cameraY?: number;
}

export const CityBackground: React.FC<CityBackgroundProps> = ({ cameraY = 0 }) => {
  // Parallax factor: as tower climbs high, background continuously scrolls down
  const parallaxOffset = cameraY * 0.38;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Sky Canvas Gradient behind and above frames */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0260b0 0%, #097cd9 35%, #0e8efe 65%, #1193fe 100%)',
        }}
      />

      {/* Atmospheric Clouds in high sky */}
      <div className="absolute top-10 left-[8%] w-52 h-14 bg-white/35 rounded-full blur-[2px] shadow-xs animate-pulse-subtle" />
      <div className="absolute top-24 right-[12%] w-64 h-16 bg-white/30 rounded-full blur-[2px]" />
      <div className="absolute top-44 left-[32%] w-40 h-10 bg-white/20 rounded-full blur-[1px]" />

      {/* Continuous Multi-Layer Sky Frame Stack: Continues seamlessly as obstacle tower climbs higher */}
      <div
        className="absolute inset-x-0 bottom-0 h-full w-full transition-transform duration-500 ease-out will-change-transform"
        style={{
          transform: `translate3d(0px, ${parallaxOffset}px, 0px)`,
        }}
      >
        {/* Sky Level 4 (Very High Atmosphere) */}
        <div className="absolute inset-x-0 bottom-[calc(400%-8px)] h-full w-full pointer-events-none">
          <img
            src={frame2Bg}
            alt="Sky Level 4"
            className="w-full h-full object-cover object-bottom"
          />
        </div>

        {/* Sky Level 3 (High Clouds) */}
        <div className="absolute inset-x-0 bottom-[calc(300%-6px)] h-full w-full pointer-events-none">
          <img
            src={frame2Bg}
            alt="Sky Level 3"
            className="w-full h-full object-cover object-bottom transform scale-x-[-1]"
          />
        </div>

        {/* Sky Level 2 (Mid Sky) */}
        <div className="absolute inset-x-0 bottom-[calc(200%-4px)] h-full w-full pointer-events-none">
          <img
            src={frame2Bg}
            alt="Sky Level 2"
            className="w-full h-full object-cover object-bottom"
          />
        </div>

        {/* Sky Level 1 (Upper Frame 2) - Softly feathered at the bottom to merge seamlessly with Frame 1 */}
        <div className="absolute inset-x-0 bottom-[calc(100%-2px)] h-full w-full pointer-events-none z-10">
          <img
            src={frame2Bg}
            alt="Upper Sky Frame 1"
            className="w-full h-full object-cover object-bottom"
            style={{
              maskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 40px, black 120px)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 0%, rgba(0,0,0,0.5) 40px, black 120px)',
            }}
          />
        </div>

        {/* Seamless Blending Bridge Overlay between Ground Frame 1 and Sky Frame 2 */}
        <div
          className="absolute inset-x-0 h-44 pointer-events-none z-20"
          style={{
            bottom: 'calc(100% - 80px)',
            background:
              'linear-gradient(to top, rgba(17, 147, 254, 0.95) 0%, rgba(62, 177, 253, 0.7) 45%, rgba(173, 214, 252, 0) 100%)',
          }}
        />

        {/* Main Ground Frame 1 (FRAMES (1).png) - Softly fades at the top into the sky */}
        <img
          src={frameBg}
          alt="Ground World Background Frame"
          className="w-full h-full object-cover object-bottom relative z-10"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 50px, black 130px)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 50px, black 130px)',
          }}
        />
      </div>

      {/* =========================================================================
          REALISTIC DISTANT HIGH-SKY BALLOONS (Small, Soft, Deep in Background on Outer Edges)
          Strictly kept far away on outer sides — CENTER IS 100% CLEAR FOR OBSTACLE & TOWER!
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
