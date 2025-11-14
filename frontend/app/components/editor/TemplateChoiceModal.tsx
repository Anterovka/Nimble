"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES } from "@/app/data/templates";
import type { Template } from "@/app/data/templateTypes";

interface TemplateChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChooseBlank: () => void;
}

export function TemplateChoiceModal({
  isOpen,
  onClose,
  onChooseBlank,
}: TemplateChoiceModalProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const cardIframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());
  const loadedIframesRef = useRef<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!contentRef.current) return;
      if (!contentRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  // Прокрутка колесиком мыши для body модального окна
  useEffect(() => {
    if (!isOpen || !modalBodyRef.current) return;

    const modalBody = modalBodyRef.current;

    const handleWheel = (e: WheelEvent) => {
      const target = modalBody;
      const canScroll = target.scrollHeight > target.clientHeight;
      
      if (canScroll) {
        target.scrollTop += e.deltaY / 2;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    modalBody.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      modalBody.removeEventListener('wheel', handleWheel, { capture: true } as EventListenerOptions);
    };
  }, [isOpen]);

  const handleTemplateSelect = (template: Template) => {
    // Сохраняем шаблон в localStorage для загрузки в редакторе
    localStorage.setItem("nimble-template", JSON.stringify(template));
    router.push("/editor?template=" + template.id);
    onClose();
  };

  const handleBlankProject = () => {
    onChooseBlank();
    onClose();
  };

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  // Оптимизированная загрузка HTML в iframe для карточек
  const loadCardPreview = useCallback((template: Template, iframe: HTMLIFrameElement | null) => {
    if (!iframe || loadedIframesRef.current.has(template.id)) return;
    
    // Используем requestIdleCallback для отложенной загрузки
    const loadContent = () => {
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.name}</title>
  <style>${template.css}</style>
</head>
<body>
${template.html}
</body>
</html>`;
        doc.open();
        doc.write(fullHtml);
        doc.close();
        loadedIframesRef.current.add(template.id);
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadContent, { timeout: 2000 });
    } else {
      setTimeout(loadContent, 100);
    }
  }, []);

  // Загрузка HTML в iframe для полноэкранного предпросмотра
  useEffect(() => {
    if (!previewTemplate || !previewIframeRef.current) return;

    const iframe = previewIframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${previewTemplate.name}</title>
  <style>${previewTemplate.css}</style>
</head>
<body>
${previewTemplate.html}
</body>
</html>`;
      doc.open();
      doc.write(fullHtml);
      doc.close();
    }
  }, [previewTemplate]);

  // Обработка Escape для закрытия модального окна предпросмотра
  useEffect(() => {
    if (!previewTemplate) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePreview();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewTemplate]);

  // Intersection Observer для ленивой загрузки iframe
  useEffect(() => {
    if (!isOpen) {
      // Очищаем загруженные iframe при закрытии модального окна
      loadedIframesRef.current.clear();
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    // Фильтруем шаблон "пустой белый" для observer
    const availableTemplates = TEMPLATES.filter(t => t.id !== 'blank-white');

    // Создаем observer для загрузки только видимых iframe
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframe = entry.target as HTMLIFrameElement;
            const templateId = iframe.dataset.templateId;
            if (templateId) {
              const template = availableTemplates.find((t) => t.id === templateId);
              if (template) {
                loadCardPreview(template, iframe);
                observerRef.current?.unobserve(iframe);
              }
            }
          }
        });
      },
      {
        root: contentRef.current,
        rootMargin: "50px", // Начинаем загрузку за 50px до появления в viewport
        threshold: 0.1,
      }
    );

    // Наблюдаем за iframe после небольшой задержки, чтобы они успели отрендериться
    const timeoutId = setTimeout(() => {
      const iframes = Array.from(document.querySelectorAll('[data-template-id]'));
      iframes.forEach((iframe) => {
        if (observerRef.current) {
          observerRef.current.observe(iframe);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [isOpen, loadCardPreview]);

  if (!isOpen) return null;

  // Фильтруем шаблон "пустой белый", так как есть кнопка сверху
  const availableTemplates = TEMPLATES.filter(t => t.id !== 'blank-white');

  return (
    <div className="editor-theme-modal" role="dialog" aria-modal="true">
      <div
        className="editor-theme-modal__backdrop"
        aria-hidden="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      />
      <div
        ref={contentRef}
        className="editor-theme-modal__content"
        role="document"
        style={{ width: "min(1000px, 96vw)", maxHeight: "min(90vh, 880px)" }}
      >
        <header className="editor-theme-modal__header">
          <div className="editor-theme-modal__header-copy">
            <h2>Создать новый проект</h2>
            <p>Выберите шаблон или начните с пустой страницы</p>
          </div>
          <button
            type="button"
            className="editor-theme-modal__close"
            onClick={onClose}
            aria-label="Закрыть модальное окно"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>
        <div ref={modalBodyRef} className="editor-theme-modal__body">
          <div className="space-y-6">
            {/* Кнопка пустого проекта */}
            <div className="mb-6">
              <button
                onClick={handleBlankProject}
                className="w-full px-6 py-4 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <line x1="12" y1="3" x2="12" y2="21" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-lg">Пустой проект</div>
                    <div className="text-sm opacity-70">Начните с чистого листа</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Шаблоны */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Готовые шаблоны</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 transition-colors"
                  >
                    {/* Preview iframe */}
                    <div className="relative w-full h-40 bg-white/5 border-b border-white/10 overflow-hidden">
                      <iframe
                        ref={(el) => {
                          if (el) {
                            cardIframeRefs.current.set(template.id, el);
                            el.dataset.templateId = template.id;
                            // Добавляем в observer после небольшой задержки
                            setTimeout(() => {
                              if (observerRef.current && el.dataset.templateId) {
                                observerRef.current.observe(el);
                              }
                            }, 50);
                          } else {
                            cardIframeRefs.current.delete(template.id);
                          }
                        }}
                        className="w-full h-full border-0 pointer-events-none"
                        style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
                        title={`Preview ${template.name}`}
                        loading="lazy"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreview(template);
                        }}
                        className="absolute inset-0 w-full h-full bg-black/40 hover:bg-black/20 transition-colors flex items-center justify-center group cursor-pointer"
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <div className="font-semibold text-white mb-1">{template.name}</div>
                      <div className="text-sm text-white/60 line-clamp-2 mb-3">{template.description}</div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded">
                          {template.category}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreview(template);
                            }}
                            className="px-3 py-1.5 border border-white/20 text-white rounded-lg text-xs font-semibold hover:border-white/40 hover:bg-white/5 transition-colors"
                          >
                            Превью
                          </button>
                          <button
                            onClick={() => handleTemplateSelect(template)}
                            className="px-3 py-1.5 bg-white text-black rounded-lg text-xs font-semibold hover:bg-white/90 transition-colors"
                          >
                            Использовать
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
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
                <h2 className="text-2xl font-bold text-white mb-1">{previewTemplate.name}</h2>
                <p className="text-white/60 text-sm">{previewTemplate.description}</p>
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
                title={`Full preview ${previewTemplate.name}`}
              />
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={closePreview}
                className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={() => {
                  closePreview();
                  handleTemplateSelect(previewTemplate);
                }}
                className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Использовать шаблон
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

