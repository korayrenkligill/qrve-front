import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

// Cache interface
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

// API Base configuration interface
interface ApiBaseConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  enableCache?: boolean;
  defaultCacheTTL?: number; // Default cache TTL in milliseconds
}

// Request options interface
interface RequestOptions extends AxiosRequestConfig {
  cache?: boolean;
  cacheTTL?: number; // Cache TTL for this specific request
  cacheKey?: string; // Custom cache key
}

// Response wrapper interface
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: unknown;
  fromCache?: boolean;
}

class ApiBase {
  private axiosInstance: AxiosInstance;
  private cache: Map<string, CacheItem<unknown>> = new Map();
  private enableCache: boolean;
  private defaultCacheTTL: number;

  constructor(config: ApiBaseConfig) {
    this.enableCache = config.enableCache ?? true;
    this.defaultCacheTTL = config.defaultCacheTTL ?? 5 * 60 * 1000;

    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 10000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    const token = Cookies.get("accessToken");
    if (token) {
      this.setAuthToken(token);
    }

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error(
          "❌ Response Error:",
          error.response?.status,
          error.message
        );
        return Promise.reject(error);
      }
    );
  }

  private generateCacheKey(
    url: string,
    method: string,
    params?: unknown,
    data?: unknown
  ): string {
    const key = `${method.toUpperCase()}_${url}_${JSON.stringify(
      params || {}
    )}_${JSON.stringify(data || {})}`;
    return btoa(unescape(encodeURIComponent(key)));
  }

  private getCachedData<T>(cacheKey: string): T | null {
    if (!this.enableCache) return null;

    const cached = this.cache.get(cacheKey);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(cacheKey);
      return null;
    }
    const decodedKey = atob(cacheKey);
    console.log(`💾 Cache hit for key: ${decodedKey}`);
    return cached.data as T;
  }

  private setCachedData<T>(cacheKey: string, data: T, ttl: number): void {
    if (!this.enableCache) return;

    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    const decodedKey = atob(cacheKey);
    console.log(`💾 Data cached with key: ${decodedKey}`);
  }

  public debugCacheManually() {
    // @ts-ignore
    const cache = this["cache"] as Map<string, unknown>;
    if (!cache) return;

    console.log(`🧪 BusinessUserApi Cache (${cache.size} items):`);
    for (const [key, value] of cache.entries()) {
      console.log(`🗝️ ${atob(key)} =>`, value);
    }
  }

  public clearCache(): void {
    this.debugCacheManually();

    this.cache.clear();

    console.log("🗑️ Cache cleared");
    console.log("📭 Current cache size:", this.cache.size);
  }

  public clearCacheByPattern(pattern: string): void {
    const regex = new RegExp(pattern, "i"); // Case insensitive
    let deletedCount = 0;

    for (const [encodedKey] of this.cache) {
      const decodedKey = atob(encodedKey);
      if (regex.test(decodedKey)) {
        this.cache.delete(encodedKey);
        deletedCount++;
      }
    }
    console.log(`🗑️ Cache cleared for pattern: ${pattern}`);
  }

  // Generic request method
  private async request<TResponse = unknown, TRequest = unknown>(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    url: string,
    data?: TRequest,
    options: RequestOptions = {}
  ): Promise<ApiResponse<TResponse>> {
    const {
      cache = this.enableCache && method === "GET",
      cacheTTL = this.defaultCacheTTL,
      cacheKey,
      ...axiosConfig
    } = options;

    const finalCacheKey =
      cacheKey || this.generateCacheKey(url, method, axiosConfig.params, data);

    if (cache && method === "GET") {
      const cachedData = this.getCachedData<TResponse>(finalCacheKey);
      if (cachedData) {
        return {
          data: cachedData,
          status: 200,
          statusText: "OK",
          headers: {},
          fromCache: true,
        };
      }
    }

    try {
      const response: AxiosResponse<TResponse> =
        await this.axiosInstance.request({
          method,
          url,
          data,
          ...axiosConfig,
        });

      const apiResponse: ApiResponse<TResponse> = {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        fromCache: false,
      };

      if (cache && method === "GET" && response.status === 200) {
        this.setCachedData(finalCacheKey, response.data, cacheTTL);
      }

      return apiResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response?.data.message && error.response?.status === 401) {
          toast.error("Oturumunuz geçerli değil, sayfa yenileniyor...", {
            id: "auth-error",
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
        console.error("❌ Axios Error:", error.response?.status, error.message);
        throw {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          isAxiosError: true,
        };
      }
      throw error;
    }
  }

  public async get<TResponse = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>("GET", url, undefined, options);
  }

  public async post<TResponse = unknown, TRequest = unknown>(
    url: string,
    data?: TRequest,
    options: RequestOptions = {}
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TRequest>("POST", url, data, options);
  }

  public async put<TResponse = unknown, TRequest = unknown>(
    url: string,
    data?: TRequest,
    options: RequestOptions = {}
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TRequest>("PUT", url, data, options);
  }

  public async patch<TResponse = unknown, TRequest = unknown>(
    url: string,
    data?: TRequest,
    options: RequestOptions = {}
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TRequest>("PATCH", url, data, options);
  }

  public async delete<TResponse = unknown>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>("DELETE", url, undefined, options);
  }

  public setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }

  public removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common["Authorization"];
  }

  public setHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  public removeHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()).map((key) => atob(key)),
    };
  }
}

export { ApiBase };
