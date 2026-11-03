import React from 'react';
import { BlockLayer } from '../types/game';
import { TowerBlock } from './TowerBlock';

interface TowerProps {
  layers: BlockLayer[];
  isOutOfBounds?: boolean;
  showBoundaryLines?: boolean;
}

export const Tower = React.memo(
  React.forwardRef<HTMLDivElement, TowerProps>(({ layers }, ref) => {
    return (
      <div className="relative w-full flex flex-col items-center">
        {/* We render layers bottom-up: base is index 0 at the bottom */}
        <div ref={ref} className="relative flex flex-col-reverse items-center">
          {layers.map((layer, index) => {
            const isTop = index === layers.length - 1;
            const isSupporting = index === layers.length - 2;
            const isVisible = isTop || isSupporting;

            return (
              <div
                key={layer.id}
                className={`relative will-change-transform transition-all duration-500 ease-out ${
                  isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                style={{
                  transform: `translateX(${layer.x}px) rotate(${layer.tilt || 0}deg)`,
                  width: `${layer.width}px`,
                  height: `${layer.height}px`,
                  marginBottom: layer.level === 1 ? '-32px' : '-2px', // Seamless zero gap landing on bottom shop & stacked blocks
                  transformOrigin: 'center center',
                }}
              >
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
  })
);

Tower.displayName = 'Tower';

