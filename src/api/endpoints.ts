/**
 * Central API Endpoints Registry
 * 
 * All API routes and endpoints are defined and managed here in one single place.
 * To update or add new API endpoints, modify this configuration.
 */

export const API_ENDPOINTS = {
  // Authentication & Profile Endpoints
  AUTH: {
    /**
     * User Login API
     * POST /api/login
     */
    LOGIN: '/api/login',

    /**
     * Fetch User Profile & Wallet Balance API
     * GET /api/profile
     */
    PROFILE: '/api/profile',

    /**
     * Update Profile API (username, userimage)
     * POST /api/update_profile
     */
    UPDATE_PROFILE: '/api/update_profile',
  },

  // Stack Tower Game Endpoints
  STACK_TOWER: {
    /**
     * 1. Game Configuration API
     * Returns min_bet, max_bet, quick_bets, and difficulty physics/multiplier settings
     * GET /api/stack-tower/config
     */
    CONFIG: '/api/stack-tower/config',

    /**
     * 2. Place Bet / Start Game API
     * POST /api/stack-tower/bet (Aliases: /stack_tower_bet, /bet)
     */
    BET: '/api/stack-tower/bet',

    /**
     * 3. Cash Out API (Claim Winnings)
     * POST /api/stack-tower/cashout (Aliases: /stack_tower_cashout, /cashout)
     */
    CASHOUT: '/api/stack-tower/cashout',

    /**
     * 4. Game Over / Tower Fall API (Missed block / lost round)
     * POST /api/stack-tower/game-over (Aliases: /stack_tower_game_over, /game-over)
     */
    GAME_OVER: '/api/stack-tower/game-over',

    /**
     * 5. Bet History API
     * GET /api/stack-tower/history (Alias: /stack_tower_history)
     */
    HISTORY: '/api/stack-tower/history',

    /**
     * 6. User Stats & Tower Build Data API
     * GET / POST /api/stack-tower/user-stats (Aliases: /stack_tower_user_stats, /stack_tower_stats)
     */
    USER_STATS: '/api/stack-tower/user-stats',
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;

