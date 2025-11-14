import grapesjs from "grapesjs";
import { editorConfig, rowStyle } from "./editorConfig";
import { registerBlocks } from "./blocks";
import { applyHeaderFooter, getInitialContent, HeaderSettings, FooterSettings } from "./headerFooter";
import { projectThemes, applyProjectTheme, defaultThemeId } from "./themes";
import { getBlocks } from '@/app/lib/blocks';
import type { CustomBlockList } from '@/app/lib/blocks';

declare global {
  interface Window {
    applyHeaderFooter?: () => void;
  }
}

const initialTemplateStyles = `
:root {
  color-scheme: dark;
}

body {
  font-family: "Inter", "Segoe UI", sans-serif;
  background: #050505;
  color: #f8fafc;
}

a {
  color: inherit;
  text-decoration: none;
}

.page-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top, #111827 0%, #050814 55%, #020510 100%);
  color: #f8fafc;
}

.page-shell p {
  margin: 0;
}

.theme-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 0;
  padding: 4px 0;
  overflow: hidden;
}

.theme-panel-header {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 600;
  opacity: 0.85;
}

.theme-panel-chip {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(129, 140, 248, 0.16);
  color: #c7d2fe;
  border: 1px solid rgba(129, 140, 248, 0.35);
  white-space: nowrap;
}

.theme-panel-themes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;
}

.theme-theme-item {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.theme-theme-item:hover {
  border-color: rgba(129, 140, 248, 0.4);
  transform: translateY(-2px);
}

.theme-theme-item.is-active {
  border-color: rgba(129, 140, 248, 0.6);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.45);
}

.theme-theme-preview {
  width: 100%;
  min-height: 80px;
  padding: 12px;
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.theme-theme-info {
  padding: 12px;
  background: rgba(15, 23, 42, 0.8);
  border-top: 1px solid rgba(148, 163, 184, 0.1);
}

.theme-theme-name {
  font-size: 13px;
  font-weight: 600;
  color: rgba(248, 250, 252, 0.9);
  margin-bottom: 4px;
}

.theme-theme-desc {
  font-size: 11px;
  color: rgba(226, 232, 240, 0.7);
}

.theme-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
  scrollbar-width: thin;
}

.theme-card-preview > * {
  max-width: 100%;
}

.theme-card-preview button,
.theme-card-preview input,
.theme-card-preview span {
  font-family: inherit;
}

.theme-card-sample {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: rgba(226, 232, 240, 0.7);
}

.theme-card-sample__button {
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
}

.theme-card-sample__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: 14px;
}

.theme-card-sample__card p {
  margin: 0;
}

.theme-card-sample__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.theme-card-sample__text h4 {
  margin: 0;
}

.theme-card-sample__input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.theme-card-sample__input input {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.3);
  color: inherit;
}

.theme-card-sample__badge {
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 999px;
}

.theme-card-sample__generic {
  display: flex;
  gap: 6px;
}

.theme-card-sample__bar {
  flex: 1;
  height: 6px;
  border-radius: 999px;
}

.nimble-header {
  background: var(--header-bg, #0f172a);
  color: var(--header-text, #ffffff);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nimble-header__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.nimble-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nimble-brand__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--header-text, #ffffff);
  font-weight: 700;
  font-size: 18px;
}

.nimble-brand__logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.nimble-brand__info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nimble-brand__name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--header-text, #ffffff);
  line-height: 1.2;
}

.nimble-brand__tagline {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.2;
}

.nimble-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.nimble-nav__link {
  color: var(--header-text, #ffffff);
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s ease;
  opacity: 0.8;
}

.nimble-nav__link:hover {
  opacity: 1;
}

.nimble-nav__cta {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--header-text, #ffffff);
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nimble-nav__cta:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.nimble-footer {
  background: var(--footer-bg, #0f172a);
  color: var(--footer-text, #ffffff);
  padding: 3rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.nimble-footer__grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.nimble-footer__column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nimble-footer__brand {
  font-size: 1rem;
  font-weight: 700;
  color: var(--footer-text, #ffffff);
  margin-bottom: 0.5rem;
}

.nimble-footer__heading {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--footer-text, #ffffff);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nimble-footer__text {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0;
}

.nimble-footer__link {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s ease;
  margin-bottom: 0.5rem;
}

.nimble-footer__link:hover {
  color: var(--footer-text, #ffffff);
}

.nimble-footer__social {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.nimble-footer__social-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--footer-text, #ffffff);
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nimble-footer__social-badge:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.nimble-main {
  flex: 1;
  padding: 2rem;
}
`;

