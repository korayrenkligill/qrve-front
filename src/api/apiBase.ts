import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

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
  headers: any;
  fromCache?: boolean;
}

class ApiBase {
  private axiosInstance: AxiosInstance;
  private cache: Map<string, CacheItem<any>> = new Map();
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

    // Cookie'de token varsa header'a ekle
    const token = Cookies.get("accessToken");
    if (token) {
      this.setAuthToken(token);
    }

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("❌ Request Error:", error);
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.status} ${response.config.url}`);
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
    params?: any,
    data?: any
  ): string {
    const key = `${method.toUpperCase()}_${url}_${JSON.stringify(
      params || {}
    )}_${JSON.stringify(data || {})}`;
    return btoa(key); // Base64 encode for cleaner keys
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

    console.log(`💾 Cache hit for key: ${cacheKey}`);
    return cached.data;
  }

  private setCachedData<T>(cacheKey: string, data: T, ttl: number): void {
    if (!this.enableCache) return;

    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });
    console.log(`💾 Data cached with key: ${cacheKey}`);
  }

  public clearCache(): void {
    this.cache.clear();
    console.log("🗑️ Cache cleared");
  }

  public clearCacheByPattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const [key] of this.cache) {
      if (regex.test(atob(key))) {
        this.cache.delete(key);
      }
    }
    console.log(`🗑️ Cache cleared for pattern: ${pattern}`);
  }

  // Generic request method
  private async request<TResponse = any, TRequest = any>(
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

  public async get<TResponse = any>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>("GET", url, undefined, options);
  }

  public async post<TResponse = any, TRequest = any>(
    url: string,
    data?: TRequest,
    options: RequestOptions = {}
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TRequest>("POST", url, data, options);
  }

  public async put<TResponse = any, TRequest = any>(
    url: string,
    data?: TRequest,
    options: RequestOptions = {}
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TRequest>("PUT", url, data, options);
  }

  public async patch<TResponse = any, TRequest = any>(
    url: string,
    data?: TRequest,
    options: RequestOptions = {}
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TRequest>("PATCH", url, data, options);
  }

  public async delete<TResponse = any>(
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
