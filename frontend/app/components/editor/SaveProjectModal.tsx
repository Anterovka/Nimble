"use client";

import { useEffect, useRef, useState } from "react";

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; slug: string; description?: string }) => Promise<void>;
  initialTitle?: string;
  initialSlug?: string;
  initialDescription?: string;
  isSaving?: boolean;
}

export function SaveProjectModal({
  isOpen,
  onClose,
  onSave,
  initialTitle = "",
  initialSlug = "",
  initialDescription = "",
  isSaving = false,
}: SaveProjectModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [description, setDescription] = useState(initialDescription);
  const [errors, setErrors] = useState<{ title?: string; slug?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setSlug(initialSlug);
      setDescription(initialDescription);
      setErrors({});
    }
  }, [isOpen, initialTitle, initialSlug, initialDescription]);

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

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
    if (errors.title) {
      setErrors({ ...errors, title: undefined });
    }
  };

  const handleSlugChange = (value: string) => {
    const newSlug = generateSlug(value);
    setSlug(newSlug);
    if (errors.slug) {
      setErrors({ ...errors, slug: undefined });
    }
  };

  const validate = () => {
    const newErrors: { title?: string; slug?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Название проекта обязательно";
    }
    if (!slug.trim()) {
      newErrors.slug = "URL-адрес обязателен";
    } else if (!/^[a-z0-9-]+$/.test(slug)) {
      newErrors.slug = "URL-адрес может содержать только строчные буквы, цифры и дефисы";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await onSave({
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Ошибка сохранения проекта", error);
    }
  };

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
        ref={contentRef}
        className="editor-theme-modal__content"
        role="document"
        style={{ width: "min(600px, 96vw)", maxHeight: "min(90vh, 880px)" }}
      >
        <header className="editor-theme-modal__header">
          <div className="editor-theme-modal__header-copy">
            <h2>Сохранить проект</h2>
            <p>Введите название и URL-адрес для вашего проекта</p>
          </div>
          <button
            type="button"
            className="editor-theme-modal__close"
            onClick={onClose}
            aria-label="Закрыть модальное окно"
            disabled={isSaving}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>
        <div className="editor-theme-modal__body">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Название проекта *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
                placeholder="Мой проект"
                disabled={isSaving}
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                URL-адрес (slug) *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
                placeholder="my-project"
                disabled={isSaving}
                required
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-400">{errors.slug}</p>
              )}
              <p className="mt-1 text-xs text-white/50">
                URL-адрес будет использоваться для доступа к проекту
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Описание (необязательно)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors resize-none"
                placeholder="Краткое описание проекта..."
                rows={3}
                disabled={isSaving}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm font-semibold hover:border-white/40 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}