export function initEditor(
  container: HTMLElement,
  headerSettingsRef: React.MutableRefObject<HeaderSettings>,
  footerSettingsRef: React.MutableRefObject<FooterSettings>
) {
  const editor = grapesjs.init({
    container,
    ...editorConfig,
    styleManager: {
      appendTo: ".styles-container",
      sectors: [],
    },
  });

  registerBlocks(editor);
  
  editor.on('load', () => {
    setTimeout(() => {
      loadCustomBlocks(editor).then(() => {
        if (editor && editor.BlockManager && typeof editor.BlockManager.render === 'function') {
          editor.BlockManager.render();
        }
      }).catch((error) => {
        console.error('Ошибка при загрузке кастомных блоков:', error);
      });
    }, 100);
  });

  const nonResizableTags = ['body', 'html', 'head', 'script', 'style', 'meta', 'link', 'title'];
  
  const resizableConfig = {
    tl: 1,
    tc: 1,
    tr: 1,
    cl: 1,
    cr: 1,
    bl: 1,
    bc: 1,
    br: 1,
    minDim: 20,
    step: 1,
  };
  
  editor.DomComponents.addType("default", {
    extend: "default",
    model: {
      defaults: {
        resizable: function() {
          const tagName = this.get('tagName')?.toLowerCase();
          const componentType = this.get('type');
          
          if (!tagName || nonResizableTags.includes(tagName) || componentType === 'textnode') {
            return false;
          }
          
          return resizableConfig;
        },
      },
    },
  });

  editor.on("load", () => {
    setTimeout(() => {
      const gjsSmProperties = document.querySelector('.gjs-sm-properties') as HTMLElement;
      if (gjsSmProperties) {
        gjsSmProperties.style.pointerEvents = "auto";
        const handleGjsWheel = (e: WheelEvent) => {
          const container = e.currentTarget as HTMLElement;
          if (container.scrollHeight > container.clientHeight) {
            e.stopPropagation();
          }
        };
        gjsSmProperties.addEventListener('wheel', handleGjsWheel, { passive: true });
      }
    }, 100);
    const style = document.createElement("style");
    style.textContent = `
      .gjs-resizer {
        border: 2px solid #3b82f6 !important;
        background: rgba(59, 130, 246, 0.2) !important;
        width: 8px !important;
        height: 8px !important;
        border-radius: 50% !important;
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3) !important;
        transition: all 0.2s ease !important;
      }
      .gjs-resizer:hover {
        background: rgba(59, 130, 246, 0.6) !important;
        border-color: #60a5fa !important;
        transform: scale(1.3) !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4) !important;
      }
      .gjs-resizer.gjs-resizer-tl,
      .gjs-resizer.gjs-resizer-tr,
      .gjs-resizer.gjs-resizer-bl,
      .gjs-resizer.gjs-resizer-br {
        cursor: nwse-resize !important;
      }
      .gjs-resizer.gjs-resizer-tc,
      .gjs-resizer.gjs-resizer-bc {
        cursor: ns-resize !important;
      }
      .gjs-resizer.gjs-resizer-cl,
      .gjs-resizer.gjs-resizer-cr {
        cursor: ew-resize !important;
      }
      .gjs-selected {
        outline: 2px solid #3b82f6 !important;
        outline-offset: -2px !important;
      }
    `;
    document.head.appendChild(style);
  });

  editor.DomComponents.addType("select", {
    extend: "default",
    model: {
      defaults: {
        traits: [
          {
            type: "select",
            name: "multiple",
            label: "Множественный выбор",
            options: [
              { id: "no", value: "", name: "Нет" },
              { id: "yes", value: "multiple", name: "Да" },
            ],
          },
        ],
      },
    },
  });

  editor.DomComponents.addType("option", {
    extend: "default",
    model: {
      defaults: {
        editable: true,
        droppable: false,
        selectable: true,
        highlightable: true,
      },
    },
  });

  editor.DomComponents.addType("th", {
    extend: "default",
    model: {
      defaults: {
        editable: true,
      },
    },
  });

  editor.DomComponents.addType("td", {
    extend: "default",
    model: {
      defaults: {
        editable: true,
      },
    },
  });

  editor.DomComponents.addType("image", {
    extend: "image",
    model: {
      defaults: {
        traits: [
          {
            type: "text",
            name: "src",
            label: "URL изображения",
            placeholder: "https://example.com/image.jpg",
          },
          {
            type: "text",
            name: "alt",
            label: "Альтернативный текст",
            placeholder: "Описание изображения",
          },
        ],
      },
    },
  });

  // Автоматически открываем диалог выбора файла при добавлении изображения
  editor.on("component:add", (component: any) => {
    if (!component) return;
    
    const tagName = component.get('tagName')?.toLowerCase();
    const src = component.getAttributes()?.src || component.get('src') || '';
    
    // Если это новое изображение с placeholder, открываем диалог выбора файла
    if (tagName === 'img' && (src.includes('placeholder.com') || src.includes('via.placeholder'))) {
      setTimeout(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0];
          if (!file) return;
          
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            const result = event.target?.result;
            if (typeof result === "string") {
              component.addAttributes({ src: result });
              editor.select(component);
              editor.refresh();
            }
          };
          reader.readAsDataURL(file);
        };
        input.click();
      }, 150);
    }
  });
  
  editor.on("component:selected", (component: any) => {
    if (!component) return;
    
    const componentType = component.get("type");
    const tagName = component.get('tagName')?.toLowerCase();
    
    const nonResizable = ['body', 'html', 'head', 'script', 'style', 'meta', 'link', 'title'];
    
    if (!nonResizable.includes(tagName) && componentType !== 'textnode') {
      const resizableConfig: any = {
        tl: 1,
        tc: 1,
        tr: 1,
        cl: 1,
        cr: 1,
        bl: 1,
        bc: 1,
        br: 1,
        minDim: 20,
        step: 1,
      };
      
      const currentResizable = component.get("resizable");
      const needsUpdate = !currentResizable || 
        typeof currentResizable === 'boolean' ||
        (typeof currentResizable === 'object' && (
          !currentResizable.tl || !currentResizable.tc || !currentResizable.tr ||
          !currentResizable.cl || !currentResizable.cr ||
          !currentResizable.bl || !currentResizable.bc || !currentResizable.br
        ));
      
      if (needsUpdate) {
        component.set("resizable", resizableConfig);
        
        setTimeout(() => {
          editor.refresh();
          const view = component.getView();
          if (view && (view as any).updateResizer) {
            (view as any).updateResizer();
          }
        }, 100);
      }
    }
    
    
    const attrs = component.getAttributes() || {};
    const currentTraits = component.get("traits") || [];
    
    if (attrs["data-rating-component"] === "true") {
      const hasRatingTrait = currentTraits.some((t: any) => t && t.name === "data-rating-stars");
      
      if (!hasRatingTrait) {
        const starsCount = parseInt(attrs["data-rating-stars"] || "5") || 5;
        component.set("traits", [
          ...currentTraits,
          {
            type: "number",
            name: "data-rating-stars",
            label: "Количество звезд",
            min: 1,
            max: 10,
            default: starsCount,
            changeProp: 1,
          },
        ]);
        
        component.on("change:attributes:data-rating-stars", () => {
          const stars = parseInt(component.getAttributes()["data-rating-stars"] || "5") || 5;
          const starsHtml = "★".repeat(Math.max(1, Math.min(10, stars)));
          
          const starsEl = component.view?.el?.querySelector(".rating-stars");
          if (starsEl) {
            starsEl.textContent = starsHtml;
          }
          
          component.addAttributes({ "data-rating-stars": stars.toString() });
          editor.refresh();
        });
      }
    }
    
    if (attrs["data-progress-component"] === "true") {
      const hasProgressTrait = currentTraits.some((t: any) => t && t.name === "data-progress");
      
      if (!hasProgressTrait) {
        const progressValue = parseInt(attrs["data-progress"] || "60") || 60;
        component.set("traits", [
          ...currentTraits,
          {
            type: "number",
            name: "data-progress",
            label: "Процент прогресса",
            min: 0,
            max: 100,
            default: progressValue,
            changeProp: 1,
          },
        ]);
        
        component.on("change:attributes:data-progress", () => {
          const progress = parseInt(component.getAttributes()["data-progress"] || "60") || 60;
          const progressBar = component.view?.el?.querySelector(".progress-bar-fill");
          const progressPercent = component.view?.el?.querySelector(".progress-percent");
          
          if (progressBar) {
            (progressBar as HTMLElement).style.width = `${Math.max(0, Math.min(100, progress))}%`;
          }
          if (progressPercent) {
            progressPercent.textContent = `${progress}%`;
          }
          
          component.addAttributes({ "data-progress": progress.toString() });
          editor.refresh();
        });
      }
    }
  });

  const applyHeaderFooterFn = () => {
    applyHeaderFooter(editor, headerSettingsRef.current, footerSettingsRef.current);
  };

  (window as any).applyHeaderFooter = applyHeaderFooterFn;

  editor.on("load", () => {
    setTimeout(() => {
      const frame = document.querySelector(".gjs-frame") as HTMLElement;
      if (frame) {
        const handleFrameWheel = (e: WheelEvent) => {
          frame.scrollTop += e.deltaY;
          e.preventDefault();
          e.stopPropagation();
        };
        frame.addEventListener("wheel", handleFrameWheel, { passive: false });
      }
    }, 200);
  });

  setTimeout(() => {
    const blocksContainer = document.querySelector(".blocks-container") as HTMLElement;
    const layersContainer = document.querySelector(".layers-container") as HTMLElement;
    const stylesContainer = document.querySelector(".styles-container") as HTMLElement;
    const blocksParent = blocksContainer?.parentElement as HTMLElement;
    const stylesParent = stylesContainer?.parentElement as HTMLElement;
    const canvas = document.querySelector(".gjs-cv-canvas") as HTMLElement;
    const frame = document.querySelector(".gjs-frame") as HTMLElement;

    // Настройка прокрутки для панелей
    if (blocksParent) {
      blocksParent.style.overflowY = "auto";
      blocksParent.style.overflowX = "hidden";
    }

    if (layersContainer) {
      layersContainer.style.overflowY = "auto";
      layersContainer.style.overflowX = "hidden";
    }

    if (stylesParent) {
      stylesParent.style.overflowY = "auto";
      stylesParent.style.overflowX = "hidden";
      stylesParent.style.pointerEvents = "auto";
      stylesParent.style.willChange = "scroll-position";
    }
    
    if (stylesContainer) {
      stylesContainer.style.pointerEvents = "auto";
      const handleWheel = (e: WheelEvent) => {
        const container = e.currentTarget as HTMLElement;
        if (container.scrollHeight > container.clientHeight) {
          e.stopPropagation();
        }
      };
      stylesContainer.addEventListener('wheel', handleWheel, { passive: true });
    }

    const preventPageScroll = (e: WheelEvent) => {
      const target = e.currentTarget as HTMLElement;
      const canScroll = target.scrollHeight > target.clientHeight;
      const isAtTop = target.scrollTop <= 0;
      const isAtBottom = target.scrollTop >= target.scrollHeight - target.clientHeight;

      if (canScroll) {
        if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
          e.stopPropagation();
        } else if ((e.deltaY > 0 && isAtBottom) || (e.deltaY < 0 && isAtTop)) {
          e.preventDefault();
          e.stopPropagation();
        }
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (canvas) {
      const handleCanvasWheel = (e: WheelEvent) => {
        const frame = document.querySelector(".gjs-frame") as HTMLElement;
        if (frame) {
          frame.scrollTop += e.deltaY;
          e.preventDefault();
          e.stopPropagation();
        }
      };
      canvas.addEventListener("wheel", handleCanvasWheel, { passive: false });
    }
    if (frame) {
      const handleFrameWheel = (e: WheelEvent) => {
        frame.scrollTop += e.deltaY;
        e.preventDefault();
        e.stopPropagation();
      };
      frame.addEventListener("wheel", handleFrameWheel, { passive: false });
    }

    if (blocksContainer) {
      blocksContainer.addEventListener(
        "wheel",
        (e: WheelEvent) => {
          const target = e.currentTarget as HTMLElement;
          const canScroll = target.scrollHeight > target.clientHeight;
          const isAtTop = target.scrollTop <= 0;
          const isAtBottom = target.scrollTop >= target.scrollHeight - target.clientHeight;

          if (canScroll) {
            if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
              e.stopPropagation();
            } else if ((e.deltaY > 0 && isAtBottom) || (e.deltaY < 0 && isAtTop)) {
              e.preventDefault();
              e.stopPropagation();
            }
          }
        },
        { passive: false }
      );
    }

    if (layersContainer) {
      layersContainer.addEventListener(
        "wheel",
        (e: WheelEvent) => {
          const target = e.currentTarget as HTMLElement;
          const canScroll = target.scrollHeight > target.clientHeight;
          const isAtTop = target.scrollTop <= 0;
          const isAtBottom = target.scrollTop >= target.scrollHeight - target.clientHeight;

          if (canScroll) {
            if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
              e.stopPropagation();
            } else if ((e.deltaY > 0 && isAtBottom) || (e.deltaY < 0 && isAtTop)) {
              e.preventDefault();
              e.stopPropagation();
            }
          }
        },
        { passive: false }
      );
    }

    const htmlStructureWrapper = document.querySelector(".html-structure-wrapper") as HTMLElement;

    if (htmlStructureWrapper) {
      htmlStructureWrapper.addEventListener(
        "wheel",
        (e: WheelEvent) => {
          const target = e.currentTarget as HTMLElement;
          const canScroll = target.scrollHeight > target.clientHeight;
          const isAtTop = target.scrollTop <= 0;
          const isAtBottom = target.scrollTop >= target.scrollHeight - target.clientHeight;

          if (canScroll) {
            if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
              e.stopPropagation();
            } else if ((e.deltaY > 0 && isAtBottom) || (e.deltaY < 0 && isAtTop)) {
              e.preventDefault();
              e.stopPropagation();
            }
          }
        },
        { passive: false }
      );
    }

    const gjsBlocksC = document.querySelector(".gjs-blocks-c") as HTMLElement;
    if (gjsBlocksC) {
      gjsBlocksC.addEventListener(
        "wheel",
        (e: WheelEvent) => {
          const target = e.currentTarget as HTMLElement;
          const canScroll = target.scrollHeight > target.clientHeight;
          const isAtTop = target.scrollTop <= 0;
          const isAtBottom = target.scrollTop >= target.scrollHeight - target.clientHeight;

          if (canScroll) {
            if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
              e.stopPropagation();
            } else if ((e.deltaY > 0 && isAtBottom) || (e.deltaY < 0 && isAtTop)) {
              e.preventDefault();
              e.stopPropagation();
            }
          }
        },
        { passive: false }
      );
    }
  }, 100);

  return editor;
}

