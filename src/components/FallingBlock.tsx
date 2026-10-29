import React from 'react';
import { FallingDebris } from '../types/game';

interface FallingBlockProps {
  debrisList: FallingDebris[];
}

export const FallingBlock: React.FC<FallingBlockProps> = ({ debrisList }) => {
  return (
    <>
      {debrisList.map((item) => (
        <div
          key={item.id}
          className="absolute left-1/2 pointer-events-none z-20 transition-transform duration-700 ease-in"
          style={{
            transform: `translate3d(calc(-50% + ${item.x}px), ${item.y}px, 0) rotate(${item.rotation}deg)`,
            width: `${Math.max(4, item.width)}px`,
            height: `${item.height}px`,
            backgroundColor: item.colorTheme.primary,
            borderRadius: '2px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
            opacity: Math.max(0, 1 - item.y / 500),
          }}
        >
          {/* Rubble details */}
          <div className="w-full h-1 bg-black/30" />
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-2 h-2 bg-yellow-200/40 rounded-xs" />
          </div>
        </div>
      ))}
    </>
  );
};

