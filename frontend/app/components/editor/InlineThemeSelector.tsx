// Селектор тем для выбранного элемента
"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties } from "react";
import type { Editor, Component } from "grapesjs";
import {
  allThemes,
  buttonThemes,
  cardThemes,
  textThemes,
  inputThemes,
  badgeThemes,
  applyTheme,
  ThemeStyle,
} from "@/app/utils/editor/themes";

const THEME_NAME_ATTR = "data-theme-name";
const THEME_PROPS_ATTR = "data-theme-props";

const toCssProperty = (property: string) =>
  property.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);

const toPreviewStyle = (styles: Record<string, string>): CSSProperties => {
  const result: Record<string, string> = {};
  Object.entries(styles).forEach(([property, value]) => {
    const camelKey = property.includes("-")
      ? property.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
      : property;
    result[camelKey] = value;
  });
  return result as CSSProperties;
};

const renderPreview = (componentType: string, theme: ThemeStyle) => {
  const previewStyle = toPreviewStyle(theme.styles);

  switch (componentType) {
    case "button":
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ...previewStyle,
            cursor: previewStyle.cursor || "pointer",
          }}
        >
          Готовая кнопка
        </span>
      );
    case "card":
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            ...previewStyle,
            padding: previewStyle.padding || "16px",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.9 }}>Карточка продукта</span>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, opacity: 0.7 }}>
            Короткое описание блока, которое покажет стиль текста и фон.
          </p>
        </div>
      );
    case "text":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
          <h3 style={{ margin: 0, ...previewStyle }}>
            Элегантный заголовок
          </h3>
          <p style={{ margin: 0, fontSize: 14, color: "rgba(226,232,240,0.7)" }}>
            Так будет выглядеть текст с выбранной темой.
          </p>
        </div>
      );
    case "input":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
          <label style={{ fontSize: 12, color: "rgba(226,232,240,0.7)" }}>Подпись поля</label>
          <input
            placeholder="Введите значение"
            style={{
              ...previewStyle,
            }}
          />
        </div>
      );
    case "badge":
      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ...previewStyle,
          }}
        >
          Бейдж
        </span>
      );
    default:
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              ...previewStyle,
              padding: previewStyle.padding || "12px 20px",
              cursor: previewStyle.cursor || "pointer",
            }}
          >
            Кнопка
          </span>
        </div>
      );
  }
};

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: Editor | null;
  selectedComponent: Component | null;
  availableThemes: ThemeStyle[];
  activeThemeName: string;
  componentType: string;
  onApplyTheme: (theme: ThemeStyle) => void;
}

