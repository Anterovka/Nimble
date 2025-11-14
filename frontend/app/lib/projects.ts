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

export async function getUserProjects(): Promise<ProjectListItem[]> {
  return apiClient.get<ProjectListItem[]>('/projects/');
}

export async function getProject(id: number): Promise<Project> {
  return apiClient.get<Project>(`/projects/${id}/`);
}

export async function createProject(data: CreateProjectData): Promise<Project> {
  return apiClient.post<Project>('/projects/', data);
}

export async function updateProject(id: number, data: UpdateProjectData): Promise<Project> {
  return apiClient.patch<Project>(`/projects/${id}/`, data);
}

export async function patchProject(id: number, data: UpdateProjectData): Promise<Project> {
  return apiClient.patch<Project>(`/projects/${id}/`, data);
}

export async function deleteProject(id: number): Promise<void> {
  return apiClient.delete<void>(`/projects/${id}/`);
}

export async function duplicateProject(id: number): Promise<Project> {
  return apiClient.post<Project>(`/projects/${id}/duplicate/`);
}

export async function publishProject(id: number): Promise<Project> {
  return apiClient.post<Project>(`/projects/${id}/publish/`);
}

export async function unpublishProject(id: number): Promise<Project> {
  return apiClient.post<Project>(`/projects/${id}/unpublish/`);
}

export async function getPublishedProjects(): Promise<ProjectListItem[]> {
  return apiClient.get<ProjectListItem[]>('/projects/published/');
}
