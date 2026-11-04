import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import {
  StackTowerConfigResponse,
  StackTowerConfigData,
  PlaceBetRequest,
  PlaceBetResponse,
  PlaceBetData,
  CashOutRequest,
  CashOutResponse,
  CashOutData,
  GameOverRequest,
  GameOverResponse,
  GameOverData,
  BetHistoryResponse,
  BetHistoryItemData,
  UserStatsResponse,
  UserStatsData,
} from '../types';

function generateRoundId(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(10000000 + Math.random() * 90000000);
  return `ST${year}${month}${day}${rand}`;
}

/**
 * Default fallback configuration matching API schema
 * Used when offline, during initial load, or if API network request fails
 */
export const DEFAULT_STACK_TOWER_CONFIG: StackTowerConfigData = {
  game_name: 'Stack Tower',
  min_bet: 10,
  max_bet: 50000,
  quick_bets: [10, 50, 100, 500, 1000, 2000],
  difficulties: {
    EASY: {
      angular_speed: 2.2,
      max_swing_angle: 13.5,
      max_safe_offset: 24,
      multiplier_step: 0.12,
    },
    MEDIUM: {
      angular_speed: 2.8,
      max_swing_angle: 16,
      max_safe_offset: 20,
      multiplier_step: 0.18,
    },
    HARD: {
      angular_speed: 3.4,
      max_swing_angle: 18.5,
      max_safe_offset: 16,
      multiplier_step: 0.28,
    },
  },
};

/**
 * Stack Tower API Service
 * Centralizes all Stack Tower HTTP calls using API_ENDPOINTS
 */
