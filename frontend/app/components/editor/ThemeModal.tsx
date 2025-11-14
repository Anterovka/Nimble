"use client";

import { useEffect, useRef } from "react";
import type { Editor } from "grapesjs";
import { ThemePanel } from "./ThemePanel";

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
}

export function ThemeModal({ isOpen, onClose, editor }: ThemeModalProps) {
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
    <div className="editor-theme-modal" role="dialog" aria-modal="true">
      <div className="editor-theme-modal__backdrop" aria-hidden="true" onClick={onClose} />
      <div className="editor-theme-modal__content" ref={contentRef} role="document">
        <header className="editor-theme-modal__header">
          <div className="editor-theme-modal__header-copy">
            <h2>Темы проекта</h2>
            <p>Выберите готовую тему для всего проекта</p>
          </div>
          <button
            type="button"
            className="editor-theme-modal__close"
            onClick={onClose}
            aria-label="Закрыть модальное окно тем"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>
        <div className="editor-theme-modal__body">
          {editor ? (
            <ThemePanel editor={editor} />
          ) : (
            <div className="editor-theme-modal__empty">
              <p>Выберите элемент в конструкторе, чтобы применить тему.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


