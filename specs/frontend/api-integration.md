# Phase 2: API Integration Specification

**Status**: READY  
**Client Library**: Axios  
**Interceptors**: Request/Response  
**Token Management**: Automatic refresh  

---

## 1. Overview

### Frontend ↔ Backend Communication

```
Frontend (Next.js)
    ↓
API Client (Axios)
    ↓
Request Interceptor (Inject token)
    ↓
FastAPI Backend
    ↓
Response Interceptor (Handle 401)
    ↓
Token Refresh if needed
    ↓
Return to Frontend
```

---

## 2. Axios Configuration

### API Client Setup

**File**: `frontend/services/api-client.ts`

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { getStoredTokens, setStoredTokens, clearStoredTokens } from './storage-service';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,  // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
```

### Environment Configuration

**File**: `.env.local` (development)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_LOG_LEVEL=debug
```

**File**: `.env.production` (production)

```env
NEXT_PUBLIC_API_URL=https://api.evolution-todo.com
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_LOG_LEVEL=info
```

---

## 3. Request Interceptor

### Authentication Header Injection

**Responsibility**: Add bearer token to every request

```typescript
// apiClient.interceptors.request.use()
apiClient.interceptors.request.use(
  (config) => {
    // Get token from storage
    const { accessToken } = getStoredTokens();
    
    // Add authorization header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Log request (development only)
    if (process.env.NEXT_PUBLIC_ENV === 'development') {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Request Logging

```typescript
// Log all requests with sanitization
const logRequest = (config: AxiosRequestConfig) => {
  const safeConfig = {
    ...config,
    headers: {
      ...config.headers,
      Authorization: config.headers?.Authorization ? '[REDACTED]' : undefined,
    },
  };
  console.log('[Request]', safeConfig);
};
```

---

## 4. Response Interceptor

### Error Handling & Token Refresh

**Responsibility**: Handle errors and refresh expired tokens

```typescript
// apiClient.interceptors.response.use()
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Success response - return as-is
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    
    // Handle 401 Unauthorized (Token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          });
      }
      
      // Start refresh
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Try to refresh token
        const { accessToken } = await refreshAccessToken();
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Process queued requests
        processQueue(null, accessToken);
        
        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        processQueue(refreshError, null);
        clearStoredTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);
```

---

## 5. Token Management

### Token Storage

**File**: `frontend/services/storage-service.ts`

```typescript
interface StoredTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export const getStoredTokens = (): StoredTokens => {
  if (typeof window === 'undefined') {
    return { accessToken: null, refreshToken: null };
  }
  
  return {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
  };
};

export const setStoredTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
};

export const clearStoredTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

export const isTokenExpired = (): boolean => {
  const token = getStoredTokens().accessToken;
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
```

### Token Refresh Function

```typescript
export const refreshAccessToken = async (): Promise<StoredTokens> => {
  const { refreshToken } = getStoredTokens();
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  try {
    const response = await apiClient.post('/api/v1/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    const { access_token, expires_in } = response.data;
    
    // Update stored tokens
    setStoredTokens(access_token, refreshToken);
    
    return {
      accessToken: access_token,
      refreshToken: refreshToken,
    };
  } catch (error) {
    clearStoredTokens();
    throw error;
  }
};
```

---

## 6. Custom API Hooks

### useApi Hook

**File**: `frontend/hooks/useApi.ts`

```typescript
import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  error: AxiosError | null;
  loading: boolean;
}

export function useApi<T>(
  callback: () => Promise<T>,
  immediate = true
): UseApiState<T> & {
  execute: () => Promise<T>;
  setData: (data: T) => void;
} {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    loading: immediate,
  });
  
  const execute = useCallback(async () => {
    setState({ data: null, error: null, loading: true });
    try {
      const data = await callback();
      setState({ data, error: null, loading: false });
      return data;
    } catch (error) {
      setState({ data: null, error: error as AxiosError, loading: false });
      throw error;
    }
  }, [callback]);
  
  React.useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);
  
  return {
    ...state,
    execute,
    setData: (data: T) => setState(prev => ({ ...prev, data })),
  };
}
```

### Usage Example

```typescript
const { data: tasks, loading, error, execute: refetchTasks } = useApi(
  () => fetchTasks({ status: 'pending' }),
  true  // Fetch immediately on mount
);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorAlert error={error} />;
return <TaskList tasks={tasks} />;
```

---

## 7. API Service Functions

### Authentication Service

**File**: `frontend/services/auth-service.ts`

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post('/api/v1/auth/login', data);
    const { session, user } = response.data;
    
    setStoredTokens(session.access_token, session.refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { session, user };
  },
  
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post('/api/v1/auth/register', data);
    const { session, user } = response.data;
    
    setStoredTokens(session.access_token, session.refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { session, user };
  },
  
  logout: async () => {
    try {
      await apiClient.post('/api/v1/auth/logout');
    } finally {
      clearStoredTokens();
      window.location.href = '/login';
    }
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data.user;
  },
};
```

