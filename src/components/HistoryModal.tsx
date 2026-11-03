import React from 'react';
import { BetHistoryItem } from '../types/game';
import { X, Trash2, Calendar, TrendingUp, TrendingDown, History } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface HistoryModalProps {
  isOpen: boolean;
  history: BetHistoryItem[];
  onClose: () => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  history,
  onClose,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-white">Bet & Round History</h3>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of rounds */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No rounds recorded yet. Play a game to record your demo stats!
            </div>
          ) : (
            history.map((item) => {
              const isProfit = item.profit > 0;
              return (
                <div
                  key={item.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                          item.status === 'CASHED_OUT'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        {item.multiplier.toFixed(2)}x
                      </span>
                      <span className="text-xs text-sky-400 font-medium">
                        L.{item.level}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                      <span className="text-slate-600">•</span>
                      <span>Bet: ₹{item.betAmount}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className={`text-sm font-black font-mono flex items-center gap-1 ${
                        isProfit ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isProfit ? (
                        <>
                          <TrendingUp className="w-3.5 h-3.5" />
                          +₹{item.profit.toLocaleString('en-IN')}
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3.5 h-3.5" />
                          -₹{item.betAmount.toLocaleString('en-IN')}
                        </>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Payout: ₹{item.payout.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs text-slate-400">
              Total Rounds: {history.length}
            </span>
            <button
              onClick={() => {
                soundFx.playClick();
                onClearHistory();
              }}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

