import React from 'react';

export const CityBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Sky Gradient (Sunny dusk atmosphere like screenshot) */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-amber-200" />

      {/* Sun glow over the horizon */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-300/30 blur-3xl pointer-events-none" />

      {/* Hot Air Balloon (Iconic element in screenshot) */}
      <div className="absolute top-16 left-6 animate-bounce-subtle z-10 opacity-95">
        <div className="relative flex flex-col items-center">
          {/* Balloon envelope */}
          <div className="w-14 h-16 rounded-t-full rounded-b-2xl bg-gradient-to-r from-blue-600 via-sky-400 to-blue-700 shadow-lg border border-blue-900 flex items-center justify-center relative overflow-hidden">
            {/* Balloon stripes */}
            <div className="absolute inset-0 flex justify-between">
              <div className="w-2.5 h-full bg-blue-800/30" />
              <div className="w-2.5 h-full bg-white/20" />
              <div className="w-2.5 h-full bg-blue-800/30" />
            </div>
            {/* Badge */}
            <span className="relative z-10 text-[10px] font-black text-white bg-blue-900/80 px-1 rounded shadow">
              TOWER
            </span>
          </div>
          {/* Basket ropes */}
          <div className="w-6 h-3 flex justify-between px-1">
            <div className="w-[1px] h-full bg-amber-900" />
            <div className="w-[1px] h-full bg-amber-900" />
          </div>
          {/* Wicker basket */}
          <div className="w-4 h-3 bg-amber-700 rounded-xs border border-amber-950 shadow-xs" />
        </div>
      </div>

      {/* Fluffy Cartoon Clouds */}
      <div className="absolute top-10 right-10 w-44 h-16 bg-white/60 rounded-full blur-[1px] shadow-sm animate-pulse-subtle">
        <div className="absolute -top-6 left-6 w-20 h-20 bg-white/60 rounded-full" />
        <div className="absolute -top-4 right-6 w-16 h-16 bg-white/60 rounded-full" />
      </div>

      <div className="absolute top-28 left-20 w-36 h-12 bg-white/40 rounded-full blur-[1px]">
        <div className="absolute -top-5 left-4 w-14 h-14 bg-white/40 rounded-full" />
      </div>

      {/* Distant City Skyline Silhouette (Layer 1 - deep background) */}
      <div className="absolute bottom-16 inset-x-0 h-44 flex items-end justify-between opacity-35">
        <div className="w-12 h-36 bg-amber-600/40 rounded-t" />
        <div className="w-16 h-28 bg-amber-700/40 rounded-t" />
        <div className="w-10 h-44 bg-amber-600/40 rounded-t" />
        <div className="w-20 h-24 bg-amber-700/40 rounded-t" />
        <div className="w-14 h-40 bg-amber-600/40 rounded-t" />
        <div className="w-16 h-32 bg-amber-700/40 rounded-t" />
        <div className="w-12 h-36 bg-amber-600/40 rounded-t" />
      </div>

      {/* Near Street Buildings (Layer 2 - colorful cartoon shops on left and right) */}
      <div className="absolute bottom-12 inset-x-0 h-36 flex items-end justify-between px-1 z-0 pointer-events-none">
        {/* Left Side Buildings with garage & shop awnings */}
        <div className="flex items-end gap-1">
          {/* Brown warehouse */}
          <div className="w-20 h-28 bg-amber-700 rounded-t border-t-2 border-r-2 border-amber-900 shadow-md p-1 relative">
            <div className="w-full h-12 bg-stone-700 rounded-t mt-8 border border-stone-800 flex flex-col justify-around py-1">
              <div className="w-full h-[1px] bg-stone-900" />
              <div className="w-full h-[1px] bg-stone-900" />
              <div className="w-full h-[1px] bg-stone-900" />
            </div>
            <div className="absolute -top-2 left-0 right-0 h-2 bg-amber-900 rounded-t" />
          </div>

          {/* Yellow Italian house */}
          <div className="w-16 h-24 bg-yellow-600/90 rounded-t border border-amber-800 p-1 flex flex-col justify-around">
            <div className="w-4 h-4 bg-sky-200 border border-amber-900 rounded-xs self-center" />
            <div className="w-5 h-8 bg-amber-900 rounded-t self-center" />
          </div>
        </div>

        {/* Right Side Buildings with striped awning */}
        <div className="flex items-end gap-1">
          {/* Cafe with awning */}
          <div className="w-20 h-26 bg-orange-700 rounded-t border border-orange-950 p-1 relative">
            {/* Striped awning */}
            <div className="absolute -top-3 left-0 right-0 h-4 bg-red-600 rounded-t flex overflow-hidden shadow-sm">
              <div className="w-1/4 h-full bg-white" />
              <div className="w-1/4 h-full bg-red-600" />
              <div className="w-1/4 h-full bg-white" />
              <div className="w-1/4 h-full bg-red-600" />
            </div>
            <div className="w-6 h-6 bg-yellow-200 border border-stone-800 mt-3 self-center mx-auto" />
            <div className="w-6 h-10 bg-amber-950 rounded-t mx-auto mt-2" />
          </div>

          {/* Tall grey building */}
          <div className="w-14 h-32 bg-stone-500 rounded-t border border-stone-700 p-1">
            <div className="w-4 h-5 bg-sky-200 border border-stone-700 rounded-xs mx-auto mb-2" />
            <div className="w-4 h-5 bg-sky-200 border border-stone-700 rounded-xs mx-auto" />
          </div>
        </div>
      </div>

      {/* Street Pavement and Asphalt Road */}
      <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-b from-stone-600 via-stone-700 to-stone-800 border-t-4 border-stone-500 shadow-2xl z-10">
        {/* Curbside curb stones */}
        <div className="w-full h-2 bg-stone-400 border-b border-stone-500 flex">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="flex-1 border-r border-stone-600 h-full" />
          ))}
        </div>
        {/* Road markings */}
        <div className="w-full h-full flex items-center justify-around px-4">
          <div className="w-12 h-1 bg-yellow-400/80 rounded" />
          <div className="w-12 h-1 bg-yellow-400/80 rounded" />
          <div className="w-12 h-1 bg-yellow-400/80 rounded" />
          <div className="w-12 h-1 bg-yellow-400/80 rounded" />
        </div>
      </div>
    </div>
  );
};

