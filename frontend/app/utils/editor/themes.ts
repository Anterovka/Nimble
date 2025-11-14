import type { Component as GrapesComponent, Editor as GrapesEditor } from "grapesjs";

const withAlpha = (color: string, alpha: number) => {
  const boundedAlpha = Math.min(Math.max(alpha, 0), 1);
  if (color.startsWith("#") && color.length === 7) {
    const alphaHex = Math.round(boundedAlpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `${color}${alphaHex}`;
  }
  return color;
};

export interface ThemeStyle {
  name: string;
  description: string;
  styles: Record<string, string>;
  category: string;
}

export interface ProjectTheme {
  id: string;
  name: string;
  description: string;
  background: string; // Фон страницы
  text: string; // Основной цвет текста
  primary: string; // Основной акцентный цвет
  secondary: string; // Вторичный акцентный цвет
  surface: string; // Фон карточек/поверхностей
  surfaceText: string; // Текст на поверхностях
  border: string; // Цвет границ
  buttonPrimary: string; // Фон основной кнопки
  buttonPrimaryText: string; // Текст основной кнопки
  buttonSecondary: string; // Фон вторичной кнопки
  buttonSecondaryText: string; // Текст вторичной кнопки
}

export const projectThemes: ProjectTheme[] = [
  {
    id: "dark",
    name: "Темная",
    description: "Темный фон, светлый текст",
    background: "#0f172a",
    text: "#f1f5f9",
    primary: "#6366f1",
    secondary: "#818cf8",
    surface: "#1e293b",
    surfaceText: "#f1f5f9",
    border: "#334155",
    buttonPrimary: "#6366f1",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#1e293b",
    buttonSecondaryText: "#f1f5f9",
  },
  {
    id: "light",
    name: "Светлая",
    description: "Светлый фон, темный текст",
    background: "#ffffff",
    text: "#1f2937",
    primary: "#3b82f6",
    secondary: "#60a5fa",
    surface: "#f9fafb",
    surfaceText: "#1f2937",
    border: "#e5e7eb",
    buttonPrimary: "#3b82f6",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#f3f4f6",
    buttonSecondaryText: "#1f2937",
  },
  {
    id: "blue",
    name: "Синяя",
    description: "Синий фон, светлый текст",
    background: "#1e3a8a",
    text: "#ffffff",
    primary: "#60a5fa",
    secondary: "#93c5fd",
    surface: "#1e40af",
    surfaceText: "#ffffff",
    border: "#3b82f6",
    buttonPrimary: "#60a5fa",
    buttonPrimaryText: "#1e3a8a",
    buttonSecondary: "#1e40af",
    buttonSecondaryText: "#ffffff",
  },
  {
    id: "green",
    name: "Зеленая",
    description: "Зеленый фон, светлый текст",
    background: "#065f46",
    text: "#ffffff",
    primary: "#34d399",
    secondary: "#6ee7b7",
    surface: "#047857",
    surfaceText: "#ffffff",
    border: "#10b981",
    buttonPrimary: "#34d399",
    buttonPrimaryText: "#065f46",
    buttonSecondary: "#047857",
    buttonSecondaryText: "#ffffff",
  },
  {
    id: "orange",
    name: "Оранжевая",
    description: "Оранжевый фон, темный текст",
    background: "#fff7ed",
    text: "#7c2d12",
    primary: "#f97316",
    secondary: "#fb923c",
    surface: "#ffedd5",
    surfaceText: "#7c2d12",
    border: "#fdba74",
    buttonPrimary: "#f97316",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#ffedd5",
    buttonSecondaryText: "#7c2d12",
  },
  {
    id: "pink",
    name: "Розовая",
    description: "Розовый фон, темный текст",
    background: "#fdf2f8",
    text: "#831843",
    primary: "#f472b6",
    secondary: "#f9a8d4",
    surface: "#fce7f3",
    surfaceText: "#831843",
    border: "#fbcfe8",
    buttonPrimary: "#f472b6",
    buttonPrimaryText: "#ffffff",
    buttonSecondary: "#fce7f3",
    buttonSecondaryText: "#831843",
  },
  {
    id: "purple",
    name: "Фиолетовая",
    description: "Фиолетовый фон, светлый текст",
    background: "#581c87",
    text: "#ffffff",
    primary: "#a78bfa",
    secondary: "#c4b5fd",
    surface: "#6b21a8",
    surfaceText: "#ffffff",
    border: "#9333ea",
    buttonPrimary: "#a78bfa",
    buttonPrimaryText: "#581c87",
    buttonSecondary: "#6b21a8",
    buttonSecondaryText: "#ffffff",
  },
  {
    id: "red",
    name: "Красная",
    description: "Красный фон, светлый текст",
    background: "#7f1d1d",
    text: "#ffffff",
    primary: "#f87171",
    secondary: "#fca5a5",
    surface: "#991b1b",
    surfaceText: "#ffffff",
    border: "#dc2626",
    buttonPrimary: "#f87171",
    buttonPrimaryText: "#7f1d1d",
    buttonSecondary: "#991b1b",
    buttonSecondaryText: "#ffffff",
  },
];

export const defaultThemeId = projectThemes[0].id;

export const buttonThemes: ThemeStyle[] = [
  {
    name: "Современная основная",
    description: "Градиентная кнопка с тенью",
    category: "Кнопки",
    styles: {
      padding: "14px 28px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#ffffff",
      border: "none",
      borderRadius: "12px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
      transition: "all 0.3s ease",
    },
  },
  {
    name: "Минималистичная",
    description: "Простая кнопка с рамкой",
    category: "Кнопки",
    styles: {
      padding: "12px 24px",
      background: "transparent",
      color: "#667eea",
      border: "2px solid #667eea",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "15px",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
  },
  {
    name: "Темная",
    description: "Темная кнопка с эффектом свечения",
    category: "Кнопки",
    styles: {
      padding: "14px 28px",
      background: "#1a1a1a",
      color: "#ffffff",
      border: "1px solid #333",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
      transition: "all 0.3s ease",
    },
  },
  {
    name: "Неоморфизм",
    description: "Современный неоморфный стиль",
    category: "Кнопки",
    styles: {
      padding: "14px 28px",
      background: "#f0f0f0",
      color: "#333",
      border: "none",
      borderRadius: "16px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      boxShadow: "8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff",
      transition: "all 0.3s ease",
    },
  },
];

export const cardThemes: ThemeStyle[] = [
  {
    name: "Стеклянная карточка",
    description: "Эффект стекла с размытием",
    category: "Карточки",
    styles: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "20px",
      padding: "24px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    },
  },
  {
    name: "Современная карточка",
    description: "Чистый дизайн с тенью",
    category: "Карточки",
    styles: {
      background: "#ffffff",
      border: "none",
      borderRadius: "16px",
      padding: "28px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      transition: "all 0.3s ease",
    },
  },
  {
    name: "Темная карточка",
    description: "Темная тема с акцентом",
    category: "Карточки",
    styles: {
      background: "#1a1a1a",
      border: "1px solid #333",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      color: "#ffffff",
    },
  },
  {
    name: "Карточка с градиентом",
    description: "Яркий градиентный фон",
    category: "Карточки",
    styles: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "none",
      borderRadius: "20px",
      padding: "28px",
      boxShadow: "0 8px 30px rgba(102, 126, 234, 0.3)",
      color: "#ffffff",
    },
  },
];

export const textThemes: ThemeStyle[] = [
  {
    name: "Современный заголовок",
    description: "Крупный жирный заголовок",
    category: "Текст",
    styles: {
      fontSize: "48px",
      fontWeight: "800",
      lineHeight: "1.2",
      letterSpacing: "-0.02em",
      color: "#1a1a1a",
      margin: "0 0 16px 0",
    },
  },
  {
    name: "Элегантный текст",
    description: "Классический стиль",
    category: "Текст",
    styles: {
      fontSize: "18px",
      fontWeight: "400",
      lineHeight: "1.7",
      color: "#4a4a4a",
      fontFamily: "Georgia, serif",
    },
  },
  {
    name: "Минималистичный",
    description: "Простой и чистый",
    category: "Текст",
    styles: {
      fontSize: "16px",
      fontWeight: "400",
      lineHeight: "1.6",
      color: "#666",
      letterSpacing: "0.01em",
    },
  },
];

export const inputThemes: ThemeStyle[] = [
  {
    name: "Современное поле",
    description: "Скругленные углы и тень",
    category: "Формы",
    styles: {
      width: "100%",
      padding: "14px 18px",
      border: "2px solid #e0e0e0",
      borderRadius: "12px",
      fontSize: "15px",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
  },
  {
    name: "Минималистичное",
    description: "Тонкая рамка",
    category: "Формы",
    styles: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #ddd",
      borderBottom: "2px solid #667eea",
      borderRadius: "0",
      fontSize: "15px",
      background: "transparent",
      transition: "all 0.2s ease",
      boxSizing: "border-box",
    },
  },
  {
    name: "Темное поле",
    description: "Темная тема",
    category: "Формы",
    styles: {
      width: "100%",
      padding: "14px 18px",
      border: "1px solid #333",
      borderRadius: "10px",
      fontSize: "15px",
      background: "#1a1a1a",
      color: "#ffffff",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
  },
];

export const badgeThemes: ThemeStyle[] = [
  {
    name: "Современный бейдж",
    description: "Градиентный бейдж",
    category: "Бейджи",
    styles: {
      display: "inline-block",
      padding: "6px 14px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#ffffff",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
      boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
    },
  },
  {
    name: "Минималистичный",
    description: "Простой бейдж",
    category: "Бейджи",
    styles: {
      display: "inline-block",
      padding: "4px 12px",
      background: "#f0f0f0",
      color: "#333",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
    },
  },
];

export const allThemes: ThemeStyle[] = [
  ...buttonThemes,
  ...cardThemes,
  ...textThemes,
  ...inputThemes,
  ...badgeThemes,
];

export function applyTheme(component: GrapesComponent | null, theme: ThemeStyle) {
  if (!component) return;
  
  Object.entries(theme.styles).forEach(([property, value]) => {
    const cssProperty = property.replace(/([A-Z])/g, "-$1").toLowerCase();
    component.addStyle({ [cssProperty]: value });
  });
}

export function resetProjectTheme(editor: GrapesEditor | null) {
  if (!editor) return;

  const root = editor.getWrapper() as GrapesComponent | undefined;
  if (!root) return;

  // Удаляем CSS правила для body и .page-shell
  const Css = editor.Css;
  try {
    const allRules = Css.getAll();
    const rulesToRemove = allRules.filter((rule: any) => {
      const selectors = rule.getSelectors?.() || [];
      return selectors.includes('body') || selectors.includes('.page-shell');
    });
    rulesToRemove.forEach((rule: any) => {
      try {
        Css.remove(rule);
      } catch (e) {
        // Игнорируем ошибки
      }
    });
  } catch (e) {
    // Игнорируем ошибки
  }

  // Сбрасываем стили всех компонентов, связанные с темой
  const allComponents = root.find('*') as GrapesComponent[];
  allComponents.forEach((component) => {
    const style = component.getStyle?.() || {};
    const themeRelatedProps = [
      'background', 'background-color', 'color', 'border', 'border-color',
      'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'
    ];
    
    themeRelatedProps.forEach((prop) => {
      if (style[prop]) {
        component.removeStyle(prop);
      }
    });
  });

  // Сбрасываем стили root
  root.removeStyle('background');
  root.removeStyle('color');
  
  editor.trigger("canvas:style:update");
}

export function applyProjectTheme(editor: GrapesEditor | null, theme: ProjectTheme) {
  if (!editor) return;

  // Сначала сбрасываем предыдущую тему
  resetProjectTheme(editor);

  editor.getWrapper()?.setId("page-root");
  const root = editor.getWrapper() as GrapesComponent | undefined;
  if (!root) return;

  // Применяем background к root и body
  root.addStyle({
    background: theme.background,
    color: theme.text,
  });

  // Применяем background к body через CSS
  const Css = editor.Css;
  try {
    const allRules = Css.getAll();
    
    // Удаляем старые правила для body
    const bodyRules = allRules.filter((rule: any) => {
      const selectors = rule.getSelectors?.() || [];
      return selectors.includes('body');
    });
    bodyRules.forEach((rule: any) => {
      try {
        Css.remove(rule);
      } catch (e) {
        // Игнорируем ошибки удаления
      }
    });
    
    // Добавляем новое правило для body
    Css.add({
      selectors: ['body'],
      style: {
        background: theme.background,
        color: theme.text,
      },
    });
  } catch (e) {
    // Если не удалось через Css API, используем addStyle
    editor.addStyle(`body { background: ${theme.background} !important; color: ${theme.text} !important; }`);
  }

  // Применяем background к .page-shell
  const pageShell = root.find('.page-shell')?.[0] as GrapesComponent | undefined;
  if (pageShell) {
    const shellStyle = pageShell.getStyle?.() || {};
    const shellBg = (shellStyle.background || '').toString().toLowerCase();
    const defaultBackgrounds = ['radial-gradient', '#050505', '#0f172a', '#020510', '#111827', 'transparent', ''];
    const hasDefaultBg = defaultBackgrounds.some(bg => shellBg.includes(bg));
    
    if (hasDefaultBg || !shellBg) {
      pageShell.addStyle({
        background: theme.background,
        color: theme.text,
      });
    }
  }

  // Применяем background к .page-shell через CSS правило
  try {
    const pageShellRules = Css.getAll().filter((rule: any) => {
      const selectors = rule.getSelectors?.() || [];
      return selectors.includes('.page-shell');
    });
    pageShellRules.forEach((rule: any) => {
      try {
        Css.remove(rule);
      } catch (e) {
        // Игнорируем ошибки
      }
    });
    
    Css.add({
      selectors: ['.page-shell'],
      style: {
        background: theme.background,
        color: theme.text,
      },
    });
  } catch (e) {
    editor.addStyle(`.page-shell { background: ${theme.background} !important; color: ${theme.text} !important; }`);
  }

  // Применяем background к основным div контейнерам без явного background
  const allDivs = root.find('div') as GrapesComponent[];
  allDivs.forEach((div) => {
    const divStyle = div.getStyle?.() || {};
    const divBg = (divStyle.background || '').toString().toLowerCase();
    const divClasses = div.getClasses?.() || [];
    const isPageShell = Array.isArray(divClasses) ? divClasses.includes('page-shell') : false;
    
    if (!isPageShell) {
      const hasDefaultBg = divBg.includes('radial-gradient') || divBg.includes('#050505') || 
                          divBg.includes('#0f172a') || divBg.includes('#020510') || 
                          !divBg || divBg === 'transparent';
      
      if (hasDefaultBg && !div.getAttributes?.()?.['data-surface']) {
        const parent = div.parent();
        const parentBg = parent?.getStyle?.()?.background || '';
        if (!parentBg || parentBg.toString().toLowerCase().includes('radial-gradient') || 
            parentBg.toString().toLowerCase().includes('#050505')) {
          div.addStyle({
            background: theme.background,
          });
        }
      }
    }
  });

  // Применяем цвет текста ко всем текстовым элементам
  const textComponents = root.find('[data-gjs-type="text"], p, span, h1, h2, h3, h4, h5, h6, div, li, td, th, label') as GrapesComponent[];
  textComponents.forEach((component) => {
    const style = (component.getStyle?.() ?? {}) as Record<string, string>;
    const currentColor = (style.color || "").trim().toLowerCase();
    const tagName = component.get('tagName')?.toLowerCase() || '';
    const componentType = component.get('type') || '';
    
    // Пропускаем элементы с явно заданным цветом (не дефолтным)
    const defaultTextColors = new Set([
      "#1a1a1a", "#0f0f0f", "#0f172a", "#111827", "#1f2937",
      "#333333", "#4a4a4a", "#666666", "#f6f7fa", "#f4f5f8",
      "#000000", "#ffffff", "black", "white", "#f8fafc", "#e5e7eb"
    ]);
    
    // Применяем цвет текста, если это дефолтный цвет или цвет не задан
    if (!currentColor || defaultTextColors.has(currentColor) || 
        currentColor.includes("rgba(0,0,0") || currentColor.includes("rgb(0,0,0") ||
        currentColor.includes("rgba(255,255,255") || currentColor.includes("rgb(255,255,255")) {
      // Проверяем, не является ли элемент кнопкой или ссылкой
      if (tagName !== 'button' && tagName !== 'a' && tagName !== 'input' && tagName !== 'textarea' && tagName !== 'select') {
        component.addStyle({ color: theme.text });
      }
    }
  });

  // Применяем стили ко всем кнопкам
  const buttons = root.find("button") as GrapesComponent[];
  buttons.forEach((btn) => {
    const style = btn.getStyle?.() || {};
    const bgValue = (style.background || "").toString().toLowerCase();
    const hasGradient = bgValue.includes("gradient");
    const defaultButtonBgs = ['transparent', '', '#0f172a', '#1a1a1a', '#111827'];
    const hasDefaultBg = !bgValue || bgValue === 'transparent' || defaultButtonBgs.some(bg => bgValue.includes(bg));
    
    if (hasGradient || hasDefaultBg) {
      btn.addStyle({
        background: theme.buttonPrimary,
        color: theme.buttonPrimaryText,
        border: "none",
      });
    } else {
      btn.addStyle({
        background: theme.buttonSecondary,
        color: theme.buttonSecondaryText,
        border: `1px solid ${theme.border}`,
      });
    }
  });

  // Применяем стили ко всем ссылкам
  const links = root.find("a") as GrapesComponent[];
  links.forEach((link) => {
    const style = link.getStyle?.() || {};
    const hasBackground = Boolean(style.background || style["background-color"]);
    const currentColor = (style.color || "").toString().toLowerCase();
    const defaultLinkColors = ['#6366f1', '#3b82f6', '#60a5fa', '#818cf8', 'inherit', ''];
    const hasDefaultColor = !currentColor || defaultLinkColors.some(c => currentColor.includes(c));
    
    if (!hasBackground) {
      if (hasDefaultColor) {
        link.addStyle({ color: theme.primary });
      }
    }
  });

  // Применяем стили ко всем полям ввода
  const inputs = root.find("input, textarea, select") as GrapesComponent[];
  inputs.forEach((input) => {
    const style = input.getStyle?.() || {};
    const bgValue = (style.background || "").toString().toLowerCase();
    const defaultInputBgs = ['transparent', '', '#ffffff', '#f9fafb', '#1a1a1a', '#0f172a'];
    const hasDefaultBg = !bgValue || defaultInputBgs.some(bg => bgValue.includes(bg));
    
    if (hasDefaultBg) {
      input.addStyle({
        background: theme.surface,
        color: theme.surfaceText,
        border: `1px solid ${theme.border}`,
      });
    }
  });

  const surfaceBase = root.find('[data-surface="base"]') as GrapesComponent[];
  surfaceBase.forEach((component) => {
    component.addStyle({
      background: theme.background,
      color: theme.text,
    });
  });

  const surfaceElevated = root.find('[data-surface="elevated"]') as GrapesComponent[];
  surfaceElevated.forEach((component) => {
    component.addStyle({
      background: theme.surface,
      color: theme.surfaceText,
    });
  });

  // Применяем тему рекурсивно ко всем вложенным элементам
  const applyThemeRecursively = (component: GrapesComponent) => {
    const children = component.components();
    if (children && children.length > 0) {
      children.forEach((child: GrapesComponent) => {
        applyProjectThemeToComponent(child, theme);
        applyThemeRecursively(child);
      });
    }
  };
  
  applyThemeRecursively(root);

  (editor as any).__currentTheme = theme;

  editor.trigger("canvas:style:update");
  editor.trigger("component:update");
}

export function applyProjectThemeToComponent(component: GrapesComponent, theme: ProjectTheme) {
  if (!component) return;

  const tagName = component.get('tagName')?.toLowerCase() || '';
  const componentType = component.get('type') || '';
  const style = component.getStyle?.() || {};
  
  if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6' || 
      tagName === 'p' || tagName === 'span' || tagName === 'div' || componentType === 'text') {
    const colorValue = style.color;
    const currentColor = typeof colorValue === 'string' ? colorValue.trim().toLowerCase() : '';
    const defaultTextColors = new Set([
      '#000000', '#1a1a1a', '#0f0f0f', '#0f172a', '#111827', '#1f2937', 
      '#333333', '#4a4a4a', '#666666', '#f6f7fa', '#f4f5f8', '#ffffff', 'black', 'white'
    ]);
    
    if (!currentColor || defaultTextColors.has(currentColor) || 
        currentColor.includes('rgba(0,0,0') || currentColor.includes('rgb(0,0,0') ||
        currentColor.includes('rgba(255,255,255') || currentColor.includes('rgb(255,255,255')) {
      component.addStyle({ color: theme.text });
    }
  }

  if (tagName === 'button') {
    const bgValue = style.background || '';
    const background = typeof bgValue === 'string' ? bgValue.toLowerCase() : '';
    const hasGradient = background.includes('gradient');
    
    if (hasGradient || !background || background === 'transparent') {
      component.addStyle({
        background: theme.buttonPrimary,
        color: theme.buttonPrimaryText,
        border: 'none',
      });
    } else {
      component.addStyle({
        background: theme.buttonSecondary,
        color: theme.buttonSecondaryText,
        border: `1px solid ${theme.border}`,
      });
    }
  }

  if (tagName === 'a') {
    const hasBackground = Boolean(style.background || style['background-color']);
    if (!hasBackground) {
      component.addStyle({ color: theme.primary });
    }
  }

  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    component.addStyle({
      background: theme.surface,
      color: theme.surfaceText,
      border: `1px solid ${theme.border}`,
    });
  }

  const surfaceType = component.getAttributes?.()?.['data-surface'];
  if (surfaceType === 'base') {
    component.addStyle({
      background: theme.background,
      color: theme.text,
    });
  } else if (surfaceType === 'elevated') {
    component.addStyle({
      background: theme.surface,
      color: theme.surfaceText,
    });
  }

  const children = component.components();
  if (children && children.length > 0) {
    children.forEach((child: GrapesComponent) => {
      applyProjectThemeToComponent(child, theme);
    });
  }
}
