import React from 'react';
import { BlockLayer } from '../types/game';
import { TowerBlock } from './TowerBlock';

interface TowerProps {
  layers: BlockLayer[];
}

export const Tower: React.FC<TowerProps> = ({ layers }) => {
  return (
    <div className="relative w-full flex flex-col items-center">
      {/* We render layers bottom-up: base is index 0 at the bottom */}
      <div className="relative flex flex-col-reverse items-center">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="relative will-change-transform"
            style={{
              transform: `translateX(${layer.x}px)`,
              width: `${layer.width}px`,
              height: `${layer.height}px`,
              marginBottom: '-1px', // Seamless brick fit
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
        ))}
      </div>
    </div>
  );
};
