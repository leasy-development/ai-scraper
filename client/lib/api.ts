/**
 * Reliable API utility with retry logic, timeout handling, and proper error handling
 */

export interface ApiRequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  retryCondition?: (error: Error, attempt: number) => boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiTimeoutError extends Error {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'ApiTimeoutError';
  }
}

export class ApiNetworkError extends Error {
  constructor(message = 'Network error occurred') {
    super(message);
    this.name = 'ApiNetworkError';
  }
}

/**
 * Default retry condition - retry on network errors and 5xx status codes
 */
const defaultRetryCondition = (error: Error, attempt: number): boolean => {
  if (attempt >= 3) return false; // Max 3 attempts
  
  if (error instanceof ApiNetworkError) return true;
  if (error instanceof ApiTimeoutError) return true;
  if (error instanceof ApiError && error.status && error.status >= 500) return true;
  
  return false;
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
const getRetryDelay = (attempt: number, baseDelay: number): number => 
  baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;

/**
 * Make a reliable API request with timeout, retry logic, and proper error handling
 */
export async function apiRequest<T = any>(
  url: string, 
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    timeout = 15000,
    retries = 3,
    retryDelay = 1000,
    retryCondition = defaultRetryCondition,
    ...fetchOptions
  } = options;

  let lastError: Error;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle HTTP errors
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Ignore JSON parsing errors for error messages
        }
        
        const apiError = new ApiError(errorMessage, response.status, response);
        
        // Check if we should retry
        if (attempt < retries && retryCondition(apiError, attempt)) {
          lastError = apiError;
          await sleep(getRetryDelay(attempt, retryDelay));
          continue;
        }
        
        throw apiError;
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return response.text() as T;
      }
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      let apiError: Error;
      
      if (error.name === 'AbortError') {
        apiError = new ApiTimeoutError(`Request to ${url} timed out after ${timeout}ms`);
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        apiError = new ApiNetworkError(`Network error when requesting ${url}`);
      } else if (error instanceof ApiError) {
        apiError = error;
      } else {
        apiError = new Error(`Unexpected error: ${error.message}`);
      }
      
      // Check if we should retry
      if (attempt < retries && retryCondition(apiError, attempt)) {
        lastError = apiError;
        console.warn(`API request failed (attempt ${attempt}/${retries}):`, apiError.message);
        await sleep(getRetryDelay(attempt, retryDelay));
        continue;
      }
      
      throw apiError;
    }
  }

  throw lastError!;
}

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  get: <T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiRequest<T>(url, { ...options, method: 'GET' }),
    
  post: <T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiRequest<T>(url, { ...options, method: 'DELETE' }),
    
  patch: <T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),
};

/**
 * Get auth headers for authenticated requests
 */
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Make an authenticated API request
 */
export function authRequest<T = any>(
  url: string, 
  options: ApiRequestOptions = {}
): Promise<T> {
  return apiRequest<T>(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
}
