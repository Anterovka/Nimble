"use client";

import { useEffect, useRef, useState, startTransition } from "react";
import { formatHTML, formatCSS } from "@/app/utils/editor/formatUtils";
import JSZip from "jszip";
import type { Editor } from "grapesjs";
import type { HeaderSettings, FooterSettings } from "@/app/utils/editor/headerFooter";

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  headerSettings: HeaderSettings;
  footerSettings: FooterSettings;
}

export function ExportPreviewModal({
  isOpen,
  onClose,
  editor,
  headerSettings,
  footerSettings,
}: ExportPreviewModalProps) {
  const [css, setCss] = useState<string>("");
  const [fullHtml, setFullHtml] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  const modalContentRef = useRef<HTMLDivElement>(null);
  const htmlContainerRef = useRef<HTMLDivElement>(null);
  const cssContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !editor) return;

    const rawHtml = editor.getHtml?.() ?? "";
    const rawCss = editor.getCss?.() ?? "";

    const formattedHtml = formatHTML(rawHtml);
    const formattedCss = formatCSS(rawCss);

    const fullHtmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Экспортированная страница</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${formattedHtml.split('\n').map(line => '  ' + line).join('\n')}
</body>
</html>`;

    startTransition(() => {
      setCss(formattedCss);
      setFullHtml(fullHtmlContent);
    });

  }, [isOpen, editor, headerSettings, footerSettings]);

  useEffect(() => {
    const htmlContainer = htmlContainerRef.current;
    const cssContainer = cssContainerRef.current;

    const handleWheel = (e: WheelEvent) => {
      const target = e.currentTarget as HTMLElement;
      target.scrollTop += e.deltaY;
      e.preventDefault();
      e.stopPropagation();
    };

    if (htmlContainer) {
      htmlContainer.addEventListener('wheel', handleWheel, { passive: false });
    }
    if (cssContainer) {
      cssContainer.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (htmlContainer) htmlContainer.removeEventListener('wheel', handleWheel);
      if (cssContainer) cssContainer.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen, activeTab]);


  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    downloadBlob(blob, filename);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    downloadFile(fullHtml, "index.html", "text/html;charset=utf-8");
  };

  const handleDownloadCSS = () => {
    downloadFile(css, "styles.css", "text/css;charset=utf-8");
  };

  const handleDownloadArchive = async () => {
    const zip = new JSZip();
    zip.file("index.html", fullHtml);
    zip.file("styles.css", css);
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "export.zip");
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!modalContentRef.current) return;
      if (!modalContentRef.current.contains(event.target as Node)) {
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

  if (!isOpen) return null;

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
        ref={modalContentRef}
        className="editor-theme-modal__content"
        role="document"
        style={{ width: "min(1200px, 96vw)", maxHeight: "min(90vh, 880px)" }}
      >
        <header className="editor-theme-modal__header">
          <div className="editor-theme-modal__header-copy">
            <h2>Экспорт проекта</h2>
            <p>Скачайте HTML и CSS код вашего проекта</p>
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
        <div className="editor-theme-modal__body" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Вкладки */}
          <div className="flex gap-1 sm:gap-2 mb-4 border-b border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab("html")}
              className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === "html"
                  ? "text-white border-b-2 border-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              HTML
            </button>
            <button
              onClick={() => setActiveTab("css")}
              className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                activeTab === "css"
                  ? "text-white border-b-2 border-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              CSS
            </button>
          </div>

          {/* Контент вкладок - прокручиваемая область */}
          <div className="flex-1 flex flex-col min-h-0 mb-4 overflow-hidden">
            {activeTab === "html" && (
              <div 
                ref={htmlContainerRef}
                className="flex-1 border border-white/10 rounded-lg bg-[#050505] overflow-auto no-scrollbar"
                style={{ minHeight: 0 }}
              >
                <pre className="text-xs sm:text-sm text-white/80 font-mono whitespace-pre p-2 sm:p-4 min-w-max">
                  {fullHtml}
                </pre>
              </div>
            )}

            {activeTab === "css" && (
              <div 
                ref={cssContainerRef}
                className="flex-1 border border-white/10 rounded-lg bg-[#050505] overflow-auto no-scrollbar"
                style={{ minHeight: 0 }}
              >
                <pre className="text-xs sm:text-sm text-white/80 font-mono whitespace-pre p-2 sm:p-4" style={{ minWidth: 'max-content' }}>
                  {css}
                </pre>
              </div>
            )}
          </div>

          {/* Кнопки - всегда видны */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-white/10 shrink-0">
            <button
              onClick={handleDownloadArchive}
              className="flex-1 px-3 sm:px-4 py-2 bg-white text-black rounded-lg text-xs sm:text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              <span className="hidden sm:inline">Скачать ZIP (HTML + CSS)</span>
              <span className="sm:hidden">ZIP</span>
            </button>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleDownloadHTML}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-white/20 text-white rounded-lg text-xs sm:text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                <span className="hidden sm:inline">Скачать HTML</span>
                <span className="sm:hidden">HTML</span>
              </button>
              <button
                onClick={handleDownloadCSS}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-white/20 text-white rounded-lg text-xs sm:text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                <span className="hidden sm:inline">Скачать CSS</span>
                <span className="sm:hidden">CSS</span>
              </button>
              <button
                onClick={onClose}
                className="px-3 sm:px-4 py-2 border border-white/20 text-white rounded-lg text-xs sm:text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