### Task Service

**File**: `frontend/services/task-service.ts`

```typescript
interface TaskFilters {
  status?: 'pending' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  due_from?: string;
  due_to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface CreateTaskData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  due_date?: string;
}

export const taskService = {
  list: async (filters?: TaskFilters) => {
    const response = await apiClient.get('/api/v1/tasks', { params: filters });
    return response.data;
  },
  
  get: async (id: string) => {
    const response = await apiClient.get(`/api/v1/tasks/${id}`);
    return response.data.task;
  },
  
  create: async (data: CreateTaskData) => {
    const response = await apiClient.post('/api/v1/tasks', data);
    return response.data.task;
  },
  
  update: async (id: string, data: Partial<CreateTaskData>) => {
    const response = await apiClient.patch(`/api/v1/tasks/${id}`, data);
    return response.data.task;
  },
  
  delete: async (id: string) => {
    await apiClient.delete(`/api/v1/tasks/${id}`);
  },
  
  complete: async (id: string) => {
    const response = await apiClient.patch(`/api/v1/tasks/${id}`, {
      completed: true,
    });
    return response.data.task;
  },
  
  export: async (format: 'csv' | 'json') => {
    const response = await apiClient.get(`/api/v1/tasks/export/${format}`, {
      responseType: format === 'csv' ? 'text' : 'json',
    });
    return response.data;
  },
};
```

---

## 8. Error Handling

### Error Types

```typescript
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
  }
}
```

### Error Transformation

```typescript
const handleApiError = (error: AxiosError): ApiError => {
  if (error.code === 'ECONNABORTED') {
    return new TimeoutError('Request timed out');
  }
  
  if (!error.response) {
    return new NetworkError('No network connection');
  }
  
  const { status, data }: any = error.response;
  
  return new ApiError(
    status,
    data?.error?.code || 'unknown_error',
    data?.error?.message || 'An error occurred',
    data?.error?.details
  );
};

// Usage in components
try {
  await loginUser(email, password);
} catch (error) {
  const apiError = handleApiError(error as AxiosError);
  showToast(apiError.message, 'error');
}
```

---

## 9. Request/Response Types

### Request Types

```typescript
// frontend/types/api.ts

export interface ApiRequest<T> {
  data: T;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### Response Types

```typescript
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
}
```

---

## 10. Retry Logic

### Automatic Retry

```typescript
// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  backoffMultiplier: 2,
  initialDelay: 1000,  // 1 second
};

// Implement exponential backoff
const retryRequest = async (
  fn: () => Promise<any>,
  retries = RETRY_CONFIG.maxRetries,
  delay = RETRY_CONFIG.initialDelay
): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    // Only retry on network errors or 5xx errors
    if (
      error instanceof NetworkError ||
      (error instanceof ApiError && error.status >= 500)
    ) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(
        fn,
        retries - 1,
        delay * RETRY_CONFIG.backoffMultiplier
      );
    }
    
    throw error;
  }
};