/**
 * Загружает кастомные блоки из БД и добавляет их в редактор
 */
async function loadCustomBlocks(editor: any) {
  try {
    const blocks = await getBlocks();
    
    const fullBlocks = await Promise.all(
      blocks
        .filter(block => block.is_active)
        .map(async (block) => {
          try {
            const { getBlock } = await import('@/app/lib/blocks');
            return await getBlock(block.id);
          } catch (err) {
            return null;
          }
        })
    );
    
    if (!editor || !editor.BlockManager) {
      console.warn('BlockManager недоступен, пропускаем загрузку кастомных блоков');
      return;
    }
    
    let addedCount = 0;
    fullBlocks.forEach((block) => {
      if (!block) return;
      
      try {
        const existingBlock = editor.BlockManager.get(block.block_id);
        if (existingBlock) {
          return;
        }
      } catch (error) {
      }
      
      const label = block.label || createDefaultLabel(block);
      
      try {
        editor.BlockManager.add(block.block_id, {
          label: label,
          content: block.content,
          category: block.category,
          media: block.media || block.preview || '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="6" height="6" rx="1"/><rect x="14" y="5" width="6" height="6" rx="1"/><rect x="4" y="13" width="6" height="6" rx="1"/><rect x="14" y="13" width="6" height="6" rx="1"/></svg>',
          attributes: {
            'data-block-id': block.block_id,
            ...(block.attributes || {}),
          },
        });
        addedCount++;
      } catch (error) {
        console.error(`Ошибка добавления блока ${block.block_id}:`, error);
      }
    });
    
    if (addedCount > 0 && editor.BlockManager && typeof editor.BlockManager.render === 'function') {
      editor.BlockManager.render();
    }
  } catch (error) {
    console.error('Не удалось загрузить кастомные блоки из БД:', error);
  }
}

/**
 * Создает стандартный label для блока
 */
function createDefaultLabel(block: { name: string; preview?: string; description?: string }): string {
  return `
    <div style="display: flex; align-items: center; gap: 8px; padding: 8px;">
      <span style="font-size: 20px;">${block.preview || '📦'}</span>
      <div style="flex: 1;">
        <div style="font-weight: 600; font-size: 13px; color: #fff;">${block.name}</div>
        ${block.description ? `<div style="font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 2px;">${block.description}</div>` : ''}
      </div>
    </div>
  `;
}

