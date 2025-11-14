import { apiClient } from './api';

export interface CustomBlock {
  id: number;
  name: string;
  block_id: string;
  category: string;
  description?: string;
  preview?: string;
  content: string;
  label?: string;
  media?: string;
  is_active: boolean;
  order: number;
  attributes?: Record<string, any>;
  traits?: Array<any>;
  component_type?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomBlockList {
  id: number;
  name: string;
  block_id: string;
  category: string;
  description?: string;
  preview?: string;
  is_active: boolean;
  order: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export async function getBlocks(category?: string, isActive?: boolean): Promise<CustomBlockList[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (isActive !== undefined) params.append('is_active', String(isActive));
  
  const query = params.toString();
  const url = query ? `/blocks/?${query}` : '/blocks/';
  const result = await apiClient.get<any>(url);
  
  // Обрабатываем случай, когда API возвращает объект с пагинацией
  if (result && typeof result === 'object') {
    // Если есть поле results (пагинация), используем его
    if (Array.isArray(result.results)) {
      return result.results;
    }
    // Если это массив напрямую
    if (Array.isArray(result)) {
      return result;
    }
  }
  
  // Если результат не массив, возвращаем пустой массив
  return [];
}

export async function getBlock(id: number): Promise<CustomBlock> {
  return apiClient.get<CustomBlock>(`/blocks/${id}/`);
}

export async function createBlock(block: Omit<CustomBlock, 'id' | 'created_by' | 'created_at' | 'updated_at'>): Promise<CustomBlock> {
  return apiClient.post<CustomBlock>('/blocks/', block);
}

export async function updateBlock(id: number, block: Partial<CustomBlock>): Promise<CustomBlock> {
  return apiClient.patch<CustomBlock>(`/blocks/${id}/`, block);
}

export async function deleteBlock(id: number): Promise<void> {
  return apiClient.delete<void>(`/blocks/${id}/`);
}

