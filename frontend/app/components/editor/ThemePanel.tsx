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
  projectId?: number | null;
  onClose?: () => void;
}

export function ThemePanel({ editor, projectId, onClose }: ThemePanelProps) {
  const getThemeStorageKey = (id: number | null | undefined) => {
    if (id) {
      return `nimble-theme-${id}`;
    }
    return "nimble-theme-default";
  };

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const key = getThemeStorageKey(projectId);
      const stored = localStorage.getItem(key);
      return stored || defaultThemeId;
    }
    return defaultThemeId;
  });

  const activeTheme = projectThemes.find((t) => t.id === activeThemeId) ?? projectThemes[0];

  useEffect(() => {
    if (!editor) return;
    const key = getThemeStorageKey(projectId);
    const storedThemeId = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (storedThemeId) {
      const theme = projectThemes.find((t) => t.id === storedThemeId);
      if (theme) {
        setActiveThemeId(storedThemeId);
        applyProjectTheme(editor, theme);
      }
    } else {
      const theme = projectThemes.find((t) => t.id === defaultThemeId);
      if (theme) {
        setActiveThemeId(defaultThemeId);
        applyProjectTheme(editor, theme);
      }
    }
  }, [editor, projectId]);

  useEffect(() => {
    if (!editor || !activeTheme) return;
    applyProjectTheme(editor, activeTheme);
    
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

  const handleThemeSelect = useCallback((themeId: string) => {
    setActiveThemeId(themeId);
    const key = getThemeStorageKey(projectId);
    if (typeof window !== "undefined") {
      localStorage.setItem(key, themeId);
    }
    if (editor) {
      const theme = projectThemes.find((t) => t.id === themeId);
      if (theme) {
        applyProjectTheme(editor, theme);
        if (onClose) {
          setTimeout(() => {
            onClose();
          }, 100);
        }
      }
    }
  }, [editor, projectId, onClose]);

  return (
    <div className="theme-panel-grid">
      {projectThemes.map((theme) => {
        const isActive = theme.id === activeThemeId;
        return (
          <button
            key={theme.id}
            type="button"
            className={`theme-card ${isActive ? "theme-card-active" : ""}`}
            onClick={() => handleThemeSelect(theme.id)}
            style={{ background: theme.background }}
          >
            <div className="theme-card-preview">
              <div className="theme-card-sample" style={{ background: theme.surface, color: theme.surfaceText }}>
                <div className="theme-card-sample-text" style={{ color: theme.text }}>Текст</div>
                <div className="theme-card-sample-button" style={{ background: theme.buttonPrimary, color: theme.buttonPrimaryText }}>
                  Кнопка
                </div>
              </div>
            </div>
            <div className="theme-card-info">
              <div className="theme-card-name" style={{ color: theme.text }}>{theme.name}</div>
              <div className="theme-card-description" style={{ color: theme.text, opacity: 0.8 }}>{theme.description}</div>
            </div>
            {isActive && (
              <div className="theme-card-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