// Usage
const response = await retryRequest(() => apiClient.get('/api/v1/tasks'));
```

---

## 11. Request Cancellation

### Abort Controller

```typescript
const taskAbortController = new AbortController();

export const cancelTaskRequests = () => {
  taskAbortController.abort();
};

// In useEffect
useEffect(() => {
  const controller = new AbortController();
  
  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/api/v1/tasks', {
        signal: controller.signal,
      });
      setTasks(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled');
      }
    }
  };
  
  fetchTasks();
  
  return () => controller.abort();
}, []);
```

---

## 12. Caching Strategy

### Response Caching

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;  // Time to live in milliseconds
}

class ResponseCache {
  private cache = new Map<string, CacheEntry<any>>();
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  set<T>(key: string, data: T, ttl: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }
  
  clear() {
    this.cache.clear();
  }
}

const cache = new ResponseCache();

// Add to request interceptor
apiClient.interceptors.request.use((config) => {
  const cached = cache.get(config.url);
  if (cached) {
    return { ...config, adapter: () => Promise.resolve({ data: cached }) };
  }
  return config;
});

// Add to response interceptor
apiClient.interceptors.response.use((response) => {
  // Cache GET requests for 5 minutes
  if (response.config.method === 'get') {
    cache.set(response.config.url, response.data, 5 * 60 * 1000);
  }
  return response;
});
```

---

## 13. Debugging & Logging

### Request/Response Logging

```typescript
// Log all requests/responses in development
if (process.env.NEXT_PUBLIC_ENV === 'development') {
  apiClient.interceptors.request.use((config) => {
    console.log(`[${config.method?.toUpperCase()}] ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });
    return config;
  });
  
  apiClient.interceptors.response.use(
    (response) => {
      console.log(`[${response.status}] ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      console.error(
        `[${error.response?.status}] ${error.config?.url}`,
        error.response?.data
      );
      return Promise.reject(error);
    }
  );
}
```

### Performance Monitoring

```typescript
apiClient.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

apiClient.interceptors.response.use((response) => {
  const duration = Date.now() - (response.config.metadata?.startTime || 0);
  
  if (duration > 3000) {
    console.warn(`Slow request: ${response.config.url} took ${duration}ms`);
  }
  
  return response;
});
```

---

## 14. Testing API Integration

### Mock API Client

```typescript
// __tests__/services/api-client.test.ts
import apiClient from '@/services/api-client';

jest.mock('@/services/api-client');
const mockApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

describe('API Client', () => {
  it('should include auth token in requests', async () => {
    localStorage.setItem('access_token', 'test-token-123');
    
    mockApiClient.get.mockResolvedValue({ data: { tasks: [] } });
    
    await apiClient.get('/api/v1/tasks');
    
    expect(mockApiClient.get).toHaveBeenCalled();
    // Verify Authorization header includes token
  });
  
  it('should handle 401 and refresh token', async () => {
    mockApiClient.get.mockRejectedValueOnce({
      response: { status: 401 },
    });
    mockApiClient.post.mockResolvedValueOnce({
      data: { access_token: 'new-token' },
    });
    mockApiClient.get.mockResolvedValueOnce({
      data: { tasks: [] },
    });
    
    // Make request, should retry after refresh
  });
});
```

---

## 15. Rate Limiting

### Client-Side Rate Limiting

```typescript
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;
  
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  async checkLimit(): Promise<void> {
    const now = Date.now();
    
    // Remove old requests outside window
    this.requests = this.requests.filter(
      time => now - time < this.windowMs
    );
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      throw new Error(`Rate limited. Wait ${waitTime}ms`);
    }
    
    this.requests.push(now);
  }
}

const limiter = new RateLimiter(100, 60000);  // 100 req/min

apiClient.interceptors.request.use(async (config) => {
  await limiter.checkLimit();
  return config;
});
```