export const stackTowerService = {
  /**
   * 1. Get Game Configuration
   * GET /api/stack-tower/config
   */
  async getConfig(): Promise<StackTowerConfigData> {
    try {
      const response = await apiClient.get<StackTowerConfigResponse>(
        API_ENDPOINTS.STACK_TOWER.CONFIG
      );
      if (response && response.success && response.data) {
        return response.data;
      }
      return DEFAULT_STACK_TOWER_CONFIG;
    } catch (error) {
      console.warn('[stackTowerService.getConfig] Network call failed, using default config:', error);
      return DEFAULT_STACK_TOWER_CONFIG;
    }
  },

  /**
   * 2. Place Bet / Start Game API
   * POST /api/stack-tower/bet
   */
  async placeBet(request: PlaceBetRequest, fallbackBalance: number = 10000): Promise<PlaceBetData> {
    try {
      const response = await apiClient.post<PlaceBetResponse>(
        API_ENDPOINTS.STACK_TOWER.BET,
        request
      );
      if (response && response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn('[stackTowerService.placeBet] Network request failed, using local offline fallback:', error);
    }

    // Offline / Network Fallback
    return {
      round_id: generateRoundId(),
      bet_amount: request.amount,
      difficulty: request.difficulty,
      current_level: 0,
      multiplier: 1.0,
      wallet_balance: Math.max(0, fallbackBalance - request.amount),
      status: 'PLAYING',
    };
  },

  /**
   * 3. Cash Out API (Claim Winnings)
   * POST /api/stack-tower/cashout
   */
  async cashOut(
    request: CashOutRequest,
    betAmount: number = 100,
    currentBalance: number = 10000
  ): Promise<CashOutData> {
    try {
      const response = await apiClient.post<CashOutResponse>(
        API_ENDPOINTS.STACK_TOWER.CASHOUT,
        request
      );
      if (response && response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn('[stackTowerService.cashOut] Network request failed, using local offline fallback:', error);
    }

    // Offline / Network Fallback
    const winAmount = Math.floor(betAmount * request.multiplier * 100) / 100;
    const profit = Math.floor((winAmount - betAmount) * 100) / 100;
    return {
      round_id: request.round_id,
      bet_amount: betAmount,
      level: request.level,
      multiplier: request.multiplier,
      win_amount: winAmount,
      profit: profit,
      wallet_balance: currentBalance + winAmount,
      status: 'CASHED_OUT',
    };
  },

  /**
   * 4. Game Over / Tower Fall API (Missed block / Lost round)
   * POST /api/stack-tower/game-over
   */
  async gameOver(request: GameOverRequest): Promise<GameOverData> {
    try {
      const response = await apiClient.post<GameOverResponse>(
        API_ENDPOINTS.STACK_TOWER.GAME_OVER,
        request
      );
      if (response && response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn('[stackTowerService.gameOver] Network request failed, using local offline fallback:', error);
    }

    // Offline / Network Fallback
    return {
      round_id: request.round_id,
      level: request.final_level,
      multiplier: request.final_multiplier,
      payout: 0,
      status: 'LOST',
    };
  },

  /**
   * 5. Bet History API
   * GET /api/stack-tower/history?limit=20
   */
  async getHistory(limit: number = 20): Promise<BetHistoryItemData[]> {
    try {
      const response = await apiClient.get<BetHistoryResponse>(
        API_ENDPOINTS.STACK_TOWER.HISTORY,
        {
          params: { limit },
        }
      );
      if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
    } catch (error) {
      console.warn('[stackTowerService.getHistory] Network request failed, using local storage fallback:', error);
    }

    // Offline / LocalStorage Fallback
    try {
      const saved = localStorage.getItem('stack_tower_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    return [];
  },

  /**
   * 6. User Stats & Tower Build Data API
   * GET /api/stack-tower/user-stats
   */
  async getUserStats(userId?: string | number): Promise<UserStatsData> {
    try {
      const response = await apiClient.get<UserStatsResponse>(
        API_ENDPOINTS.STACK_TOWER.USER_STATS,
        {
          params: userId ? { userid: userId } : undefined,
        }
      );
      if (response && response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn('[stackTowerService.getUserStats] Network request failed, calculating local stats:', error);
    }

    // Dynamic Local Stats Calculation Fallback from history
    let history: BetHistoryItemData[] = [];
    try {
      const saved = localStorage.getItem('stack_tower_history');
      if (saved) history = JSON.parse(saved);
    } catch {}

    const totalBets = history.length;
    let totalWagered = 0;
    let totalWon = 0;
    let highestTower = 0;
    let totalHeight = 0;
    let totalCashedOut = 0;

    const modes = {
      EASY: { mode: 'EASY' as const, total_bets: 0, total_wagered: 0, total_won: 0, net_profit: 0, highest_tower_built: 0, avg_tower_height: 0, cashed_out: 0, lost: 0, win_rate: '0.00%' },
      MEDIUM: { mode: 'MEDIUM' as const, total_bets: 0, total_wagered: 0, total_won: 0, net_profit: 0, highest_tower_built: 0, avg_tower_height: 0, cashed_out: 0, lost: 0, win_rate: '0.00%' },
      HARD: { mode: 'HARD' as const, total_bets: 0, total_wagered: 0, total_won: 0, net_profit: 0, highest_tower_built: 0, avg_tower_height: 0, cashed_out: 0, lost: 0, win_rate: '0.00%' },
    };

    history.forEach((item) => {
      totalWagered += item.betAmount || 0;
      totalWon += item.payout || 0;
      totalHeight += item.level || 0;
      if ((item.level || 0) > highestTower) highestTower = item.level;
      if (item.status === 'CASHED_OUT' || item.status === 'WON') totalCashedOut++;

      const m = modes[item.difficulty] || modes.MEDIUM;
      m.total_bets++;
      m.total_wagered += item.betAmount || 0;
      m.total_won += item.payout || 0;
      m.net_profit += (item.payout || 0) - (item.betAmount || 0);
      if ((item.level || 0) > m.highest_tower_built) m.highest_tower_built = item.level;
      if (item.status === 'CASHED_OUT' || item.status === 'WON') m.cashed_out++;
      else m.lost++;
    });

    Object.values(modes).forEach((m) => {
      m.avg_tower_height = m.total_bets > 0 ? Math.round((m.highest_tower_built / m.total_bets) * 10) / 10 : 0;
      m.win_rate = m.total_bets > 0 ? `${((m.cashed_out / m.total_bets) * 100).toFixed(2)}%` : '0.00%';
    });

    return {
      user_id: userId || 1,
      total_bets: totalBets,
      total_wagered: Math.round(totalWagered * 100) / 100,
      total_won: Math.round(totalWon * 100) / 100,
      net_profit: Math.round((totalWon - totalWagered) * 100) / 100,
      highest_tower_built: highestTower,
      total_towers_built: totalCashedOut,
      average_tower_height: totalBets > 0 ? Math.round((totalHeight / totalBets) * 10) / 10 : 0,
      win_rate: totalBets > 0 ? `${((totalCashedOut / totalBets) * 100).toFixed(2)}%` : '0.00%',
      modes,
    };
  },
};


