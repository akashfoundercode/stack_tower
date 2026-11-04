/**
 * API Client & Base URL Configuration
 * 
 * The Base URL is configured here in one central location.
 * - Reads from environment variable `VITE_API_BASE_URL` (configured in .env)
 * - Defaults to `https://api.wingo4all.site`
 */

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://api.wingo4all.site';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  /**
   * Update base URL at runtime if needed
   */
  public setBaseUrl(newBaseUrl: string) {
    this.baseUrl = newBaseUrl.replace(/\/+$/, '');
  }

  /**
   * Retrieve current base URL
   */
  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Set or remove authentication bearer token
   */
  public setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  /**
   * Universal fetch wrapper with error handling, timeout, and query params
   */
  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { body, params, timeoutMs = 10000, headers, ...customConfig } = options;

    let url = endpoint.startsWith('http://') || endpoint.startsWith('https://')
      ? endpoint
      : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const savedToken =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('token') ||
          localStorage.getItem('auth_token') ||
          localStorage.getItem('jwt')
        : null;

    const authHeader: Record<string, string> =
      !this.defaultHeaders['Authorization'] && savedToken
        ? { Authorization: `Bearer ${savedToken}` }
        : {};

    try {
      const response = await fetch(url, {
        ...customConfig,
        headers: {
          ...this.defaultHeaders,
          ...authHeader,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new ApiError(response.status, response.statusText, data);
      }

      return data as T;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof ApiError) throw err;
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError(408, 'Request Timeout');
      }
      throw new ApiError(0, err instanceof Error ? err.message : 'Network Error');
    }
  }

  public get<T>(endpoint: string, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  public put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  public delete<T>(endpoint: string, options?: Omit<RequestOptions, 'body' | 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Global ApiClient instance initialized with BASE_URL
export const apiClient = new ApiClient(API_BASE_URL);