function ThemeSelectorModal({
  isOpen,
  onClose,
  editor,
  selectedComponent,
  availableThemes,
  activeThemeName,
  componentType,
  onApplyTheme,
}: ThemeSelectorModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const topProperties = useMemo(() => {
    if (availableThemes.length === 0) return new Map<string, string[]>();
    const map = new Map<string, string[]>();
    availableThemes.forEach((theme) => {
      const keys = Object.keys(theme.styles)
        .slice(0, 4)
        .map((key) => toCssProperty(key));
      map.set(theme.name, keys);
    });
    return map;
  }, [availableThemes]);

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

    const handleWheel = (event: WheelEvent) => {
      if (!contentRef.current) return;
      const body = contentRef.current.querySelector(".editor-theme-modal__body") as HTMLElement;
      if (body && event.target) {
        const target = event.target as HTMLElement;
        const isInsideBody = body.contains(target) || body === target;
        if (isInsideBody) {
          const canScroll = body.scrollHeight > body.clientHeight;
          const isAtTop = body.scrollTop <= 0;
          const isAtBottom = body.scrollTop >= body.scrollHeight - body.clientHeight - 1;
          
          if (canScroll) {
            if ((event.deltaY > 0 && !isAtBottom) || (event.deltaY < 0 && !isAtTop)) {
              event.stopPropagation();
            }
          } else {
            event.stopPropagation();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("wheel", handleWheel, { passive: false });
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("wheel", handleWheel);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !selectedComponent || availableThemes.length === 0) {
    return null;
  }

  const previewType = componentType || "all";

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
      <div className="editor-theme-modal__content" ref={contentRef} role="document">
        <header className="editor-theme-modal__header">
          <div className="editor-theme-modal__header-copy">
            <h2>Выбор темы</h2>
            <p>Выберите тему для выделенного элемента</p>
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
          <div className="theme-grid">
            {availableThemes.map((theme, index) => {
              const tags = topProperties.get(theme.name) || [];
              return (
                <button
                  type="button"
                  key={`${previewType}:${theme.name}:${index}`}
                  onClick={() => {
                    onApplyTheme(theme);
                    onClose();
                  }}
                  className={`theme-card ${activeThemeName === theme.name ? "is-active" : ""}`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="theme-card__preview">{renderPreview(previewType, theme)}</div>
                  <div className="theme-card__meta">
                    <span className="theme-card__badge">{theme.category}</span>
                    <span className="theme-card__title">{theme.name}</span>
                    <p className="theme-card__description">{theme.description}</p>
                    {tags.length > 0 && (
                      <div className="theme-card__tags">
                        {tags.map((prop) => (
                          <span key={prop} className="theme-card__tag">
                            {prop}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InlineThemeSelectorProps {
  editor: Editor | null;
}

export function InlineThemeSelector({ editor }: InlineThemeSelectorProps) {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [availableThemes, setAvailableThemes] = useState<ThemeStyle[]>([]);
  const [activeThemeName, setActiveThemeName] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [componentType, setComponentType] = useState<string>("");
  const [toolbarElement, setToolbarElement] = useState<HTMLElement | null>(null);

  const getAttributeArray = useCallback((component: Component, attr: string) => {
    const attrs = component.getAttributes?.() || {};
    const raw = attrs[attr];
    if (typeof raw !== "string" || raw.trim().length === 0) return [];
    return raw.split("|").map((item) => item.trim()).filter(Boolean);
  }, []);

  const storeThemeAttributes = useCallback(
    (component: Component, properties: string[], themeName: string) => {
      const existing = new Set(getAttributeArray(component, THEME_PROPS_ATTR));
      properties.forEach((prop) => existing.add(prop));
      component.addAttributes({
        [THEME_NAME_ATTR]: themeName,
        [THEME_PROPS_ATTR]: Array.from(existing).join("|"),
      });
    },
    [getAttributeArray]
  );

  const clearThemeStyles = useCallback(
    (component: Component) => {
      const properties = getAttributeArray(component, THEME_PROPS_ATTR);
      if (properties.length) {
        properties.forEach((prop) => component.removeStyle(prop));
      }
    },
    [getAttributeArray]
  );

  useEffect(() => {
    if (!editor) return;

    const normalizeContent = (value: unknown): string => {
      if (typeof value === "string") return value;
      if (Array.isArray(value)) {
        return value
          .map((item) => (typeof item === "string" ? item : ""))
          .join(" ")
          .trim();
      }
      return "";
    };

    const normalizeClasses = (value: unknown): string[] => {
      if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === "string");
      }
      return [];
    };

    const updateSelected = () => {
      const selected = editor.getSelected() as Component | null;
      setSelectedComponent(selected);
      setShowModal(false);

      if (selected) {
        const tagName = selected.get("tagName")?.toString().toLowerCase() || "";
        const rawContent = selected.get("content");
        const content = normalizeContent(rawContent);
        const classes = normalizeClasses(selected.getClasses());
        const attrs = selected.getAttributes?.() || {};
        const storedTheme = typeof attrs[THEME_NAME_ATTR] === "string" ? attrs[THEME_NAME_ATTR] : "";
        setActiveThemeName(storedTheme);

        if (
          tagName === "button" ||
          content.toLowerCase().includes("button") ||
          classes.some((c) => c.toLowerCase().includes("button"))
        ) {
          setComponentType("button");
          setAvailableThemes(buttonThemes);
        } else if (
          tagName === "div" &&
          (content.toLowerCase().includes("card") ||
            classes.some((c) => c.toLowerCase().includes("card")))
        ) {
          setComponentType("card");
          setAvailableThemes(cardThemes);
        } else if (["h1", "h2", "h3", "h4", "h5", "h6", "p"].includes(tagName)) {
          setComponentType("text");
          setAvailableThemes(textThemes);
        } else if (tagName === "input" || tagName === "textarea" || tagName === "select") {
          setComponentType("input");
          setAvailableThemes(inputThemes);
        } else if (
          tagName === "span" &&
          (content.toLowerCase().includes("бейдж") ||
            classes.some((c) => c.toLowerCase().includes("badge")))
        ) {
          setComponentType("badge");
          setAvailableThemes(badgeThemes);
        } else {
          setComponentType("all");
          setAvailableThemes(allThemes);
        }

        setTimeout(() => {
          const toolbar = document.querySelector(".gjs-toolbar") as HTMLElement;
          if (toolbar) {
            setToolbarElement(toolbar);
          }
        }, 100);
      } else {
        setAvailableThemes([]);
        setActiveThemeName("");
        setComponentType("");
        setToolbarElement(null);
      }
    };

    const handleDeselected = () => {
      setSelectedComponent(null);
      setAvailableThemes([]);
      setActiveThemeName("");
      setShowModal(false);
      setComponentType("");
      setToolbarElement(null);
    };

    editor.on("component:selected", updateSelected);
    editor.on("component:deselected", handleDeselected);

    updateSelected();

    return () => {
      editor.off("component:selected", updateSelected);
      editor.off("component:deselected", handleDeselected);
    };
  }, [editor]);

  const handleApplyTheme = useCallback(
    (theme: ThemeStyle) => {
      if (!selectedComponent || !editor) return;
      clearThemeStyles(selectedComponent);
      const appliedProps: string[] = [];
      applyTheme(selectedComponent, theme);
      Object.keys(theme.styles).forEach((key) => {
        const cssProp = toCssProperty(key);
        appliedProps.push(cssProp);
      });
      storeThemeAttributes(selectedComponent, appliedProps, theme.name);
      editor.trigger("component:update", selectedComponent);
      setActiveThemeName(theme.name);
    },
    [selectedComponent, editor, clearThemeStyles, storeThemeAttributes]
  );

  if (!selectedComponent || availableThemes.length === 0 || !toolbarElement) {
    return null;
  }

  const buttonContent = (
    <div
      className="gjs-toolbar-item inline-theme-selector__trigger"
      onClick={() => setShowModal(true)}
      title="Выбрать тему"
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <path d="m5.6 5.6 12.8 12.8" />
        <path d="m5.6 18.4 12.8-12.8" />
      </svg>
    </div>
  );

  return (
    <>
      {toolbarElement && typeof document !== "undefined" && (
        <>
          {createPortal(buttonContent, toolbarElement)}
          <ThemeSelectorModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            editor={editor}
            selectedComponent={selectedComponent}
            availableThemes={availableThemes}
            activeThemeName={activeThemeName}
            componentType={componentType}
            onApplyTheme={handleApplyTheme}
          />
        </>
      )}
    </>
  );
}
