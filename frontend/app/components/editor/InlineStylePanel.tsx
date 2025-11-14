"use client";

import { useEffect, useRef, useState } from "react";
import type { Component, Editor } from "grapesjs";

interface InlineStylePanelProps {
  editor: Editor | null;
  selectedComponent: Component | null;
}

export function InlineStylePanel({ editor, selectedComponent }: InlineStylePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!editor || !selectedComponent || !panelRef.current) {
      setPosition(null);
      return;
    }

    const updatePosition = () => {
      const view = (selectedComponent as any).view;
      if (!view || !view.el) {
        setPosition(null);
        return;
      }

      const element = view.el as HTMLElement;
      const rect = element.getBoundingClientRect();
      
      // Position panel relative to viewport (fixed positioning)
      const panelWidth = 280;
      const panelHeight = 320;
      const spacing = 16;

      // Calculate position in viewport coordinates
      let top = rect.top + rect.height / 2 - panelHeight / 2;
      let left = rect.right + spacing;

      // Check if there's space on the right
      const viewportWidth = window.innerWidth;
      if (left + panelWidth > viewportWidth - spacing) {
        // Position on the left side
        left = rect.left - panelWidth - spacing;
      }

      // Ensure panel stays within viewport bounds
      if (left < spacing) {
        left = spacing;
      }
      if (top < spacing) {
        top = spacing;
      }
      const maxTop = window.innerHeight - panelHeight - spacing;
      if (top > maxTop) {
        top = Math.max(spacing, maxTop);
      }

      setPosition({ top, left });
    };

    // Initial position update with small delay to ensure element is rendered
    const timeoutId = setTimeout(updatePosition, 100);

    // Update position on scroll or resize
    const canvasEl = editor.Canvas.getFrameEl();
    const canvasDoc = canvasEl?.contentDocument;
    const canvasWin = canvasEl?.contentWindow;

    const handleScroll = () => {
      requestAnimationFrame(updatePosition);
    };
    const handleResize = () => {
      requestAnimationFrame(updatePosition);
    };

    if (canvasDoc) {
      canvasDoc.addEventListener("scroll", handleScroll, true);
      canvasWin?.addEventListener("resize", handleResize);
    }
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    // Also listen to component updates that might change position
    const handleUpdate = () => {
      requestAnimationFrame(updatePosition);
    };

    editor.on("component:update", handleUpdate);
    editor.on("component:update:style", handleUpdate);
    editor.on("component:update:position", handleUpdate);

    return () => {
      clearTimeout(timeoutId);
      if (canvasDoc) {
        canvasDoc.removeEventListener("scroll", handleScroll, true);
        canvasWin?.removeEventListener("resize", handleResize);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
      editor.off("component:update", handleUpdate);
      editor.off("component:update:style", handleUpdate);
      editor.off("component:update:position", handleUpdate);
    };
  }, [editor, selectedComponent]);

  if (!selectedComponent || !position) {
    return null;
  }

  const handleStyleChange = (property: string, value: string) => {
    if (!selectedComponent || !editor) return;

    const cssProperty = property.replace(/([A-Z])/g, "-$1").toLowerCase();

    if (value === "") {
      selectedComponent.removeStyle(cssProperty);
    } else {
      selectedComponent.addStyle({ [cssProperty]: value });
    }

    editor.trigger("component:update", selectedComponent);
  };

  const styles = (selectedComponent.getStyle?.() || {}) as Record<string, string>;
  const fontSize = styles["font-size"] || "16px";
  const color = styles.color || "#f8fafc";
  const backgroundColor = styles["background-color"] || "";
  const padding = styles.padding || "";
  const borderRadius = styles["border-radius"] || "0px";

  return (
    <div
      ref={panelRef}
      className="inline-style-panel"
      style={{
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 10000,
        pointerEvents: "auto",
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="inline-style-panel__header">
        <span>Быстрые стили</span>
        <button
          type="button"
          className="inline-style-panel__close"
          onClick={() => {
            if (editor) {
              editor.select([]);
            }
          }}
          aria-label="Закрыть"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <div className="inline-style-panel__content">
        <div className="inline-style-field">
          <label>Размер шрифта</label>
          <input
            type="text"
            value={fontSize}
            onChange={(e) => handleStyleChange("fontSize", e.target.value)}
            placeholder="16px"
          />
        </div>
        <div className="inline-style-field">
          <label>Цвет текста</label>
          <div className="inline-style-color-group">
            <input
              type="color"
              value={color.startsWith("#") ? color : "#f8fafc"}
              onChange={(e) => handleStyleChange("color", e.target.value)}
            />
            <input
              type="text"
              value={color}
              onChange={(e) => handleStyleChange("color", e.target.value)}
              placeholder="#f8fafc"
            />
          </div>
        </div>
        <div className="inline-style-field">
          <label>Фон</label>
          <div className="inline-style-color-group">
            <input
              type="color"
              value={backgroundColor.startsWith("#") ? backgroundColor : "#000000"}
              onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
              placeholder="прозрачный"
            />
          </div>
        </div>
        <div className="inline-style-field">
          <label>Отступы</label>
          <input
            type="text"
            value={padding}
            onChange={(e) => handleStyleChange("padding", e.target.value)}
            placeholder="12px"
          />
        </div>
        <div className="inline-style-field">
          <label>Скругление</label>
          <input
            type="text"
            value={borderRadius}
            onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
            placeholder="8px"
          />
        </div>
      </div>
    </div>
  );
}

