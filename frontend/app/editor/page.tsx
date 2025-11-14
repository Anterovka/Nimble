"use client";

import { Suspense, startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "grapesjs/dist/css/grapes.min.css";
import "../utils/editor/editorStyles.css";
import { initEditor } from "@/app/utils/editor/initEditor";
import { HeaderFooterModal, HTMLStructure, ExportPreviewModal, StylePanel, ThemeModal, InlineStylePanel, InlineThemeSelector, SaveProjectModal, InteractionsPanel } from "@/app/components/editor";
import { DeployModal } from "@/app/components/editor/DeployModal";
import { TemplateChoiceModal } from "@/app/components/editor/TemplateChoiceModal";
import { HeaderSettings, FooterSettings } from "@/app/utils/editor/headerFooter";
import { useAuth } from "@/app/context/AuthContext";
import { AuthModal } from "@/app/components/auth/AuthModal";
import { createProject, updateProject, getProject, type Project } from "@/app/lib/projects";
import { getSubscription, type Subscription } from "@/app/lib/subscription";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Editor as GrapesEditor, Component as GrapesComponent } from "grapesjs";
import { Notification } from "@/app/components/Notification";


function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project');
  const templateId = searchParams.get('template');
  const isBlank = searchParams.get('blank') === 'true';
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<GrapesEditor | null>(null);
  const [editorInstance, setEditorInstance] = useState<GrapesEditor | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [showExportPreview, setShowExportPreview] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [blockSearch, setBlockSearch] = useState("");
  const topbarRef = useRef<HTMLDivElement>(null);
  const [topbarHeight, setTopbarHeight] = useState<number>(128);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "warning" | "info" | "success";
    action?: { label: string; href: string };
  } | null>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedComponent, setSelectedComponent] = useState<GrapesComponent | null>(null);
  const [showTemplateChoice, setShowTemplateChoice] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'style' | 'settings' | 'interactions'>('style');
  const rightPanelContentRef = useRef<HTMLDivElement>(null);
  
  const updateTopbarHeight = useCallback(() => {
    if (topbarRef.current) {
      const rect = topbarRef.current.getBoundingClientRect();
      setTopbarHeight(Math.round(rect.height));
    }
  }, []);

  const [headerSettings, setHeaderSettings] = useState<HeaderSettings>({
     logo: "",
     companyName: "Nimble",
     backgroundColor: "#0f172a",
     textColor: "#ffffff",
     navItems: ["Главная", "О нас", "Контакты"],
     navItemsRaw: "Главная, О нас, Контакты",
   });
  
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    backgroundColor: "#0f172a",
    textColor: "#ffffff",
    copyright: "© 2025 Nimble",
  });
 
 function showMobileHint(message: string) {
   let hint = document.getElementById('mobile-block-hint');
   if (!hint) {
     hint = document.createElement('div');
     hint.id = 'mobile-block-hint';
     hint.className = 'mobile-block-hint';
     document.body.appendChild(hint);
   }
   hint.textContent = message;
   hint.classList.add('show');
 }
 
 function hideMobileHint() {
   const hint = document.getElementById('mobile-block-hint');
   if (hint) {
     hint.classList.remove('show');
     setTimeout(() => {
       if (hint && !hint.classList.contains('show')) {
         hint.remove();
       }
     }, 300);
   }
 }
 
 const headerSettingsRef = useRef(headerSettings);
 const footerSettingsRef = useRef(footerSettings);

  useEffect(() => {
    headerSettingsRef.current = {
      ...headerSettings,
      navItemsRaw: headerSettings.navItemsRaw ?? headerSettings.navItems.join(", "),
    };
    footerSettingsRef.current = footerSettings;
  }, [headerSettings, footerSettings]);

  useEffect(() => {
    updateTopbarHeight();
    window.addEventListener("resize", updateTopbarHeight);
    return () => {
      window.removeEventListener("resize", updateTopbarHeight);
    };
  }, [updateTopbarHeight]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window.innerWidth >= 768) {
      startTransition(() => {
        setShowLeftPanel(true);
      });
    }
  }, []);

  // Показываем модальное окно выбора шаблонов при создании нового проекта
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;
    if (projectId || templateId || isBlank) return;
    
    // Проверяем, есть ли сохраненные данные в localStorage
    const hasStoredData = typeof window !== 'undefined' && (
      localStorage.getItem("gjs-components") || 
      localStorage.getItem("gjs-css")
    );
    
    // Если нет сохраненных данных и нет параметров - показываем модальное окно
    if (!hasStoredData) {
      setShowTemplateChoice(true);
    }
  }, [isAuthenticated, isLoading, projectId, templateId, isBlank]);

  // Загрузка проекта, шаблона или создание с нуля
  useEffect(() => {
    if (!isAuthenticated || !editorInstance) return;
    
    // Загрузка проекта
    if (projectId) {
      const numericProjectId = Number(projectId);
      if (isNaN(numericProjectId) || numericProjectId <= 0) {
        console.warn("Невалидный ID проекта:", projectId);
        setCurrentProject(null);
        return;
      }
      
      const loadProject = async () => {
        try {
          const project = await getProject(numericProjectId);
          setCurrentProject(project);
          
          if (project.header_settings) {
            setHeaderSettings({ ...headerSettings, ...project.header_settings as Partial<HeaderSettings> });
          }
          if (project.footer_settings) {
            setFooterSettings({ ...footerSettings, ...project.footer_settings as Partial<FooterSettings> });
          }
          
          if (!editorInstance?.getComponents) return;
          
          editorInstance.setStyle("");
          editorInstance.setComponents("");
          
          if (project.json_content && Object.keys(project.json_content).length > 0) {
            editorInstance.setComponents(project.json_content);
          } else if (project.html_content) {
            editorInstance.setComponents(project.html_content);
          }
          
          if (project.css_content) {
            editorInstance.addStyle(project.css_content);
          }
          
          try {
            editorInstance.store();
          } catch {
            // Игнорируем ошибки store - они не критичны
          }
        } catch (error) {
          // Обработка ошибок загрузки проекта
          if (error) {
            const errorMessage = error instanceof Error 
              ? error.message 
              : typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
                ? error.message
                : typeof error === 'object' && error !== null && 'detail' in error && typeof error.detail === 'string'
                  ? error.detail
                  : 'Неизвестная ошибка';
            
            if (errorMessage && errorMessage !== 'Неизвестная ошибка') {
              console.error("Ошибка загрузки проекта:", errorMessage);
            }
          }
          setCurrentProject(null);
        }
      };
      loadProject();
      return;
    }
    
    // Загрузка шаблона
    if (templateId && typeof window !== 'undefined') {
      const templateStr = localStorage.getItem('nimble-template');
      if (templateStr) {
        try {
          const template = JSON.parse(templateStr);
          
          // Ждем полной инициализации редактора перед загрузкой шаблона
          const loadTemplate = () => {
            // Проверяем, что редактор готов
            if (!editorInstance.Components || typeof editorInstance.getComponents !== 'function') {
              setTimeout(loadTemplate, 100);
              return;
            }
            
            // Сначала очищаем стили и компоненты
            editorInstance.setStyle("");
            editorInstance.setComponents("");
            
            // Небольшая задержка для завершения очистки
            setTimeout(() => {
              // Затем загружаем HTML
              if (template.html) {
                editorInstance.setComponents(template.html);
              }
              
              // Затем загружаем CSS
              if (template.css) {
                editorInstance.addStyle(template.css);
              }
              
              // Сохраняем в localStorage после небольшой задержки
              setTimeout(() => {
                editorInstance.store();
                localStorage.removeItem('nimble-template');
              }, 200);
            }, 50);
          };
          
          loadTemplate();
        } catch (error) {
          console.error("Ошибка загрузки шаблона", error);
          localStorage.removeItem('nimble-template');
        }
      }
      return;
    }
    
    // Создание с нуля (только header/footer)
    if (isBlank) {
      editorInstance.setComponents('');
      editorInstance.setStyle('');
      return;
    }
  }, [isAuthenticated, projectId, templateId, isBlank, editorInstance]);

  const handleChooseBlank = () => {
    router.push('/editor?blank=true');
  };

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    if (!editorRef.current) {
      return;
    }

    if (editorInstanceRef.current) {
      return;
    }

    let destroyed = false;
    let retryTimer: number | undefined;
    let resizeCleanup: (() => void) | undefined;
    let loadHandler: (() => void) | undefined;

    const checkElements = () => {
      const stylesContainer = document.querySelector(".styles-container");
      const blocksContainer = document.querySelector(".blocks-container");
      return Boolean(stylesContainer && blocksContainer);
    };

    const markReadyIfHasContent = (editor: ReturnType<typeof initEditor>) => {
      const wrapper = editor.getWrapper?.();
      const components = wrapper?.components?.();
      const hasComponents =
        Boolean(components) &&
        (Array.isArray(components)
          ? components.length > 0
          : typeof components?.length === "number"
            ? components.length > 0
            : false);
      if (hasComponents) {
        setEditorReady(true);
      }
    };

    const setupEditor = () => {
      if (!editorRef.current || destroyed) return;

      const editor = initEditor(editorRef.current, headerSettingsRef, footerSettingsRef);
      editorInstanceRef.current = editor;
      setEditorInstance(editor);

      const handleLoad = () => {
        if (!destroyed) {
          setEditorReady(true);
        }
      };

      loadHandler = handleLoad;
      editor.on("load", handleLoad);
      markReadyIfHasContent(editor);

      // Track selected component for inline style panel
      const handleComponentSelected = (component: GrapesComponent) => {
        setSelectedComponent(component);
      };
      const handleComponentDeselected = () => {
        setSelectedComponent(null);
      };
      editor.on("component:selected", handleComponentSelected);
      editor.on("component:deselected", handleComponentDeselected);

      const checkMobile = () => {
        const mobile = window.innerWidth < 768;
        setIsMobileMode(mobile);
        return mobile;
      };

      checkMobile();
      const resizeHandler = () => checkMobile();
      window.addEventListener("resize", resizeHandler);
      resizeCleanup = () => {
        window.removeEventListener("resize", resizeHandler);
        editor.off("component:selected", handleComponentSelected);
        editor.off("component:deselected", handleComponentDeselected);
      };
    };

    const init = () => {
      if (destroyed) return;

      if (!checkElements()) {
        retryTimer = window.setTimeout(init, 50);
        return;
      }

      setupEditor();
    };

    init();

    return () => {
      destroyed = true;
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
      if (resizeCleanup) {
        resizeCleanup();
      }
      if (editorInstanceRef.current) {
        if (loadHandler) {
          editorInstanceRef.current.off("load", loadHandler);
        }
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
      setEditorReady(false);
      setEditorInstance(null);
    };
  }, [isLoading, isAuthenticated]);

  // Блокировка прокрутки body при открытых панелях на мобильных
  useEffect(() => {
    if (isMobileMode && (showLeftPanel || showRightPanel)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLeftPanel, showRightPanel, isMobileMode]);

  // Настройка мобильной вставки блоков
  useEffect(() => {
    if (!editorReady || !editorInstance || !isMobileMode) return;

    const editor = editorInstance;
    
    // Отключаем drag & drop на мобильных
    const blocksContainer = document.querySelector('.blocks-container');
    if (!blocksContainer) return;

    // Обработчик клика на блок
    const handleBlockClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const blockEl = target.closest('.gjs-block');
      if (!blockEl) return;

      e.preventDefault();
      e.stopPropagation();

      // Получаем ID блока из различных источников
      let blockId: string | null = null;

      // Способ 0: из пользовательского data-атрибута
      blockId = blockEl.getAttribute('data-block-id');
 
      // Способ 1: из data-атрибута
      if (!blockId) {
        blockId = blockEl.getAttribute('data-gjs-type') || 
                  blockEl.getAttribute('data-type');
      }
 
      // Способ 2: из ID элемента (GrapesJS создает ID вида "gjs-block-{id}")
      if (!blockId) {
        const idAttr = blockEl.getAttribute('id');
        if (idAttr && idAttr.startsWith('gjs-block-')) {
          blockId = idAttr.replace('gjs-block-', '');
        }
      }
      
      // Способ 3: находим по label в BlockManager
      if (!blockId) {
        const labelEl = blockEl.querySelector('.gjs-block-label');
        if (labelEl) {
          const labelText = labelEl.textContent?.trim();
          if (labelText) {
            const allBlocks = editor.BlockManager.getAll();
            const blocks = allBlocks.models || allBlocks;
            for (const block of blocks) {
              if (block.get('label') === labelText) {
                blockId = block.getId();
                break;
              }
            }
          }
        }
      }

      if (blockId) {
        // Убираем выделение с других блоков
        document.querySelectorAll('.gjs-block.selected-mobile').forEach(el => {
          el.classList.remove('selected-mobile');
        });

        // Выделяем выбранный блок
        blockEl.classList.add('selected-mobile');
        setSelectedBlock(blockId);

        // Добавляем класс режима вставки на canvas
        const canvas = document.querySelector('.gjs-cv-canvas');
        if (canvas) {
          canvas.classList.add('mobile-insert-mode');
        }

        // Автоматически закрываем панель блоков на мобильных
        setTimeout(() => {
          setShowLeftPanel(false);
        }, 100);

        // Показываем подсказку
        showMobileHint('Коснитесь области редактора для вставки блока');
      }
    };

    // Обработчик клика на canvas для вставки блока
    const handleCanvasClick = (e: Event) => {
      if (!selectedBlock || !editor) return;

      // Предотвращаем стандартное поведение
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Получаем блок из BlockManager
      const blockModel = editor.BlockManager.get(selectedBlock);
      if (!blockModel) return;
 
      // Получаем контент блока
      let blockContent: unknown = blockModel.get('content');
       
       // Преобразуем объект в строку HTML
       if (typeof blockContent === 'object' && blockContent !== null) {
        const contentObject = blockContent as Record<string, unknown>;
        if (contentObject.type === 'image') {
          const src = typeof contentObject.src === 'string' ? contentObject.src : '';
          // Для галереи изображений добавляем 3 изображения
          if (selectedBlock === 'image-gallery') {
            blockContent = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;"><img src="${src}" style="width:100%;height:auto;border-radius:12px;object-fit:cover;" alt="Изображение 1"><img src="${src}" style="width:100%;height:auto;border-radius:12px;object-fit:cover;" alt="Изображение 2"><img src="${src}" style="width:100%;height:auto;border-radius:12px;object-fit:cover;" alt="Изображение 3"></div>`;
          } else {
            blockContent = `<img src="${src}" alt="" style="max-width: 100%; height: auto;" />`;
          }
        } else if (typeof contentObject.html === 'string') {
          blockContent = contentObject.html;
        } else if (typeof contentObject.content === 'string') {
          blockContent = contentObject.content;
        } else {
          blockContent = '';
        }
      }
       
      if (typeof blockContent !== 'string' || blockContent.trim().length === 0) return;
 
       // Добавляем компонент
      editor.select([]);
      const added = editor.addComponents(blockContent) as GrapesComponent | GrapesComponent[];
      const newComponent = Array.isArray(added) ? added[added.length - 1] : added;
       
       // Выделяем новый элемент
      setTimeout(() => {
        if (newComponent) {
          editor.select(newComponent);
          const element = (newComponent as unknown as { view?: { el?: HTMLElement } }).view?.el;
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
 
       // Сбрасываем режим вставки
      document.querySelectorAll('.gjs-block.selected-mobile').forEach(el => {
        el.classList.remove('selected-mobile');
      });
      document.querySelector('.gjs-cv-canvas')?.classList.remove('mobile-insert-mode');
      setSelectedBlock(null);
      hideMobileHint();
    };

    // Блокируем выбор компонентов в режиме вставки
    const handleComponentSelected = () => {
      if (selectedBlock) {
        editor.select([]);
      }
    };
    
    editor.on('component:selected', handleComponentSelected);
    
    // Обработчик на document для перехвата всех кликов
    const handleDocumentClick = (e: Event) => {
      if (!selectedBlock) return;
      
      const target = e.target as HTMLElement;
      const frame = document.querySelector('.gjs-frame');
      
      // Если клик внутри frame, обрабатываем как вставку блока
      if (frame && frame.contains(target)) {
        handleCanvasClick(e);
      }
    };
    
    // Добавляем обработчики
    setTimeout(() => {
      blocksContainer.addEventListener('click', handleBlockClick, true);
      document.addEventListener('click', handleDocumentClick, true);
      document.addEventListener('touchend', handleDocumentClick, true);
    }, 300);

    // Очистка при размонтировании
    return () => {
      blocksContainer.removeEventListener('click', handleBlockClick, true);
      document.removeEventListener('click', handleDocumentClick, true);
      document.removeEventListener('touchend', handleDocumentClick, true);
      editor.off('component:selected', handleComponentSelected);
    };
  }, [editorReady, isMobileMode, selectedBlock, editorInstance]);

  useEffect(() => {
    if (!editorReady || !editorInstance) {
      return;
    }

    const search = blockSearch.trim().toLowerCase();

    const applyFilters = () => {
      try {
        const blockManager = editorInstance.BlockManager;
        if (!blockManager) {
          return;
        }

        const blockCollection = blockManager.getAll();
        const blocksArray = Array.isArray((blockCollection as { models?: unknown[] }).models)
          ? ((blockCollection as { models: unknown[] }).models as unknown[])
          : Array.isArray(blockCollection)
          ? blockCollection
          : [];

        const categoryVisibility = new Map<HTMLElement, boolean>();

        blocksArray.forEach((blockItem) => {
          const blockModel = blockItem as {
            get?: (key: string) => unknown;
            attributes?: Record<string, unknown>;
            view?: { el?: HTMLElement };
            toHTML?: () => string;
          };

          let blockEl: HTMLElement | null = null;

          if (blockModel.view?.el) {
            blockEl = blockModel.view.el;
          } else if (typeof blockModel.get === "function") {
            blockEl = (blockModel.get("el") as HTMLElement | undefined) || null;
          }

          if (!blockEl) {
            const blocksContainer = document.querySelector(".blocks-container");
            if (blocksContainer) {
              const allBlocks = blocksContainer.querySelectorAll(".gjs-block");
              allBlocks.forEach((el) => {
                const htmlEl = el as HTMLElement;
                const blockLabel = htmlEl.querySelector(".gjs-block-label");
                if (blockLabel) {
                  const labelText = blockLabel.textContent?.toLowerCase() || "";
                  const matchesSearch = !search || labelText.includes(search);
                  htmlEl.style.display = matchesSearch ? "" : "none";
                }
              });
            }
            return;
          }

          const rawLabel =
            (typeof blockModel.get === "function"
              ? (blockModel.get("label") as string | undefined)
              : (blockModel.attributes?.label as string | undefined)) ?? "";

          const labelText = rawLabel.replace(/<[^>]+>/g, "").toLowerCase();
          const matchesSearch = !search || labelText.includes(search);
          const shouldDisplay = matchesSearch;

          if (blockEl) {
            blockEl.style.display = shouldDisplay ? "" : "none";
          }

          const categoryEl = blockEl?.closest(".gjs-category") as HTMLElement | null;
          if (categoryEl) {
            const alreadyVisible = categoryVisibility.get(categoryEl) ?? false;
            categoryVisibility.set(categoryEl, alreadyVisible || shouldDisplay);
          }
        });

        const blocksContainer = document.querySelector(".blocks-container");
        if (blocksContainer) {
          const allCategories = blocksContainer.querySelectorAll<HTMLElement>(".gjs-category");
          
          allCategories.forEach((categoryEl) => {
            if (search.length === 0) {
              categoryEl.style.display = "";
              const blocksInCategory = categoryEl.querySelectorAll<HTMLElement>(".gjs-block");
              blocksInCategory.forEach((block) => {
                block.style.display = "";
              });
              return;
            }

            const visible = categoryVisibility.get(categoryEl);
            categoryEl.style.display = visible ? "" : "none";
          });

          if (search.length > 0) {
            const allBlocks = blocksContainer.querySelectorAll<HTMLElement>(".gjs-block");
            allBlocks.forEach((block) => {
              const blockLabel = block.querySelector(".gjs-block-label");
              if (blockLabel) {
                const labelText = (blockLabel.textContent || "").toLowerCase();
                const matchesSearch = labelText.includes(search);
                const categoryEl = block.closest(".gjs-category") as HTMLElement | null;
                const categoryMatches = categoryEl && categoryVisibility.get(categoryEl);
                
                if (matchesSearch && categoryMatches) {
                  block.style.display = "";
                } else if (!matchesSearch) {
                  block.style.display = "none";
                }
              }
            });
          }
        }
      } catch (error) {
        console.error("Error applying block filters:", error);
      }
    };

    const raf = window.requestAnimationFrame(applyFilters);
    const timer = window.setTimeout(applyFilters, 100);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [editorReady, editorInstance, blockSearch]);

  // Обработка прокрутки колесиком для правой панели
  useEffect(() => {
    const panelContent = rightPanelContentRef.current;
    if (!panelContent) return;

    const handleWheel = (e: WheelEvent) => {
      const target = panelContent;
      const canScroll = target.scrollHeight > target.clientHeight;
      
      if (canScroll) {
        // Проверяем, не находимся ли мы на интерактивном элементе
        const targetElement = e.target as HTMLElement;
        const isInteractive = targetElement.tagName === 'INPUT' || 
                             targetElement.tagName === 'SELECT' || 
                             targetElement.tagName === 'BUTTON' ||
                             targetElement.closest('input[type="range"]') ||
                             targetElement.closest('.styles-slider');
        
        if (isInteractive) {
          return; // Не перехватываем событие на интерактивных элементах
        }
        
        // Проверяем, достигли ли мы границ прокрутки
        const isAtTop = target.scrollTop <= 0;
        const isAtBottom = target.scrollTop >= target.scrollHeight - target.clientHeight;
        
        // Если прокрутка вверх и мы наверху, или вниз и мы внизу - не перехватываем
        if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
          return;
        }
        
        target.scrollTop += e.deltaY;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    panelContent.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      panelContent.removeEventListener("wheel", handleWheel);
    };
  }, [showRightPanel, rightPanelTab]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const storedTimestamp = window.localStorage.getItem("nimble-editor:last-save");
    if (storedTimestamp) {
      const formatted = formatSaveTimestamp(storedTimestamp);
      startTransition(() => {
        setSaveMessage(
          formatted ? `Последнее сохранение: ${formatted}` : "Изменения сохраняются локально в браузере"
        );
      });
    } else {
      startTransition(() => {
        setSaveMessage("Изменения сохраняются локально в браузере");
      });
    }
  }, []);

  useEffect(() => {
    if (!isPreviewOpen) {
      startTransition(() => {
        setPreviewHtml("");
      });
      return;
    }
    if (!editorInstance) {
      return;
    }
    const html = editorInstance.getHtml() || "";
    const css = editorInstance.getCss() || "";
    const documentMarkup = buildPreviewDocument(html, css);
    startTransition(() => {
      setPreviewHtml(documentMarkup);
    });
  }, [isPreviewOpen, editorInstance]);

  useEffect(() => {
    if (!isPreviewOpen || !previewHtml || !previewIframeRef.current) return;
    const iframe = previewIframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(previewHtml);
      doc.close();
    }
  }, [isPreviewOpen, previewHtml]);

  useEffect(() => {
    if (!isPreviewOpen) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isPreviewOpen]);

  const handleOpenPreview = () => {
    if (!editorInstance) return;
    setPreviewDevice("desktop");
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const openPreviewInNewTab = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const handleSave = async () => {
    if (!editorInstance) return;
    
    if (projectId && !currentProject && isAuthenticated) {
      const numericProjectId = Number(projectId);
      if (isNaN(numericProjectId) || numericProjectId <= 0) {
        console.warn("Невалидный ID проекта для сохранения:", projectId);
        setSaveStatus("error");
        setSaveMessage("Невалидный ID проекта. Попробуйте обновить страницу.");
        setTimeout(() => setSaveStatus("idle"), 5000);
        return;
      }
      
      try {
        const project = await getProject(numericProjectId);
        setCurrentProject(project);
      } catch (error) {
        if (error) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
              ? error.message
              : typeof error === 'object' && error !== null && 'detail' in error && typeof error.detail === 'string'
                ? error.detail
                : 'Неизвестная ошибка';
          if (errorMessage && errorMessage !== 'Неизвестная ошибка') {
            console.error("Ошибка загрузки проекта для сохранения:", errorMessage);
          }
        }
        setSaveStatus("error");
        setSaveMessage("Не удалось загрузить проект. Попробуйте обновить страницу.");
        setTimeout(() => setSaveStatus("idle"), 5000);
        return;
      }
    }
    
    // Если проект уже существует, сохраняем его
    if (currentProject && isAuthenticated) {
      setSaveStatus("saving");
      try {
        const maybePromise = editorInstance.store();
        if (maybePromise && typeof (maybePromise as Promise<unknown>).then === "function") {
          await maybePromise;
        }
        const htmlSnapshot = editorInstance.getHtml() || "";
        const cssSnapshot = editorInstance.getCss() || "";
        const componentCollection =
          typeof editorInstance.getComponents === "function" ? editorInstance.getComponents() : null;
        const componentsSnapshot = componentCollection && typeof componentCollection.toJSON === "function"
          ? componentCollection.toJSON()
          : componentCollection ?? [];
        
        // Сохранение проекта
        
        const updatedProject = await updateProject(currentProject.id, {
          html_content: htmlSnapshot,
          css_content: cssSnapshot,
          json_content: componentsSnapshot as Record<string, unknown>,
          header_settings: headerSettings as unknown as Record<string, unknown>,
          footer_settings: footerSettings as unknown as Record<string, unknown>,
        });
        
        setCurrentProject(updatedProject);
        
        const timestamp = new Date().toISOString();
        if (typeof window !== "undefined") {
          window.localStorage.setItem("nimble-editor:last-save", timestamp);
        }
        const formatted = formatSaveTimestamp(timestamp);
        setSaveMessage(
          formatted ? `Последнее сохранение: ${formatted}` : "Проект сохранен"
        );
        setSaveStatus("saved");
        setTimeout(() => {
          setSaveStatus("idle");
        }, 3200);
      } catch (error: any) {
        console.error("Ошибка сохранения проекта", error);
        const errorMessage = error?.detail || error?.message || "Не удалось сохранить проект. Попробуйте ещё раз.";
        setSaveStatus("error");
        setSaveMessage(errorMessage);
        setTimeout(() => {
          setSaveStatus("idle");
        }, 5000);
      }
      return;
    }
    
    // Если проекта нет, открываем модальное окно для сохранения
    if (isAuthenticated) {
      setShowSaveModal(true);
    } else {
      // Локальное сохранение для неавторизованных
      setSaveStatus("saving");
      try {
        const maybePromise = editorInstance.store();
        if (maybePromise && typeof (maybePromise as Promise<unknown>).then === "function") {
          await maybePromise;
        }
        const htmlSnapshot = editorInstance.getHtml() || "";
        const cssSnapshot = editorInstance.getCss() || "";
        const componentCollection =
          typeof editorInstance.getComponents === "function" ? editorInstance.getComponents() : null;
        const componentsSnapshot = componentCollection && typeof componentCollection.toJSON === "function"
          ? componentCollection.toJSON()
          : componentCollection ?? [];
        const timestamp = new Date().toISOString();
        if (typeof window !== "undefined") {
          window.localStorage.setItem("nimble-editor:last-save", timestamp);
          window.localStorage.setItem(
            "nimble-editor:snapshot",
            JSON.stringify({ html: htmlSnapshot, css: cssSnapshot, timestamp })
          );
          window.localStorage.setItem("gjs-components", JSON.stringify(componentsSnapshot));
          window.localStorage.setItem("gjs-css", cssSnapshot);
          window.localStorage.setItem("gjs-html", htmlSnapshot);
        }
        const formatted = formatSaveTimestamp(timestamp);
        setSaveMessage(
          formatted ? `Последнее сохранение: ${formatted}` : "Изменения сохранены локально"
        );
        setSaveStatus("saved");
        setTimeout(() => {
          setSaveStatus("idle");
        }, 3200);
      } catch (error) {
        console.error("Ошибка сохранения редактора", error);
        setSaveStatus("error");
        setSaveMessage("Не удалось сохранить. Попробуйте ещё раз.");
        setTimeout(() => {
          setSaveStatus("idle");
        }, 5000);
      }
    }
  };

  const handleSaveProject = async (data: { title: string; slug: string; description?: string }) => {
    if (!editorInstance) return;
    
    setSaveStatus("saving");
    try {
      // Проверяем подписку перед созданием нового проекта
      if (!currentProject) {
        try {
          const subscription = await getSubscription();
          if (!subscription.can_create_more) {
            const limit = subscription.project_limit === -1 ? 'неограниченно' : subscription.project_limit;
            const message = subscription.project_limit === -1 
              ? "Не удалось создать проект. Обратитесь в поддержку."
              : `Достигнут лимит проектов для бесплатной подписки (${limit} проекта). Перейдите на премиум подписку для создания неограниченного количества проектов.`;
            setNotification({
              message,
              type: "error",
              action: {
                label: "Перейти на премиум",
                href: "/subscription",
              },
            });
            setSaveStatus("idle");
            return;
          }
        } catch (subError) {
          console.error("Ошибка проверки подписки", subError);
          // Продолжаем создание проекта, если не удалось проверить подписку
        }
      }
      
      const maybePromise = editorInstance.store();
      if (maybePromise && typeof (maybePromise as Promise<unknown>).then === "function") {
        await maybePromise;
      }
      const htmlSnapshot = editorInstance.getHtml() || "";
      const cssSnapshot = editorInstance.getCss() || "";
      const componentCollection =
        typeof editorInstance.getComponents === "function" ? editorInstance.getComponents() : null;
      const componentsSnapshot = componentCollection && typeof componentCollection.toJSON === "function"
        ? componentCollection.toJSON()
        : componentCollection ?? [];
      
      let project: Project;
      
      if (currentProject && currentProject.id) {
        // Обновляем существующий проект
        project = await updateProject(currentProject.id, {
          title: data.title,
          slug: data.slug,
          description: data.description,
          html_content: htmlSnapshot,
          css_content: cssSnapshot,
          json_content: componentsSnapshot as Record<string, unknown>,
          header_settings: headerSettings as unknown as Record<string, unknown>,
          footer_settings: footerSettings as unknown as Record<string, unknown>,
        });
      } else {
        // Создаем новый проект
        project = await createProject({
          title: data.title,
          slug: data.slug,
          description: data.description,
          html_content: htmlSnapshot,
          css_content: cssSnapshot,
          json_content: componentsSnapshot as Record<string, unknown>,
          header_settings: headerSettings as unknown as Record<string, unknown>,
          footer_settings: footerSettings as unknown as Record<string, unknown>,
          is_published: false,
          is_public: true,
        });
      }
      
      setCurrentProject(project);
      
      // Обновляем URL, чтобы при следующем сохранении проект был найден
      if (project.id && typeof project.id === 'number' && !isNaN(project.id) && project.id > 0) {
        router.replace(`/editor?project=${project.id}`, { scroll: false });
      } else {
        console.error("Получен невалидный ID проекта:", project.id);
      }
      
      const timestamp = new Date().toISOString();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("nimble-editor:last-save", timestamp);
      }
      const formatted = formatSaveTimestamp(timestamp);
      setSaveMessage(
        formatted ? `Последнее сохранение: ${formatted}` : "Проект сохранен"
      );
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3200);
    } catch (error: any) {
      console.error("Ошибка сохранения проекта", error);
      
      // Обработка ошибок валидации (например, дублирующийся slug)
      let errorMessage = "Не удалось сохранить проект. Попробуйте ещё раз.";
      
      if (error?.slug && Array.isArray(error.slug)) {
        errorMessage = error.slug[0] || errorMessage;
      } else if (error?.slug && typeof error.slug === 'string') {
        errorMessage = error.slug;
      } else if (error?.detail) {
        if (typeof error.detail === 'string') {
          errorMessage = error.detail;
        } else if (typeof error.detail === 'object' && error.detail.slug) {
          errorMessage = Array.isArray(error.detail.slug) ? error.detail.slug[0] : error.detail.slug;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      setSaveStatus("error");
      setSaveMessage(errorMessage);
      setTimeout(() => {
        setSaveStatus("idle");
      }, 5000);
      throw error;
    }
  };

  const handleClearCanvas = () => {
    setShowClearConfirm(true);
  };

  const confirmClearCanvas = () => {
    if (!editorInstance) return;
    editorInstance.setComponents("");
    handleSave();
    setShowClearConfirm(false);
  };

  const previewViewportClass = useMemo(() => {
    return `editor-preview-canvas ${previewDevice === "mobile" ? "is-mobile" : "is-desktop"}`;
  }, [previewDevice]);

  // Функция отмены вставки блока
  const cancelBlockInsertion = () => {
    document.querySelectorAll('.gjs-block.selected-mobile').forEach(el => {
      el.classList.remove('selected-mobile');
    });
    
    const canvasEl = document.querySelector('.gjs-cv-canvas');
    if (canvasEl) {
      canvasEl.classList.remove('mobile-insert-mode');
    }
    
    setSelectedBlock(null);
    hideMobileHint();
  };

  // НЕ сбрасываем выбор при закрытии панели - выбор сохраняется для вставки

  // Блокировка прокрутки body при открытых панелях на мобильных
  useEffect(() => {
    if (showLeftPanel || showRightPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showLeftPanel, showRightPanel]);

  // Обработка Escape для модального окна подтверждения очистки
  useEffect(() => {
    if (!showClearConfirm) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowClearConfirm(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [showClearConfirm]);

  // Если не авторизован, показываем экран с требованием авторизации
  const userInitial = user?.username?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? "A";
  const panelStyle = { height: `calc(100vh - ${topbarHeight}px)`, top: `${topbarHeight}px` };
  const overlayStyle = { top: `${topbarHeight}px` };
  const saveButtonLabel =
    saveStatus === "saving"
      ? "Сохраняю..."
      : saveStatus === "saved"
        ? "Сохранено"
        : saveStatus === "error"
          ? "Ошибка"
          : "Сохранить";
 
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-linear-to-b from-[#050505] to-[#000000] text-white">
        <div className="text-center max-w-md mx-auto px-4 relative z-10">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-3 text-white">Требуется авторизация</h1>
            <p className="text-white/60 text-base leading-relaxed">
              Для использования конструктора необходимо войти в аккаунт или зарегистрироваться
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setAuthModalMode('login');
              }}
              className="px-6 py-3 border border-white/20 text-white rounded-xl font-semibold hover:border-white/40 hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Войти
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
              }}
              className="px-6 py-3 bg-linear-to-r from-white to-white/95 text-black rounded-xl font-semibold hover:from-white/95 hover:to-white/90 transition-all shadow-lg shadow-white/10"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
        <AuthModal
          isOpen
          onClose={() => {
            // Если пользователь закрывает модальное окно без авторизации, перенаправляем на главную
            router.push('/');
          }}
          initialMode={authModalMode}
        />
      </div>
    );
  }

  // Показываем загрузку, пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          action={notification.action}
          onClose={() => setNotification(null)}
          duration={8000}
        />
      )}
      <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-[#1a1a22] via-[#101016] to-[#09090d] text-slate-50 overflow-hidden">
      <header ref={topbarRef} className="bg-[rgba(10,10,14,0.82)] border-b border-white/6 shadow-[0_18px_46px_rgba(3,3,5,0.65)] backdrop-blur-[28px] backdrop-saturate-[185%] transition-all duration-300 relative z-[60]">
        <div className="flex items-center justify-between px-[clamp(18px,3.6vw,36px)] py-[clamp(14px,2.6vw,22px)] gap-[clamp(18px,3vw,32px)] flex-wrap">
          <div className="flex items-center gap-[clamp(16px,2vw,26px)]" style={{ marginLeft: '56px' }}>
            <Link href="/" className="inline-flex items-center justify-center w-[clamp(44px,4vw,52px)] h-[clamp(44px,4vw,52px)] rounded-[14px] bg-transparent border-none shadow-none transition-transform duration-[250ms] hover:-translate-y-0.5" aria-label="На главную">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 4L32 12V28L20 36L8 28V12L20 4Z"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M14 20L20 14L26 20L20 26L14 20Z"
                  fill="white"
                  fillOpacity="0.9"
                />
                <path
                  d="M10 12L20 8L30 12M10 28L20 32L30 28"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity="0.7"
                />
              </svg>
            </Link>
            <div className="flex flex-col gap-1.5">
              <span className="text-[clamp(18px,2.6vw,24px)] font-bold tracking-[0.035em] text-slate-50">Nimble</span>
              <span className="text-[clamp(12px,1.5vw,13px)] uppercase tracking-[0.12em] text-slate-200/55">Режим конструктора</span>
            </div>
          </div>
          <div className="flex items-center gap-[clamp(12px,1.8vw,20px)] flex-wrap">
            <button
              type="button"
              className={`inline-flex items-center justify-center w-[38px] h-[38px] rounded-xl border-transparent transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none ${
                saveStatus === "saved" 
                  ? "bg-gradient-to-br from-green-500 to-green-600 text-[#022c22] shadow-[0_8px_16px_rgba(34,197,94,0.1)] hover:shadow-[0_8px_16px_rgba(34,197,94,0.11)] hover:from-green-400 hover:to-green-500" 
                  : saveStatus === "error"
                  ? "bg-gradient-to-br from-orange-500 to-red-500 text-[#1b100f] shadow-[0_8px_16px_rgba(239,68,68,0.1)] hover:shadow-[0_8px_16px_rgba(239,68,68,0.11)] hover:from-orange-400 hover:to-red-400"
                  : "bg-slate-50 text-[#0b0d16] shadow-[0_8px_16px_rgba(248,250,252,0.05)] hover:shadow-[0_8px_16px_rgba(248,250,252,0.053)] hover:bg-white"
              }`}
              onClick={handleSave}
              disabled={!editorReady || saveStatus === "saving"}
              aria-label={saveButtonLabel}
              title={saveButtonLabel}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 3h14l2 3v15a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                <path d="M15 3v6H9V3" />
                <path d="M17 21v-8H7v8" />
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-[18px] py-2.5 rounded-xl border border-white/16 bg-white/4 text-slate-50/82 text-[13px] font-medium tracking-[0.01em] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/32 hover:bg-white/8 hover:text-white shadow-[0_8px_16px_rgba(255,255,255,0.04)] hover:shadow-[0_8px_16px_rgba(255,255,255,0.044)] disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none"
              onClick={handleOpenPreview}
              disabled={!editorReady}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Предпросмотр
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-[18px] py-2.5 rounded-xl border border-white/16 bg-white/4 text-slate-50/82 text-[13px] font-medium tracking-[0.01em] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/32 hover:bg-white/8 hover:text-white shadow-[0_8px_16px_rgba(255,255,255,0.04)] hover:shadow-[0_8px_16px_rgba(255,255,255,0.044)] disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none"
              onClick={() => {
                if (editorInstance) {
                  setShowExportPreview(true);
                }
              }}
              disabled={!editorReady}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3v12" />
                <path d="M7 11l5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              Экспорт
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-[18px] py-2.5 rounded-xl border border-white/16 bg-white/4 text-slate-50/82 text-[13px] font-medium tracking-[0.01em] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/32 hover:bg-white/8 hover:text-white shadow-[0_8px_16px_rgba(255,255,255,0.04)] hover:shadow-[0_8px_16px_rgba(255,255,255,0.044)] disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none"
              onClick={() => {
                if (editorInstance) {
                  setShowDeployModal(true);
                }
              }}
              disabled={!editorReady}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              Развернуть на сервере
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-[18px] py-2.5 rounded-xl border border-white/16 bg-white/4 text-slate-50/82 text-[13px] font-medium tracking-[0.01em] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/32 hover:bg-white/8 hover:text-white shadow-[0_8px_16px_rgba(255,255,255,0.04)] hover:shadow-[0_8px_16px_rgba(255,255,255,0.044)] disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none"
              onClick={() => setShowThemeModal(true)}
              disabled={!editorReady}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              Палитры
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 px-[18px] py-2.5 rounded-xl border border-white/16 bg-white/4 text-slate-50/82 text-[13px] font-medium tracking-[0.01em] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/32 hover:bg-white/8 hover:text-white shadow-[0_8px_16px_rgba(255,255,255,0.04)] hover:shadow-[0_8px_16px_rgba(255,255,255,0.044)]"
              onClick={() => setShowRightPanel(!showRightPanel)}
              aria-label="Переключить панель стилей"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 21v-7" />
                <path d="M4 10V3" />
                <path d="M12 21v-9" />
                <path d="M12 8V3" />
                <path d="M20 21v-5" />
                <path d="M20 12V3" />
                <rect x="2" y="10" width="4" height="4" rx="1" />
                <rect x="10" y="13" width="4" height="4" rx="1" />
                <rect x="18" y="16" width="4" height="4" rx="1" />
              </svg>
              Стили
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-xl border border-red-400/35 bg-red-500/15 text-red-200 shadow-[0_8px_16px_rgba(239,68,68,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:border-red-400/50 hover:bg-red-500/25 hover:text-red-100 hover:shadow-[0_8px_16px_rgba(239,68,68,0.066)] disabled:opacity-45 disabled:cursor-not-allowed disabled:transform-none"
              onClick={handleClearCanvas}
              disabled={!editorReady}
              aria-label="Очистить"
              title="Очистить"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18" />
                <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6l1-3h4l1 3" />
              </svg>
            </button>
            {user && (
              <div className="editor-user-group">
                <Link
                  href="/profile"
                  className="user-avatar-circle"
                  title={user.username || user.email || "Профиль"}
                >
                  {userInitial}
                </Link>
                <button
                  type="button"
                  className="editor-logout-button"
                  aria-label="Выйти"
                  onClick={logout}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        {saveMessage && (
          <div
            className={`editor-save-indicator ${
              saveStatus === "error" ? "is-error" : saveStatus === "saved" ? "is-success" : ""
            }`}
          >
            {saveMessage}
          </div>
        )}
      </header>

      <div className="editor-body flex-1 flex overflow-hidden relative">
        {/* Левая вертикальная панель с иконками (Webflow style) */}
        <div className="editor-left-sidebar">
          <div className="editor-sidebar-icons">
            <button
              type="button"
              className={`editor-sidebar-icon ${showLeftPanel ? "is-active" : ""}`}
              onClick={() => setShowLeftPanel(!showLeftPanel)}
              title="Элементы"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              type="button"
              className="editor-sidebar-icon"
              title="Навигатор"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <button
              type="button"
              className={`editor-sidebar-icon ${showRightPanel ? "is-active" : ""}`}
              onClick={() => setShowRightPanel(!showRightPanel)}
              title="Стили"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Панель элементов (открывается слева) */}
        <aside
          className={`editor-panel editor-panel--left webflow-style ${showLeftPanel ? "is-open" : ""}`}
          style={panelStyle}
        >
          <div className="webflow-panel-header">
            <h3 className="webflow-panel-title">Элементы</h3>
            <button
              type="button"
              className="webflow-panel-close"
              onClick={() => setShowLeftPanel(false)}
              aria-label="Закрыть"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="blocks-panel">
            <div className="blocks-panel-header">
              <div className="blocks-panel-search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.65" y1="16.65" x2="21" y2="21" />
                </svg>
                <input
                  type="text"
                  value={blockSearch}
                  onChange={(e) => setBlockSearch(e.target.value)}
                  placeholder="Поиск элементов"
                />
                {blockSearch && (
                  <button
                    type="button"
                    onClick={() => setBlockSearch("")}
                    aria-label="Очистить поиск"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="blocks-panel-body">
              <div className="blocks-container"></div>
            </div>
          </div>
        </aside>

        <div className="editor-canvas" style={{ position: "relative" }}>
          <div ref={editorRef} className="gjs-editor h-full w-full"></div>
          {editorReady && editorInstance && selectedComponent && (
            <>
              <InlineStylePanel editor={editorInstance} selectedComponent={selectedComponent} />
              <InlineThemeSelector editor={editorInstance} />
            </>
          )}
        </div>

        <aside
          className={`editor-panel editor-panel--right webflow-style ${showRightPanel ? "is-open" : ""}`}
          style={panelStyle}
        >
          <div className="webflow-panel-header">
            <div className="webflow-panel-tabs">
              <button
                type="button"
                className={`webflow-panel-tab ${rightPanelTab === 'style' ? 'is-active' : ''}`}
                onClick={() => setRightPanelTab('style')}
              >
                Стиль
              </button>
              <button
                type="button"
                className={`webflow-panel-tab ${rightPanelTab === 'settings' ? 'is-active' : ''}`}
                onClick={() => setRightPanelTab('settings')}
              >
                HTML-Структура
              </button>
              <button
                type="button"
                className={`webflow-panel-tab ${rightPanelTab === 'interactions' ? 'is-active' : ''}`}
                onClick={() => setRightPanelTab('interactions')}
              >
                Взаимодействия
              </button>
            </div>
            <button
              type="button"
              className="webflow-panel-close"
              onClick={() => setShowRightPanel(false)}
              aria-label="Закрыть"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="webflow-panel-content" ref={rightPanelContentRef}>
            {rightPanelTab === 'style' && (
              <div className="webflow-panel-section">
                {selectedComponent && (
                  <div className="webflow-element-info">
                    <div className="webflow-element-name">
                      {selectedComponent.get('tagName')?.toUpperCase() || 'Element'} {selectedComponent.get('type') === 'text' ? 'Text' : selectedComponent.get('type') || ''}
                    </div>
                    <div className="webflow-class-info">
                    </div>
                  </div>
                )}
                <div className="styles-container">
                  {editorReady && editorInstance && <StylePanel editor={editorInstance} />}
                </div>
              </div>
            )}
            {rightPanelTab === 'settings' && (
              <div className="webflow-panel-section">
                <div className="html-structure-wrapper">
                  {editorReady && editorInstance && <HTMLStructure editor={editorInstance} />}
                </div>
              </div>
            )}
            {rightPanelTab === 'interactions' && (
              <div className="webflow-panel-section">
                {editorReady && editorInstance && (
                  <InteractionsPanel 
                    editor={editorInstance} 
                    selectedComponent={selectedComponent} 
                  />
                )}
              </div>
            )}
          </div>
        </aside>

        {(showLeftPanel || showRightPanel) && (
          <div
            className="editor-panel-overlay md:hidden"
            style={overlayStyle}
            onClick={() => {
              setShowLeftPanel(false);
              setShowRightPanel(false);
            }}
          />
        )}
      </div>
 
       {selectedBlock && isMobileMode && (
         <button
           type="button"
           onClick={cancelBlockInsertion}
           className="mobile-cancel-insert fixed bottom-4 right-4 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
           style={{ zIndex: 10001 }}
           aria-label="Отменить вставку блока"
         >
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
             <path d="M18 6L6 18M6 6l12 12" />
           </svg>
         </button>
       )}


      {editorReady && editorInstance && (
        <ExportPreviewModal
          isOpen={showExportPreview}
          onClose={() => setShowExportPreview(false)}
          editor={editorInstance}
          headerSettings={headerSettings}
          footerSettings={footerSettings}
        />
      )}

      {editorReady && editorInstance && (
        <DeployModal
          isOpen={showDeployModal}
          onClose={() => setShowDeployModal(false)}
          editor={editorInstance}
          projectId={currentProject?.id || null}
        />
      )}

      {editorReady && editorInstance && (
        <ThemeModal
          isOpen={showThemeModal}
          onClose={() => setShowThemeModal(false)}
          editor={editorInstance}
        />
      )}

      <SaveProjectModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveProject}
        initialTitle={currentProject?.title || ""}
        initialSlug={currentProject?.slug || ""}
        initialDescription={currentProject?.description || ""}
        isSaving={saveStatus === "saving"}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
        }}
        initialMode={authModalMode}
      />

      <TemplateChoiceModal
        isOpen={showTemplateChoice}
        onClose={() => setShowTemplateChoice(false)}
        onChooseBlank={handleChooseBlank}
      />

      {showClearConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowClearConfirm(false)}
            aria-hidden="true"
          />
          <div 
            className="relative bg-gradient-to-br from-red-950/60 via-red-900/50 to-red-950/60 border border-red-500/25 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[0_24px_48px_rgba(239,68,68,0.2)] backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-confirm-title"
            aria-describedby="clear-confirm-description"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-400/30 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-200">
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                </svg>
              </div>
            </div>
            <h2 id="clear-confirm-title" className="text-2xl sm:text-3xl font-bold text-red-50 mb-3 text-center">
              Очистить весь сайт?
            </h2>
            <p id="clear-confirm-description" className="text-red-100/70 text-center mb-8 leading-relaxed">
              Это действие удалит все элементы со страницы. Это нельзя отменить.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-6 py-3 rounded-xl border border-red-400/20 bg-red-900/20 text-red-50 font-semibold transition-all duration-200 hover:bg-red-900/35 hover:border-red-400/35 hover:text-white"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={confirmClearCanvas}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500/80 to-red-600/80 text-white font-semibold shadow-[0_8px_24px_rgba(239,68,68,0.25)] transition-all duration-200 hover:from-red-500 hover:to-red-600 hover:shadow-[0_12px_32px_rgba(239,68,68,0.35)] hover:-translate-y-0.5"
              >
                Очистить
              </button>
            </div>
          </div>
        </div>
      )}
 
       {isPreviewOpen && (
         <div className="editor-preview-overlay">
          <div className="editor-preview-topbar">
            <div className="editor-preview-url">
              <div className="editor-preview-url__icon">◎</div>
              <span className="editor-preview-url__text">Предпросмотр страницы</span>
              <button type="button" className="editor-preview-url__open" onClick={openPreviewInNewTab}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 3h7v7" />
                  <path d="M10 14 21 3" />
                  <path d="M5 5h6" />
                  <path d="M5 5v14h14v-6" />
                </svg>
              </button>
            </div>
            <div className="editor-preview-controls">
              <div className="editor-preview-devices">
                <button
                  type="button"
                  className={`editor-preview-device ${previewDevice === "desktop" ? "is-active" : ""}`}
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 4h18v12H3z" />
                    <path d="M7 20h10" />
                    <path d="M12 16v4" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`editor-preview-device ${previewDevice === "mobile" ? "is-active" : ""}`}
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="7" y="2" width="10" height="20" rx="2" />
                    <path d="M11 18h2" />
                  </svg>
                </button>
              </div>
              <button type="button" className="editor-preview-return" onClick={handleClosePreview}>
                Вернуться в редактор
              </button>
            </div>
          </div>
          <div className="editor-preview-stage">
            <div className={previewViewportClass}>
              <iframe
                ref={previewIframeRef}
                title="Предпросмотр страницы"
                className="editor-preview-frame"
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

function buildPreviewDocument(html: string, css: string) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Предпросмотр</title>
  <style>
    ${css}
  </style>
</head>
<body>
${html}
</body>
</html>`;
}

function formatSaveTimestamp(timestamp: string): string | null {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "long",
  });
  return formatter.format(date);
}

export default function Editor() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <div className="text-white/50">Загрузка редактора...</div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}

