import { io, Socket } from 'socket.io-client';
import { ObstacleDroppedData, JoinRoundPayload, StackBlockPayload } from './types';
import { API_BASE_URL } from './client';

/**
 * Stack Tower Real-time Socket.IO Service
 * Handles live game sync, round room joining, real-time tower stacking updates,
 * and instant admin force-stop / obstacle drop events.
 */

export const SOCKET_URL: string =
  (import.meta.env.VITE_SOCKET_URL as string | undefined)?.replace(/\/+$/, '') ||
  `${API_BASE_URL}/stack-tower`;

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private currentRoundId: string | null = null;
  private currentUserId: number | string = 1;
  private obstacleListeners: Array<(data: ObstacleDroppedData) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public init() {
    if (this.socket) return;

    try {
      this.socket = io(SOCKET_URL, {
        autoConnect: true,
        // Preferred transports: WebSocket first, fallback to HTTP polling
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('[Socket] Connected to Stack Tower:', this.socket?.id);
      });

      // 1. Connection check event from server
      this.socket.on('stack_tower_connected', (res: unknown) => {
        console.log('[Socket] stack_tower_connected:', res);
      });

      // 4. Game Over / Tower Topple / Obstacle Dropped Event
      this.socket.on('obstacle_dropped', (data: ObstacleDroppedData) => {
        console.log('🔥 [Socket] obstacle_dropped event received:', data);
        this.obstacleListeners.forEach((callback) => {
          try {
            callback(data);
          } catch (err) {
            console.error('[Socket] Error in obstacle listener:', err);
          }
        });
      });

      this.socket.on('disconnect', (reason) => {
        this.isConnected = false;
        console.log('[Socket] Disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        this.isConnected = false;
        // Quiet non-intrusive logging so game remains completely fluid offline or if socket is unreachable
        if (import.meta.env.DEV) {
          console.debug('[Socket] Waiting for socket server at:', SOCKET_URL, error.message);
        }
      });
    } catch (err) {
      console.warn('[Socket] Failed to initialize socket:', err);
    }
  }

  /**
   * 2. Join active round room after placing bet
   */
  public joinRound(
    round_id: string,
    userid: number | string = 1,
    callback?: (res: any) => void
  ) {
    this.currentRoundId = round_id;
    this.currentUserId = userid;
    if (!this.socket) this.init();

    const payload: JoinRoundPayload = {
      round_id,
      userid,
    };

    if (this.socket) {
      if (callback) {
        this.socket.emit('join_round', payload, callback);
      } else {
        this.socket.emit('join_round', payload);
      }
      console.log('[Socket] Emitted join_round:', payload);
    }
  }

  /**
   * 3. Broadcast real-time block drop / level stack to server
   */
  public emitStackBlock(
    round_id: string,
    level: number,
    multiplier: number,
    userid?: number | string
  ) {
    if (!this.socket) this.init();

    const payload: StackBlockPayload = {
      round_id: round_id || this.currentRoundId || '',
      userid: userid || this.currentUserId || 1,
      level,
      multiplier,
    };

    if (this.socket) {
      this.socket.emit('stack_block', payload);
      console.log('[Socket] Emitted stack_block:', payload);
    }
  }

  /**
   * Register listener for instant obstacle drop from admin
   */
  public onObstacleDropped(callback: (data: ObstacleDroppedData) => void): () => void {
    this.obstacleListeners.push(callback);
    return () => {
      this.obstacleListeners = this.obstacleListeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Cleanly disconnect socket
   */
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }
}

export const socketService = new SocketService();

