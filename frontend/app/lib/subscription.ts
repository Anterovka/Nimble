// API функции для работы с подписками
import { apiClient } from './api';

export interface Subscription {
  id: number;
  subscription_type: 'free' | 'premium';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  project_limit: number; // -1 означает неограниченно
  current_project_count: number;
  can_create_more: boolean;
}

// Получить информацию о подписке текущего пользователя
export async function getSubscription(): Promise<Subscription> {
  return apiClient.get<Subscription>('/auth/subscription/');
}

// Обновить подписку (для админов или будущей интеграции с платежами)
export async function updateSubscription(subscriptionType: 'free' | 'premium'): Promise<Subscription> {
  return apiClient.post<Subscription>('/auth/subscription/', {
    subscription_type: subscriptionType,
  });
}


