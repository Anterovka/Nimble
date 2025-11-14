"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { TEMPLATES } from "@/app/data/templates";
import type { Template } from "@/app/data/templateTypes";
import { StaticStarField } from "@/app/components/StaticStarField";
import { AppHeader } from "@/app/components/AppHeader";

export default function TemplatesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const cardIframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());

  const categories = ["Все", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

  const filteredTemplates =
    selectedCategory === "Все"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = (template: Template) => {
    if (!isAuthenticated) {
      router.push("/?auth=login");
      return;
    }

    // Сохраняем шаблон в localStorage для загрузки в редакторе
    localStorage.setItem("nimble-template", JSON.stringify(template));
    router.push("/editor?template=" + template.id);
  };

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
  };

  const closePreview = () => {
    setPreviewTemplate(null);
  };

  // Загрузка HTML в iframe для предпросмотра в модальном окне
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

  // Обработка Escape для закрытия модального окна
  useEffect(() => {
    if (!previewTemplate) return;

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
  }, [previewTemplate]);

  // Загрузка HTML в iframe для карточек шаблонов
  const loadCardPreview = (template: Template, iframe: HTMLIFrameElement | null) => {
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
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#050505] to-[#000000] text-white relative">
      <StaticStarField starCount={120} />
      <AppHeader />

      <div className="container mx-auto px-4 py-8 max-w-7xl pt-24 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Готовые шаблоны</h1>
          <p className="text-white/60">Выберите шаблон или создайте страницу с нуля</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-white text-black"
                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-colors flex flex-col"
            >
              {/* Preview iframe */}
              <div className="relative w-full h-48 bg-white/5 border-b border-white/10 overflow-hidden">
                <iframe
                  ref={(el) => {
                    if (el) {
                      cardIframeRefs.current.set(template.id, el);
                      loadCardPreview(template, el);
                    } else {
                      cardIframeRefs.current.delete(template.id);
                    }
                  }}
                  className="w-full h-full border-0 pointer-events-none"
                  style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
                  title={`Preview ${template.name}`}
                />
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                <p className="text-white/60 text-sm mb-4">{template.description}</p>
                <div className="flex items-center justify-between gap-2 mt-auto">
                  <span className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded">
                    {template.category}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePreview(template)}
                      className="px-3 py-2 border border-white/20 text-white rounded-lg text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors"
                    >
                      Превью
                    </button>
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors"
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
                  handleUseTemplate(previewTemplate);
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

