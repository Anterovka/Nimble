// Модальное окно выбора цветовой палитры проекта
"use client";

import { useEffect, useRef } from "react";
import type { Editor } from "grapesjs";
import { ThemePanel } from "./ThemePanel";

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  projectId?: number | null;
}

export function ThemeModal({ isOpen, onClose, editor, projectId }: ThemeModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="theme-modal-overlay">
      <div className="theme-modal-backdrop" onClick={onClose} />
      <div className="theme-modal-container" ref={contentRef}>
        <div className="theme-modal-header">
          <div className="theme-modal-title-group">
            <h2 className="theme-modal-title">Палитры проекта</h2>
            <p className="theme-modal-subtitle">Выберите цветовую схему для всего проекта</p>
          </div>
          <button
            type="button"
            className="theme-modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="theme-modal-content">
          {editor ? (
            <ThemePanel editor={editor} projectId={projectId} onClose={onClose} />
          ) : (
            <div className="theme-modal-empty">
              <p>Редактор не загружен</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
