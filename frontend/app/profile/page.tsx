"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getUserProjects, deleteProject, getProject, type ProjectListItem, type Project } from "@/app/lib/projects";
import { getSubscription, type Subscription } from "@/app/lib/subscription";
import Link from "next/link";
import { motion } from "framer-motion";
import { StaticStarField } from "@/app/components/StaticStarField";
import { AppHeader } from "@/app/components/AppHeader";

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const cardIframeRefs = useRef<Map<number, HTMLIFrameElement>>(new Map());

  const projectsArray = Array.isArray(projects) ? projects : [];
  const totalProjects = projectsArray.length;
  const publishedCount = projectsArray.filter((p) => p.is_published).length;
  const deployedCount = projectsArray.filter((p) => p.deployed_url && p.deployed_url.trim() !== '').length;
  const deployedProjects = projectsArray.filter((p) => p.deployed_url && p.deployed_url.trim() !== '');
  const recentProjects = projectsArray.slice(0, 6);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
      return;
    }

    if (isAuthenticated) {
      loadProjects();
      loadSubscription();
    }
  }, [isAuthenticated, isLoading, router]);
  
  const loadSubscription = async () => {
    try {
      const data = await getSubscription();
      setSubscription(data);
    } catch (err) {
      console.error("Ошибка загрузки подписки", err);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProjects();
      
      // Проверяем, что data - это массив
      if (Array.isArray(data)) {
        setProjects(data);
      } else if (data && typeof data === 'object' && 'results' in data) {
        // Если API возвращает объект с пагинацией
        const results = (data as { results: ProjectListItem[] }).results;
        if (Array.isArray(results)) {
          setProjects(results);
        } else {
          console.warn("results не является массивом:", results);
          setProjects([]);
        }
      } else {
        // Если это не массив и не объект с results, устанавливаем пустой массив
        console.warn("API вернул неожиданный формат данных:", data);
        setProjects([]);
      }
    } catch (err) {
      console.error("Ошибка загрузки проектов", err);
      setError("Не удалось загрузить проекты");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.")) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Ошибка удаления проекта", err);
      alert("Не удалось удалить проект");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePreview = async (projectId: number) => {
    try {
      const project = await getProject(projectId);
      setPreviewProject(project);
    } catch (error) {
      console.error("Ошибка загрузки проекта для предпросмотра", error);
      alert("Не удалось загрузить проект для предпросмотра");
    }
  };

  const closePreview = () => {
    setPreviewProject(null);
  };

  // Загрузка HTML в iframe для предпросмотра в модальном окне
  useEffect(() => {
    if (!previewProject || !previewIframeRef.current) return;

    const iframe = previewIframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${previewProject.title}</title>
  <style>${previewProject.css_content || ''}</style>
</head>
<body>
${previewProject.html_content || ''}
</body>
</html>`;
      doc.open();
      doc.write(fullHtml);
      doc.close();
    }
  }, [previewProject]);

  // Обработка Escape для закрытия модального окна
  useEffect(() => {
    if (!previewProject) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePreview();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [previewProject]);

  // Загрузка HTML в iframe для карточек проектов
  const loadCardPreview = async (projectId: number, iframe: HTMLIFrameElement | null) => {
    if (!iframe) return;
    
    try {
      const project = await getProject(projectId);
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.title}</title>
  <style>${project.css_content || ''}</style>
</head>
<body>
${project.html_content || ''}
</body>
</html>`;
        doc.open();
        doc.write(fullHtml);
        doc.close();
      }
    } catch (error) {
      console.error("Ошибка загрузки предпросмотра проекта", error);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#050505] to-[#000000] flex items-center justify-center">
        <div className="text-white text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#050505] to-[#000000] text-white relative">
      <StaticStarField starCount={120} />
      <AppHeader />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-12 pt-24 pb-24 relative z-10">
        <div className="md:grid md:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-6 mb-8 md:mb-0">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-linear-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 text-2xl font-bold">
                  {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {user?.username || user?.email || "Пользователь"}
                  </h2>
                  <p className="text-white/60 text-sm">
                    {user?.email && user?.email !== user?.username ? user.email : ""}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1 md:gap-4 md:text-right">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">{totalProjects}</div>
                  <div className="text-white/60 text-sm">Проектов</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">{deployedCount}</div>
                  <div className="text-white/80 text-sm font-medium">Развернуты на сервере</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-lg font-bold text-white mb-1">
                    {subscription?.subscription_type === 'premium' ? 'Премиум' : 'Бесплатная'}
                  </div>
                  {subscription && (
                    <div className="text-white/40 text-xs mt-2">
                      {subscription.current_project_count} / {subscription.project_limit === -1 ? '∞' : subscription.project_limit} проектов
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white">Быстрые действия</h3>
              <div className="mt-4 space-y-3">
                <Link
                  href="/editor"
                  className="block w-full px-4 py-2.5 bg-white text-black rounded-lg font-semibold text-sm text-center hover:bg-white/90 transition-colors"
                >
                  Создать новый проект
                </Link>
                <Link
                  href="/templates"
                  className="block w-full px-4 py-2.5 border border-white/20 text-white rounded-lg font-semibold text-sm text-center hover:border-white/40 hover:bg-white/5 transition-colors"
                >
                  Готовые шаблоны
                </Link>
                <Link
                  href="/subscription"
                  className="block w-full px-4 py-2.5 border border-white/20 text-white rounded-lg font-semibold text-sm text-center hover:border-white/40 hover:bg-white/5 transition-colors"
                >
                  Подписка
                </Link>
              </div>
            </div>

            
          </aside>

          <div className="space-y-6">
            {/* Список развернутых сайтов */}
            {deployedProjects.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Развернутые сайты</h2>
                    <p className="text-white/60 text-sm">Сайты, развернутые на серверах</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {deployedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                            <span className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded text-green-300 text-xs font-medium">
                              Развернут
                            </span>
                          </div>
                          {project.description && (
                            <p className="text-white/60 text-sm mb-3 line-clamp-2">{project.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <a
                              href={project.deployed_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                <polyline points="15 3 21 3 21 9" />
                                <line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                              <span className="break-all">{project.deployed_url}</span>
                            </a>
                            {project.deployed_at && (
                              <div className="flex items-center gap-2 text-white/50">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>
                                  {new Date(project.deployed_at).toLocaleDateString('ru-RU', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Link
                          href={`/editor?project=${project.id}`}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-medium transition-colors whitespace-nowrap"
                        >
                          Редактировать
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h1 className="text-4xl font-bold mb-2">Мои проекты</h1>
              <p className="text-white/60">Управляйте своими проектами</p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                {error}
              </div>
            )}

            {projectsArray.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-white/40"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">У вас пока нет проектов</h2>
                <p className="text-white/60 mb-6">Создайте свой первый проект или выберите готовый шаблон</p>
                <Link
                  href="/editor"
                  className="inline-block px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
                >
                  Создать проект
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectsArray.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors flex flex-col h-full"
                  >
                    {/* Preview iframe */}
                    <div className="relative w-full h-48 bg-white/5 border-b border-white/10 overflow-hidden shrink-0">
                      <iframe
                        ref={(el) => {
                          if (el) {
                            cardIframeRefs.current.set(project.id, el);
                            loadCardPreview(project.id, el);
                          } else {
                            cardIframeRefs.current.delete(project.id);
                          }
                        }}
                        className="w-full h-full border-0 pointer-events-none"
                        style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
                        title={`Preview ${project.title}`}
                      />
                      <button
                        onClick={() => handlePreview(project.id)}
                        className="absolute inset-0 w-full h-full bg-black/40 hover:bg-black/20 transition-colors flex items-center justify-center group cursor-pointer"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                      </button>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                          {project.description && (
                            <p className="text-white/60 text-sm mb-2 line-clamp-2">{project.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {project.is_published && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
                              Опубликован
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-white/60 mb-4">{formatDate(project.updated_at)}</p>

                      <div className="flex flex-wrap gap-2 sm:flex-nowrap mt-auto">
                        <Link
                          href={`/editor?project=${project.id}`}
                          className="flex-1 min-w-[140px] px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors text-center"
                        >
                          Редактировать
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          disabled={deletingId === project.id}
                          className="px-3 py-2 flex items-center justify-center border border-red-500/60 text-red-300 rounded-lg text-sm font-semibold hover:bg-red-500/15 hover:text-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                        >
                          {deletingId === project.id ? "Удаление..." : "Удалить"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={closePreview}
            aria-hidden="true"
          />
          <div
            className="relative bg-[rgba(8,10,18,0.96)] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{previewProject.title}</h2>
                {previewProject.description && (
                  <p className="text-white/60 text-sm">{previewProject.description}</p>
                )}
              </div>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Закрыть"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-white p-4">
              <iframe
                ref={previewIframeRef}
                className="w-full h-full min-h-[600px] border-0 rounded-lg"
                title={`Full preview ${previewProject.title}`}
              />
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={closePreview}
                className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                Закрыть
              </button>
              <Link
                href={`/editor?project=${previewProject.id}`}
                onClick={closePreview}
                className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Редактировать
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

