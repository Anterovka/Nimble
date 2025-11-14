"use client";

import { useCallback, useEffect, useState } from "react";
import type { Editor } from "grapesjs";
import {
  projectThemes,
  defaultThemeId,
  applyProjectTheme,
  applyProjectThemeToComponent,
  type ProjectTheme,
} from "@/app/utils/editor/themes";

interface ThemePanelProps {
  editor: Editor | null;
}

const THEME_STORAGE_KEY = "nimble-active-theme-id";

export function ThemePanel({ editor }: ThemePanelProps) {
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return stored || defaultThemeId;
    }
    return defaultThemeId;
  });

  const activeTheme = projectThemes.find((t) => t.id === activeThemeId) ?? projectThemes[0];

  // Восстанавливаем тему при монтировании
  useEffect(() => {
    if (!editor) return;
    const storedThemeId = typeof window !== "undefined" ? localStorage.getItem(THEME_STORAGE_KEY) : null;
    if (storedThemeId) {
      const theme = projectThemes.find((t) => t.id === storedThemeId);
      if (theme) {
        setActiveThemeId(storedThemeId);
        applyProjectTheme(editor, theme);
      }
    }
  }, [editor]);

  // Применяем тему при изменении и добавляем обработчик для новых компонентов
  useEffect(() => {
    if (!editor || !activeTheme) return;
    applyProjectTheme(editor, activeTheme);
    
    // Обработчик для новых компонентов
    const handleComponentAdd = (component: any) => {
      if (component && activeTheme) {
        setTimeout(() => {
          applyProjectThemeToComponent(component, activeTheme);
        }, 10);
      }
    };
    
    editor.on("component:add", handleComponentAdd);
    editor.on("component:clone", handleComponentAdd);
    
    return () => {
      editor.off("component:add", handleComponentAdd);
      editor.off("component:clone", handleComponentAdd);
    };
  }, [editor, activeTheme]);

  // Обработчик выбора темы
  const handleThemeSelect = useCallback((themeId: string) => {
    setActiveThemeId(themeId);
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    }
    if (editor) {
      const theme = projectThemes.find((t) => t.id === themeId);
      if (theme) {
        applyProjectTheme(editor, theme);
      }
    }
  }, [editor]);

  return (
    <div className="theme-panel">
      <div className="theme-panel-header">
        <h3>Темы проекта</h3>
        <p>Выберите готовую тему для всего проекта</p>
      </div>
      <div className="theme-panel-themes">
        {projectThemes.map((theme) => {
          const isActive = theme.id === activeThemeId;
          return (
            <button
              key={theme.id}
              type="button"
              className={`theme-theme-item ${isActive ? "is-active" : ""}`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              <div className="theme-theme-preview" style={{
                background: theme.background,
                color: theme.text,
                border: `2px solid ${theme.border}`,
              }}>
                <div style={{
                  background: theme.surface,
                  color: theme.surfaceText,
                  padding: "8px",
                  borderRadius: "4px",
                  marginBottom: "8px",
                  fontSize: "12px",
                }}>Карточка</div>
                <div style={{
                  background: theme.buttonPrimary,
                  color: theme.buttonPrimaryText,
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  display: "inline-block",
                }}>Кнопка</div>
              </div>
              <div className="theme-theme-info">
                <div className="theme-theme-name">{theme.name}</div>
                <div className="theme-theme-desc">{theme.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
