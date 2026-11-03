import React from 'react';
import { FallingDebris } from '../types/game';
import { SafeGameImage } from './TowerBlock';

interface FallingBlockProps {
  debrisList: FallingDebris[];
}

export const FallingBlock: React.FC<FallingBlockProps> = ({ debrisList }) => {
  return (
    <>
      {debrisList.map((item) => (
        <div
          key={item.id}
          className={`absolute pointer-events-none z-40 ${
            item.direction === 'left' ? 'animate-tumble-left' : 'animate-tumble-right'
          }`}
          style={{
            bottom: `${item.bottom}px`,
            left: `calc(50% + ${item.x}px)`,
            width: `${item.width}px`,
            height: `${item.height}px`,
            transformOrigin: item.direction === 'left' ? 'bottom left' : 'bottom right',
          }}
        >
          <SafeGameImage
            src={item.image}
            alt="Falling obstacle"
            className="w-full h-full object-fill object-bottom drop-shadow-2xl"
          />
        </div>
      ))}
    </>
  );
};
