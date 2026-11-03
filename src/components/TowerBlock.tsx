import React from 'react';
import { BlockColorTheme } from '../types/game';
import { BASE_BLOCK_WIDTH, BLOCK_HEIGHT } from '../utils/gamePhysics';
import bottomShopImg from '../assets/FRAMES/BOTTOMSHOP.png';
import obs1 from '../assets/obstacle/obs1.png';
import obs2 from '../assets/obstacle/obs2.png';
import obs3 from '../assets/obstacle/obs3.png';
import obs4 from '../assets/obstacle/obs4.png';

// Exact configurations for each obstacle matching its 100% natural aspect ratio
// Unified standard width (148px) matching the PNG image size and the straight guide corridor edge-to-edge!
export const OBSTACLE_CONFIGS = [
  { img: obs1, width: 148, height: 112 },
  { img: obs2, width: 148, height: 104 },
  { img: obs3, width: 148, height: 83 },
  { img: obs4, width: 148, height: 81 },
];

// Obstacle scale multiplier (1.0 ensures 100% natural, full size matching the shop)
export const MOBILE_OBSTACLE_SCALE = 1.0;

export function getObstacleForLevel(level: number, isMobile = false) {
  if (level === 0) {
    return { img: bottomShopImg, width: BASE_BLOCK_WIDTH, height: BLOCK_HEIGHT };
  }
  const index = (level - 1) % OBSTACLE_CONFIGS.length;
  const cfg = OBSTACLE_CONFIGS[index];
  const scale = isMobile ? MOBILE_OBSTACLE_SCALE : 1.0;
  return {
    img: cfg.img,
    width: Math.round(cfg.width * scale),
    height: Math.round(cfg.height * scale),
  };
}

interface TowerBlockProps {
  width: number;
  height: number;
  theme?: BlockColorTheme;
  level: number;
  isBase?: boolean;
  isPerfect?: boolean;
}

export const TowerBlock: React.FC<TowerBlockProps> = ({
  width,
  height,
  level,
  isBase = false,
  isPerfect = false,
}) => {
  // If base shop (Level 0: Exact User Uploaded Image BOTTOMSHOP.png)
  if (isBase) {
    return (
      <div
        className="relative z-20 flex flex-col items-center justify-end overflow-visible select-none"
        style={{
          width: `${width + 40}px`,
          height: `${height + 50}px`,
          transform: 'translateX(-12px)',
        }}
      >
        {/* Exact User Uploaded Image */}
        <img
          src={bottomShopImg}
          alt="Base Shop"
          className="w-full h-full object-contain object-bottom"
        />
      </div>
    );
  }

  const obs = getObstacleForLevel(level);

  return (
    <div
      className={`relative flex items-center justify-center overflow-visible transition-all duration-200 select-none ${
        isPerfect ? 'brightness-110 drop-shadow-[0_0_14px_rgba(250,204,21,0.95)]' : ''
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {/* Obstacle Image: object-fill with exact matching ratio ensures 0 gap and 0 distortion */}
      <img
        src={obs.img}
        alt={`Obstacle Level ${level}`}
        className="w-full h-full object-fill object-bottom pointer-events-none drop-shadow-md"
      />
    </div>
  );
};
