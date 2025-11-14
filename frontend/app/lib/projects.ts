import { apiClient } from './api';

export interface Project {
  id: number;
  user: string;
  title: string;
  slug: string;
  description?: string;
  html_content: string;
  css_content: string;
  json_content: Record<string, unknown>;
  header_settings: Record<string, unknown>;
  footer_settings: Record<string, unknown>;
  is_published: boolean;
  is_public: boolean;
  views_count: number;
  deployed_url?: string;
  deployed_at?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ProjectListItem {
  id: number;
  user: string;
  title: string;
  slug: string;
  description?: string;
  is_published: boolean;
  is_public: boolean;
  views_count: number;
  deployed_url?: string;
  deployed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  title: string;
  slug: string;
  description?: string;
  html_content?: string;
  css_content?: string;
  json_content?: Record<string, unknown>;
  header_settings?: Record<string, unknown>;
  footer_settings?: Record<string, unknown>;
  is_published?: boolean;
  is_public?: boolean;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

// Получить все проекты пользователя
export async function getUserProjects(): Promise<ProjectListItem[]> {
  return apiClient.get<ProjectListItem[]>('/projects/');
}

// Получить проект по ID
export async function getProject(id: number): Promise<Project> {
  return apiClient.get<Project>(`/projects/${id}/`);
}

// Создать новый проект
export async function createProject(data: CreateProjectData): Promise<Project> {
  return apiClient.post<Project>('/projects/', data);
}

// Обновить проект
export async function updateProject(id: number, data: UpdateProjectData): Promise<Project> {
  return apiClient.patch<Project>(`/projects/${id}/`, data);
}

// Частично обновить проект
export async function patchProject(id: number, data: UpdateProjectData): Promise<Project> {
  return apiClient.patch<Project>(`/projects/${id}/`, data);
}

// Удалить проект
export async function deleteProject(id: number): Promise<void> {
  return apiClient.delete<void>(`/projects/${id}/`);
}

// Дублировать проект
export async function duplicateProject(id: number): Promise<Project> {
  return apiClient.post<Project>(`/projects/${id}/duplicate/`);
}

// Опубликовать проект
export async function publishProject(id: number): Promise<Project> {
  return apiClient.post<Project>(`/projects/${id}/publish/`);
}

// Снять проект с публикации
export async function unpublishProject(id: number): Promise<Project> {
  return apiClient.post<Project>(`/projects/${id}/unpublish/`);
}

// Получить список опубликованных проектов (галерея)
export async function getPublishedProjects(): Promise<ProjectListItem[]> {
  return apiClient.get<ProjectListItem[]>('/projects/published/');
}

