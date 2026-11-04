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
        // Start with HTTP polling handshake, then automatically upgrade to WebSocket when supported
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 4000,
        timeout: 6000,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('[Socket] Connected to Stack Tower:', this.socket?.id);
      });

      // 1. Connection check event from server
      this.socket.on('stack_tower_connected', (res: unknown) => {
        console.log('[Socket] stack_tower_connected:', res);
      });

      // 3. Instant Admin Force Stop / Obstacle Dropped Event
      this.socket.on('obstacle_dropped', (data: ObstacleDroppedData) => {
        console.log('🔥 [Socket] INSTANT OBSTACLE DROPPED:', data);
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
  public joinRound(round_id: string, userid: number | string = 1) {
    this.currentRoundId = round_id;
    if (!this.socket) this.init();

    const payload: JoinRoundPayload = {
      round_id,
      userid,
    };

    if (this.socket) {
      this.socket.emit('join_round', payload);
      console.log('[Socket] Emitted join_round:', payload);
    }
  }

  /**
   * 4. Broadcast real-time tower level stack to server & spectators
   */
  public emitStackBlock(round_id: string, level: number, multiplier: number) {
    if (!this.socket) this.init();

    const payload: StackBlockPayload = {
      round_id: round_id || this.currentRoundId || '',
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

