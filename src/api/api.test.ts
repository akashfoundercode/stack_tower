import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { API_BASE_URL, apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import { stackTowerService, DEFAULT_STACK_TOWER_CONFIG } from './services/stackTowerService';
import { authService } from './services/authService';
import { socketService } from './socket';

describe('API Architecture & Structure', () => {
  const originalFetch = globalThis.fetch;

  let store: Record<string, string> = {};

  beforeEach(() => {
    vi.restoreAllMocks();
    store = {};
    const mockStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      length: 0,
      key: () => null,
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('has centralized API_BASE_URL defined in one place', () => {
    expect(API_BASE_URL).toBeDefined();
    expect(API_BASE_URL).toBe('https://api.wingo4all.site');
  });

  it('has centralized API_ENDPOINTS defined in one place', () => {
    expect(API_ENDPOINTS.STACK_TOWER.CONFIG).toBe('/api/stack-tower/config');
  });

  it('builds full URL correctly combining base URL and endpoint', async () => {
    const mockResponse = {
      status: 200,
      success: true,
      data: DEFAULT_STACK_TOWER_CONFIG,
    };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockResponse,
    });
    globalThis.fetch = fetchSpy;

    const result = await apiClient.get(API_ENDPOINTS.STACK_TOWER.CONFIG);
    expect(result).toEqual(mockResponse);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.wingo4all.site/api/stack-tower/config',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      })
    );
  });

  it('fetches stack tower config successfully through stackTowerService', async () => {
    const mockApiData = {
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

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        status: 200,
        success: true,
        data: mockApiData,
      }),
    });

    const config = await stackTowerService.getConfig();
    expect(config.game_name).toBe('Stack Tower');
    expect(config.min_bet).toBe(10);
    expect(config.max_bet).toBe(50000);
    expect(config.difficulties.EASY.angular_speed).toBe(2.2);
    expect(config.difficulties.MEDIUM.angular_speed).toBe(2.8);
    expect(config.difficulties.HARD.angular_speed).toBe(3.4);
  });

  it('places bet successfully through stackTowerService.placeBet', async () => {
    const mockBetResponse = {
      status: 200,
      success: true,
      message: 'Bet placed successfully',
      data: {
        round_id: 'ST2026110317150112345',
        bet_amount: 100,
        difficulty: 'MEDIUM',
        current_level: 0,
        multiplier: 1.0,
        wallet_balance: 9900.0,
        status: 'PLAYING',
      },
    };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockBetResponse,
    });
    globalThis.fetch = fetchSpy;

    const result = await stackTowerService.placeBet({
      amount: 100,
      difficulty: 'MEDIUM',
    });

    expect(result.round_id).toBe('ST2026110317150112345');
    expect(result.wallet_balance).toBe(9900.0);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.wingo4all.site/api/stack-tower/bet',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ amount: 100, difficulty: 'MEDIUM' }),
      })
    );
  });

  it('cashes out successfully through stackTowerService.cashOut', async () => {
    const mockCashOutResponse = {
      status: 200,
      success: true,
      message: 'Cashout successful',
      data: {
        round_id: 'ST2026110317150112345',
        bet_amount: 100,
        level: 5,
        multiplier: 2.5,
        win_amount: 250.0,
        profit: 150.0,
        wallet_balance: 10150.0,
        status: 'CASHED_OUT',
      },
    };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockCashOutResponse,
    });
    globalThis.fetch = fetchSpy;

    const result = await stackTowerService.cashOut({
      round_id: 'ST2026110317150112345',
      level: 5,
      multiplier: 2.5,
    });

    expect(result.win_amount).toBe(250.0);
    expect(result.profit).toBe(150.0);
    expect(result.wallet_balance).toBe(10150.0);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.wingo4all.site/api/stack-tower/cashout',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          round_id: 'ST2026110317150112345',
          level: 5,
          multiplier: 2.5,
        }),
      })
    );
  });

  it('handles game over successfully through stackTowerService.gameOver', async () => {
    const mockGameOverResponse = {
      status: 200,
      success: true,
      message: 'Game over - Round lost',
      data: {
        round_id: 'ST2026110317150112345',
        level: 3,
        multiplier: 1.6,
        payout: 0,
        status: 'LOST',
      },
    };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockGameOverResponse,
    });
    globalThis.fetch = fetchSpy;

    const result = await stackTowerService.gameOver({
      round_id: 'ST2026110317150112345',
      final_level: 3,
      final_multiplier: 1.6,
    });

    expect(result.status).toBe('LOST');
    expect(result.payout).toBe(0);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.wingo4all.site/api/stack-tower/game-over',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          round_id: 'ST2026110317150112345',
          final_level: 3,
          final_multiplier: 1.6,
        }),
      })
    );
  });

  it('fetches bet history successfully through stackTowerService.getHistory', async () => {
    const mockHistoryResponse = {
      status: 200,
      success: true,
      message: 'Data found',
      data: [
        {
          id: 'ST2026110317150112345',
          timestamp: 1730634900000,
          betAmount: 100,
          difficulty: 'MEDIUM',
          level: 5,
          multiplier: 2.5,
          payout: 250,
          profit: 150,
          status: 'CASHED_OUT',
        },
      ],
    };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockHistoryResponse,
    });
    globalThis.fetch = fetchSpy;

    const history = await stackTowerService.getHistory(20);
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe('ST2026110317150112345');
    expect(history[0].payout).toBe(250);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.wingo4all.site/api/stack-tower/history?limit=20',
      expect.objectContaining({
        method: 'GET',
      })
    );
  });

  it('fetches user statistics successfully through stackTowerService.getUserStats', async () => {
    const mockStatsResponse = {
      status: 200,
      success: true,
      message: 'User Stack Tower statistics fetched successfully',
      data: {
        user_id: 1,
        total_bets: 45,
        total_wagered: 4500.0,
        total_won: 5200.0,
        net_profit: 700.0,
        highest_tower_built: 18,
        total_towers_built: 32,
        average_tower_height: 7.4,
        win_rate: '71.11%',
        modes: {
          EASY: {
            mode: 'EASY',
            total_bets: 20,
            total_wagered: 2000.0,
            total_won: 2400.0,
            net_profit: 400.0,
            highest_tower_built: 18,
            avg_tower_height: 9.2,
            cashed_out: 15,
            lost: 5,
            win_rate: '75.00%',
          },
          MEDIUM: {
            mode: 'MEDIUM',
            total_bets: 15,
            total_wagered: 1500.0,
            total_won: 1800.0,
            net_profit: 300.0,
            highest_tower_built: 12,
            avg_tower_height: 6.8,
            cashed_out: 10,
            lost: 5,
            win_rate: '66.67%',
          },
          HARD: {
            mode: 'HARD',
            total_bets: 10,
            total_wagered: 1000.0,
            total_won: 1000.0,
            net_profit: 0.0,
            highest_tower_built: 8,
            avg_tower_height: 4.5,
            cashed_out: 4,
            lost: 6,
            win_rate: '40.00%',
          },
        },
      },
    };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockStatsResponse,
    });
    globalThis.fetch = fetchSpy;

    const stats = await stackTowerService.getUserStats(1);
    expect(stats.user_id).toBe(1);
    expect(stats.highest_tower_built).toBe(18);
    expect(stats.total_towers_built).toBe(32);
    expect(stats.modes.EASY.highest_tower_built).toBe(18);
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.wingo4all.site/api/stack-tower/user-stats?userid=1',
      expect.objectContaining({
        method: 'GET',
      })
    );
  });

  it('manages socket events and listeners cleanly through socketService', () => {
    const mockCallback = vi.fn();
    const unsubscribe = socketService.onObstacleDropped(mockCallback);
    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });

  it('authenticates user and stores token via authService.login', async () => {
    const mockLoginResponse = {
      message: 'Login successful',
      status: '200',
      id: 15,
      token: '42|a1b2c3d4e5f678901234567890abcdef1234567890abcdef',
      login_token: 'e8f39a04bc612de490f11a88',
      token_type: 'Bearer',
      wallet: 1000,
      winning_wallet: 500,
      total_wallet: 1000,
      data: {
        id: 15,
        token: '42|a1b2c3d4e5f678901234567890abcdef1234567890abcdef',
        login_token: 'e8f39a04bc612de490f11a88',
        username: 'User_KXWPT',
        mobile: '9876543210',
        email: null,
        u_id: '489214',
        wallet: 1000,
        winning_wallet: 500,
        third_party_wallet: 0,
        total_wallet: 1000,
        recharge: 0,
        status: '1',
        type: '0',
      },
    };

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => mockLoginResponse,
    });
    globalThis.fetch = fetchSpy;

    const res = await authService.login({
      mobile: '9876543210',
      password: 'password123',
    });

    expect(res.token).toBe('42|a1b2c3d4e5f678901234567890abcdef1234567890abcdef');
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getStoredToken()).toBe('42|a1b2c3d4e5f678901234567890abcdef1234567890abcdef');
    expect(authService.getStoredUser()?.username).toBe('User_KXWPT');

    // Test logout
    authService.logout();
    expect(authService.isAuthenticated()).toBe(false);
    expect(authService.getStoredToken()).toBeNull();
  });
});
