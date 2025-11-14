const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiError {
  message: string;
  detail?: string | Record<string, string[]>;
}

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    data?: unknown
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Получаем токен из localStorage
    const accessToken = typeof window !== 'undefined' 
      ? localStorage.getItem('access_token') 
      : null;

    // Проверяем, является ли data FormData
    const isFormData = data instanceof FormData || (data && typeof data === 'object' && data.constructor?.name === 'FormData');

    const headers = new Headers();

    // Не устанавливаем Content-Type для FormData (браузер установит его автоматически с boundary)
    if (!isFormData) {
      headers.set('Content-Type', 'application/json');
    }

    if (options.headers) {
      new Headers(options.headers).forEach((value, key) => {
        // Не перезаписываем Content-Type для FormData
        if (!(isFormData && key.toLowerCase() === 'content-type')) {
          headers.set(key, value);
        }
      });
    }

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // Подготавливаем body
    let body: BodyInit | undefined;
    if (data) {
      if (isFormData) {
        body = data as FormData;
      } else {
        body = JSON.stringify(data);
      }
    } else if (options.body) {
      body = options.body;
    }

    try {
      const response = await fetch(url, {
        ...options,
        method: options.method || 'GET',
        headers,
        body,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error: ApiError = {
          message: typeof data.detail === 'string' ? data.detail : data.message || 'Произошла ошибка',
          detail: data,
        };
        // Добавляем поля ошибки валидации (например, slug) в объект ошибки
        if (data && typeof data === 'object') {
          Object.assign(error, data);
        }
        throw error;
      }

      return data;
    } catch (error) {
      if (error instanceof Error && 'message' in error) {
        throw error;
      }
      throw {
        message: 'Ошибка сети. Проверьте подключение к интернету.',
      } as ApiError;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      ...options,
    }, data);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
    }, data);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
    }, data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

