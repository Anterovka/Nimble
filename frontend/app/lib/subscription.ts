import { apiClient } from './api';

export interface Subscription {
  id: number;
  subscription_type: 'free' | 'premium';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  project_limit: number;
  current_project_count: number;
  can_create_more: boolean;
}

export async function getSubscription(): Promise<Subscription> {
  return apiClient.get<Subscription>('/auth/subscription/');
}

export async function updateSubscription(subscriptionType: 'free' | 'premium'): Promise<Subscription> {
  return apiClient.post<Subscription>('/auth/subscription/', {
    subscription_type: subscriptionType,
  });
}
