import React from 'react';
import { BlockLayer } from '../types/game';
import { TowerBlock } from './TowerBlock';

interface TowerProps {
  layers: BlockLayer[];
  isOutOfBounds?: boolean;
  showBoundaryLines?: boolean;
}

export const Tower = React.forwardRef<HTMLDivElement, TowerProps>(
  ({ layers, isOutOfBounds = false, showBoundaryLines = false }, ref) => {
    return (
      <div className="relative w-full flex flex-col items-center">
        {/* We render layers bottom-up: base is index 0 at the bottom */}
        <div ref={ref} className="relative flex flex-col-reverse items-center">
          {layers.map((layer, index) => {
            const isTop = index === layers.length - 1;
            return (
              <div
                key={layer.id}
                className="relative will-change-transform transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(${layer.x}px) rotate(${layer.tilt || 0}deg)`,
                  width: `${layer.width}px`,
                  height: `${layer.height}px`,
                  marginBottom: layer.level === 1 ? '-32px' : '-2px', // Seamless zero gap landing on bottom shop & stacked blocks
                  transformOrigin: 'center center',
                }}
              >
                {/* 2 Thin Hairline Boundary Guide Lines on Left & Right (exact distance of obstacle PNG) */}
                {isTop && showBoundaryLines && (
                  <div className="absolute bottom-[calc(100%-2px)] inset-x-0 pointer-events-none z-30 select-none">
                    {/* Left Boundary Line (Exact left edge of obstacle) */}
                    <div
                      className={`absolute left-0 bottom-0 w-[1px] h-60 border-l border-dashed transition-colors duration-150 ${
                        isOutOfBounds
                          ? 'border-rose-500 drop-shadow-[0_0_6px_#f43f5e]'
                          : 'border-yellow-300/80 drop-shadow-[0_0_4px_#facc15]'
                      }`}
                    />

                    {/* Right Boundary Line (Exact right edge of obstacle) */}
                    <div
                      className={`absolute right-0 bottom-0 w-[1px] h-60 border-r border-dashed transition-colors duration-150 ${
                        isOutOfBounds
                          ? 'border-rose-500 drop-shadow-[0_0_6px_#f43f5e]'
                          : 'border-yellow-300/80 drop-shadow-[0_0_4px_#facc15]'
                      }`}
                    />
                  </div>
                )}

                <TowerBlock
                  width={layer.width}
                  height={layer.height}
                  theme={layer.colorTheme}
                  level={layer.level}
                  isBase={layer.level === 0}
                  isPerfect={layer.isPerfect}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

Tower.displayName = 'Tower';

