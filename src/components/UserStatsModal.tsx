import React, { useEffect, useState } from 'react';
import { X, Trophy, TrendingUp, TrendingDown, BarChart3, Shield, Zap, Flame, Building2, Percent } from 'lucide-react';
import { stackTowerService } from '../api';
import { UserStatsData } from '../api/types';
import { soundFx } from '../utils/sound';

interface UserStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | number;
}

export const UserStatsModal: React.FC<UserStatsModalProps> = ({
  isOpen,
  onClose,
  userId,
}) => {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'EASY' | 'MEDIUM' | 'HARD'>('ALL');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      stackTowerService.getUserStats(userId).then((data) => {
        setStats(data);
        setLoading(false);
      });
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <BarChart3 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-mono">
                Tower Build Stats
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400">
                User ID: <span className="text-amber-400 font-mono font-bold">#{stats?.user_id || userId || 1}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Tab Selector: ALL | EASY | MEDIUM | HARD */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 rounded-2xl my-3 border border-slate-800 flex-shrink-0">
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedTab('ALL');
            }}
            className={`flex-1 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1 ${
              selectedTab === 'ALL'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>All</span>
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedTab('EASY');
            }}
            className={`flex-1 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1 ${
              selectedTab === 'EASY'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Easy</span>
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedTab('MEDIUM');
            }}
            className={`flex-1 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1 ${
              selectedTab === 'MEDIUM'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Med</span>
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedTab('HARD');
            }}
            className={`flex-1 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1 ${
              selectedTab === 'HARD'
                ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Hard</span>
          </button>
        </div>

        {/* Content Body */}
        {loading || !stats ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Fetching statistics from server...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {selectedTab === 'ALL' ? (
              /* Overall Combined Statistics */
              <>
                {/* Highlights Banner: Highest Tower & Win Rate */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/40 shadow-inner flex flex-col justify-between">
                    <div className="flex items-center justify-between text-amber-400 text-xs font-semibold mb-1">
                      <span>Highest Tower</span>
                      <Trophy className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                        {stats.highest_tower_built}
                      </span>
                      <span className="text-xs text-amber-200/80 font-bold uppercase">Floors</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 shadow-inner flex flex-col justify-between">
                    <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold mb-1">
                      <span>Win Rate</span>
                      <Percent className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">
                        {stats.win_rate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Summary Grid */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Total Bets</div>
                    <div className="text-lg font-black text-white font-mono">{stats.total_bets}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Total Won</div>
                    <div className="text-lg font-black text-emerald-400 font-mono">₹{stats.total_won.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold mb-1">Net Profit</div>
                    <div className={`text-lg font-black font-mono flex items-center justify-center gap-0.5 ${stats.net_profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stats.net_profit >= 0 ? <TrendingUp className="w-3.5 h-3.5 inline" /> : <TrendingDown className="w-3.5 h-3.5 inline" />}
                      ₹{Math.abs(stats.net_profit).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Building Performance Metrics */}
                <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2.5">
                  <div className="text-xs font-black text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Tower Metrics</span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Total Towers Built (Cashed Out)</span>
                    <span className="font-mono font-bold text-white">{stats.total_towers_built}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Average Tower Height</span>
                    <span className="font-mono font-bold text-amber-300">{stats.average_tower_height} Floors</span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-400">Total Wagered Amount</span>
                    <span className="font-mono font-bold text-white">₹{stats.total_wagered.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </>
            ) : (
              /* Specific Mode Statistics (EASY | MEDIUM | HARD) */
              (() => {
                const modeData = stats.modes[selectedTab] || {
                  mode: selectedTab,
                  total_bets: 0,
                  total_wagered: 0,
                  total_won: 0,
                  net_profit: 0,
                  highest_tower_built: 0,
                  avg_tower_height: 0,
                  cashed_out: 0,
                  lost: 0,
                  win_rate: '0.00%',
                };

                return (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Selected Mode</div>
                        <div className="text-lg font-black text-white font-mono flex items-center gap-1.5 mt-0.5">
                          {selectedTab === 'EASY' && <Shield className="w-4 h-4 text-emerald-400" />}
                          {selectedTab === 'MEDIUM' && <Zap className="w-4 h-4 text-amber-400" />}
                          {selectedTab === 'HARD' && <Flame className="w-4 h-4 text-rose-500" />}
                          <span>{selectedTab} MODE</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Mode Win Rate</div>
                        <div className="text-lg font-black text-emerald-400 font-mono">{modeData.win_rate}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Highest Tower</div>
                        <div className="text-xl font-black text-amber-300 font-mono mt-1">
                          {modeData.highest_tower_built} <span className="text-xs text-amber-200/80 font-normal">Floors</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">Avg Height</div>
                        <div className="text-xl font-black text-sky-400 font-mono mt-1">
                          {modeData.avg_tower_height} <span className="text-xs text-sky-200/80 font-normal">Floors</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Total Mode Bets</span>
                        <span className="font-mono font-bold text-white">{modeData.total_bets}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Cashed Out vs Lost</span>
                        <span className="font-mono font-bold text-white">
                          <span className="text-emerald-400">{modeData.cashed_out} Won</span> / <span className="text-rose-400">{modeData.lost} Lost</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Total Wagered</span>
                        <span className="font-mono font-bold text-white">₹{modeData.total_wagered.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Total Won</span>
                        <span className="font-mono font-bold text-emerald-400">₹{modeData.total_won.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs py-1">
                        <span className="text-slate-400">Mode Net Profit</span>
                        <span className={`font-mono font-black ${modeData.net_profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {modeData.net_profit >= 0 ? '+' : ''}₹{modeData.net_profit.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        )}
      </div>
    </div>
  );
};
