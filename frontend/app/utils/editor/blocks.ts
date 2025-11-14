import type { Editor } from "grapesjs";

const createBlockPreview = (content: string | { type: string; src?: string }, label: string): string => {
  let previewHtml = "";
  
  if (typeof content === "object" && content.type === "image") {
    previewHtml = `
      <div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#ffffff;border:1px solid #e0e0e0;border-radius:8px;">
        <div style="text-align:center;color:#666;font-size:10px;">📷 Изображение</div>
      </div>
    `;
  } else {
    const contentStr = typeof content === "string" ? content : "";
    const textMatch = contentStr.match(/>([^<]+)</);
    const previewText = textMatch ? textMatch[1].substring(0, 30) : label;
    
    if (contentStr.includes("<h1")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><h1 style="margin:0;font-size:18px;font-weight:700;color:#000;">${previewText}</h1></div>`;
    } else if (contentStr.includes("<h2")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><h2 style="margin:0;font-size:16px;font-weight:600;color:#000;">${previewText}</h2></div>`;
    } else if (contentStr.includes("<h3")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><h3 style="margin:0;font-size:14px;font-weight:600;color:#000;">${previewText}</h3></div>`;
    } else if (contentStr.includes("<button")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;display:flex;align-items:center;justify-content:center;"><button style="padding:8px 16px;background:#000;color:#fff;border:none;border-radius:8px;font-size:11px;font-weight:600;">${previewText || "Кнопка"}</button></div>`;
    } else if (contentStr.includes("<a")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><a href="#" style="color:#000;text-decoration:underline;font-size:12px;">${previewText || "Ссылка"}</a></div>`;
    } else if (contentStr.includes("<ul") || contentStr.includes("<ol")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><ul style="margin:0;padding-left:16px;font-size:11px;color:#000;"><li>${previewText || "Элемент списка"}</li></ul></div>`;
    } else if (contentStr.includes("<div") && contentStr.includes("row")) {
      const cellCount = (contentStr.match(/class="cell"/g) || []).length;
      if (cellCount === 1) {
        previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="display:flex;gap:4px;"><div style="flex:1;height:40px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;"></div></div></div>`;
      } else if (cellCount === 3) {
        previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="display:flex;gap:4px;"><div style="flex:1;height:40px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;"></div><div style="flex:1;height:40px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;"></div><div style="flex:1;height:40px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;"></div></div></div>`;
      } else {
        previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="display:flex;gap:4px;"><div style="flex:1;height:40px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;"></div><div style="flex:1;height:40px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;"></div></div></div>`;
      }
    } else if (contentStr.includes("blockquote")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><blockquote style="margin:0;padding-left:12px;border-left:3px solid #000;font-style:italic;color:#000;font-size:11px;">${previewText}</blockquote></div>`;
    } else if (contentStr.includes("<hr")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><hr style="border:none;border-top:2px solid #000;margin:0;"></div>`;
    } else if (contentStr.includes("<table")) {
      previewHtml = `<div style="background:#ffffff;padding:8px;border-radius:8px;border:1px solid #e0e0e0;"><table style="width:100%;font-size:9px;border-collapse:collapse;"><tr style="background:#000;color:#fff;"><th style="padding:4px;border:1px solid #000;">1</th><th style="padding:4px;border:1px solid #000;">2</th></tr><tr><td style="padding:4px;border:1px solid #000;">A</td><td style="padding:4px;border:1px solid #000;">B</td></tr></table></div>`;
    } else if (contentStr.includes("<form") || contentStr.includes("<input") || contentStr.includes("<textarea") || contentStr.includes("<select")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><input type="text" placeholder="Поле ввода" style="width:100%;padding:6px;border:1px solid #000;border-radius:6px;font-size:10px;box-sizing:border-box;"></div>`;
    } else if (contentStr.includes("card") || contentStr.includes("data-surface")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="background:#f5f5f5;padding:10px;border-radius:6px;border:1px solid #ddd;"><div style="font-size:11px;font-weight:600;color:#000;margin-bottom:4px;">Заголовок</div><div style="font-size:10px;color:#666;">Описание</div></div></div>`;
    } else if (contentStr.includes("grid") && contentStr.includes("template-columns")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;"><div style="aspect-ratio:1;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;"></div><div style="aspect-ratio:1;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;"></div><div style="aspect-ratio:1;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;"></div></div></div>`;
    } else if (contentStr.includes("border-radius:50%") && contentStr.includes("width:64px")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;display:flex;align-items:center;gap:8px;"><div style="width:32px;height:32px;border-radius:50%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">A</div><div><div style="font-size:11px;font-weight:600;color:#000;">Имя</div><div style="font-size:10px;color:#666;">Описание</div></div></div>`;
    } else if (contentStr.includes("progress") || contentStr.includes("width:60%")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="width:100%;height:6px;background:#f0f0f0;border-radius:3px;overflow:hidden;"><div style="width:60%;height:100%;background:#000;border-radius:3px;"></div></div></div>`;
    } else if (contentStr.includes("★") || contentStr.includes("rating")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;display:flex;align-items:center;justify-content:center;"><div style="display:flex;gap:2px;color:#ffd700;font-size:14px;">★★★★★</div></div>`;
    } else if (contentStr.includes("details") || contentStr.includes("summary")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="padding:8px;background:#f5f5f5;border-bottom:1px solid #000;font-weight:600;font-size:11px;margin-bottom:4px;">Вопрос</div><div style="padding:8px;background:#fff;font-size:10px;color:#000;">Ответ</div></div>`;
    } else if (contentStr.includes("dialog") || contentStr.includes("modal")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="font-weight:600;margin-bottom:6px;font-size:11px;color:#000;">Заголовок</div><div style="font-size:10px;color:#000;margin-bottom:8px;">Содержимое</div><button style="padding:6px 12px;background:#000;color:#fff;border:none;border-radius:4px;font-size:10px;">Закрыть</button></div>`;
    } else if (contentStr.includes("testimonial") || (contentStr.includes("font-style:italic") && contentStr.includes("Иван"))) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="font-size:10px;margin-bottom:6px;color:#666;font-style:italic;">"Отзыв клиента"</div><div style="display:flex;align-items:center;gap:6px;"><div style="width:24px;height:24px;background:#000;border-radius:50%;"></div><div><div style="font-size:10px;font-weight:600;color:#000;">Имя</div><div style="font-size:9px;color:#666;">Должность</div></div></div></div>`;
    } else if (contentStr.includes("pricing") || (contentStr.includes("$99") && contentStr.includes("тариф"))) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="font-weight:600;margin-bottom:6px;font-size:11px;color:#000;">Тариф</div><div style="font-size:16px;font-weight:700;margin-bottom:8px;color:#000;">$99</div><button style="padding:6px 12px;background:#000;color:#fff;border:none;border-radius:4px;font-size:10px;width:100%;">Выбрать</button></div>`;
    } else if (contentStr.includes("timeline") || (contentStr.includes("position:relative") && contentStr.includes("width:2px"))) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="display:flex;gap:8px;"><div style="width:2px;background:#000;flex-shrink:0;"></div><div><div style="width:8px;height:8px;background:#000;border-radius:50%;margin:-4px 0 0 -5px;"></div><div style="font-size:10px;margin-top:4px;color:#000;">Событие</div></div></div></div>`;
    } else if (contentStr.includes("spinner") || contentStr.includes("animation:spin")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;display:flex;align-items:center;justify-content:center;"><div style="width:24px;height:24px;border:2px solid #f0f0f0;border-top:2px solid #000;border-radius:50%;animation:spin 1s linear infinite;"></div></div>`;
    } else if (contentStr.includes("breadcrumb") || (contentStr.includes("nav") && contentStr.includes("/"))) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="display:flex;gap:6px;font-size:10px;color:#666;"><span>Главная</span><span>/</span><span>Раздел</span><span>/</span><span>Страница</span></div></div>`;
    } else if (contentStr.includes("pagination") || (contentStr.includes("button") && contentStr.includes("→"))) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;display:flex;align-items:center;justify-content:center;gap:4px;"><button style="padding:6px 10px;background:#000;color:#fff;border:none;border-radius:4px;font-size:10px;">1</button><button style="padding:6px 10px;background:#fff;border:1px solid #000;border-radius:4px;font-size:10px;">2</button><button style="padding:6px 10px;background:#fff;border:1px solid #000;border-radius:4px;font-size:10px;">3</button></div>`;
    } else if (contentStr.includes("alert") || contentStr.includes("⚠️") || contentStr.includes("✓") || contentStr.includes("✕")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="padding:8px;background:#fff3cd;border:1px solid #ffc107;border-radius:6px;color:#856404;font-size:10px;">⚠️ Уведомление</div></div>`;
    } else if (contentStr.includes("social") || (contentStr.includes("border-radius:50%") && contentStr.includes("f") && contentStr.includes("t"))) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;display:flex;align-items:center;justify-content:center;gap:6px;"><div style="width:28px;height:28px;background:#000;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:700;">f</div><div style="width:28px;height:28px;background:#000;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:700;">t</div><div style="width:28px;height:28px;background:#000;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:700;">in</div></div>`;
    } else if (contentStr.includes("navbar") || (contentStr.includes("nav") && contentStr.includes("Логотип"))) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="display:flex;justify-content:space-between;align-items:center;"><div style="font-weight:700;font-size:11px;color:#000;">Логотип</div><div style="display:flex;gap:8px;font-size:10px;color:#000;"><span>Главная</span><span>О нас</span><span>Контакты</span></div></div></div>`;
    } else if (contentStr.includes("footer") || (contentStr.includes("©") && contentStr.includes("Все права"))) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="background:#000;color:#fff;padding:10px;border-radius:6px;"><div style="font-weight:700;margin-bottom:6px;font-size:11px;">Компания</div><div style="font-size:9px;opacity:0.7;">© 2024 Все права защищены</div></div></div>`;
    } else if (contentStr.includes("pre") || contentStr.includes("code") || contentStr.includes("monospace")) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="background:#1e1e1e;color:#d4d4d4;padding:8px;border-radius:6px;font-family:monospace;font-size:9px;overflow-x:auto;">const code = "example";</div></div>`;
    } else if (contentStr.includes("tooltip") || (contentStr.includes("border-bottom:2px dotted"))) {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;display:flex;align-items:center;justify-content:center;"><span style="border-bottom:1px dotted #000;cursor:help;color:#000;font-size:11px;">Наведите</span></div>`;
    } else {
      previewHtml = `<div style="background:#ffffff;padding:12px;border-radius:8px;border:1px solid #e0e0e0;"><div style="font-size:12px;color:#000;line-height:1.4;">${previewText || label}</div></div>`;
    }
  }
  
  return previewHtml;
};

const createLabelWithPreview = (title: string, content: string | { type: string; src?: string }): string => {
  const preview = createBlockPreview(content, title);
  return `
    <div class="custom-block-label">
      <span class="gjs-block-label" style="display:none;">${title}</span>
      <div class="custom-block-thumb">
        <div class="custom-block-thumb-inner">${preview}</div>
      </div>
      <div class="custom-block-meta">
        <span class="custom-block-title">${title}</span>
      </div>
    </div>
  `;
};

export function registerBlocks(editor: Editor) {
  const addBlock = (id: string, config: Parameters<typeof editor.BlockManager.add>[1]) => {
    const finalConfig = { ...(config ?? {}) } as Parameters<typeof editor.BlockManager.add>[1];
    const currentAttributes =
      (finalConfig as { attributes?: Record<string, string> }).attributes ?? {};
    (finalConfig as { attributes?: Record<string, string> }).attributes = {
      ...currentAttributes,
      "data-block-id": id,
    };
    editor.BlockManager.add(id, finalConfig);
  };

  editor.BlockManager.getAll().reset();

  addBlock("text", {
    label: createLabelWithPreview("Текст", '<div data-gjs-type="text" style="color: #000000;">Вставьте ваш текст здесь</div>'),
    content: '<div data-gjs-type="text" style="color: #000000;">Вставьте ваш текст здесь</div>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  });

  addBlock("heading", {
    label: createLabelWithPreview("Заголовок H1", '<h1 data-gjs-type="text" style="font-size: 48px; font-weight: 800; line-height: 1.2; letter-spacing: -0.02em; color: #000000; margin: 0 0 16px 0;">Заголовок</h1>'),
    content:
      '<h1 data-gjs-type="text" style="font-size: 48px; font-weight: 800; line-height: 1.2; letter-spacing: -0.02em; color: #000000; margin: 0 0 16px 0;">Заголовок</h1>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4v16M18 4v16M6 12h12M6 4h12M6 20h12"/></svg>',
  });

  addBlock("heading2", {
    label: createLabelWithPreview("Заголовок H2", '<h2 data-gjs-type="text" style="font-size: 36px; font-weight: 700; line-height: 1.3; color: #000000; margin: 0 0 12px 0;">Подзаголовок</h2>'),
    content:
      '<h2 data-gjs-type="text" style="font-size: 36px; font-weight: 700; line-height: 1.3; color: #000000; margin: 0 0 12px 0;">Подзаголовок</h2>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h12"/></svg>',
  });

  addBlock("heading3", {
    label: createLabelWithPreview("Заголовок H3", '<h3 data-gjs-type="text" style="font-size: 28px; font-weight: 600; line-height: 1.4; color: #000000; margin: 0 0 10px 0;">Заголовок 3</h3>'),
    content:
      '<h3 data-gjs-type="text" style="font-size: 28px; font-weight: 600; line-height: 1.4; color: #000000; margin: 0 0 10px 0;">Заголовок 3</h3>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>',
  });

  addBlock("paragraph", {
    label: createLabelWithPreview("Абзац", '<p data-gjs-type="text" style="font-size: 16px; line-height: 1.6; color: #000000; margin: 0 0 16px 0;">Это абзац текста. Вы можете редактировать его, изменив стиль, размер шрифта и другие параметры.</p>'),
    content:
      '<p data-gjs-type="text" style="font-size: 16px; line-height: 1.6; color: #000000; margin: 0 0 16px 0;">Это абзац текста. Вы можете редактировать его, изменив стиль, размер шрифта и другие параметры.</p>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h12"/></svg>',
  });

  addBlock("image", {
    label: createLabelWithPreview("Изображение", { type: "image", src: "https://via.placeholder.com/350x250/78c5d6/fff" }),
    content: { type: "image", src: "https://via.placeholder.com/350x250/78c5d6/fff" },
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  });

  addBlock("button", {
    label: createLabelWithPreview("Кнопка", '<button data-gjs-type="text" style="padding: 14px 28px; background: #000000; color: #ffffff; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">Кнопка</button>'),
    content: '<button data-gjs-type="text" style="padding: 14px 28px; background: #000000; color: #ffffff; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">Кнопка</button>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h10"/></svg>',
  });

  addBlock("button-secondary", {
    label: createLabelWithPreview("Кнопка (Вторичная)", '<button data-gjs-type="text" style="padding: 14px 28px; background: #ffffff; color: #000000; border: 2px solid #000000; border-radius: 12px; font-weight: 600; cursor: pointer;">Кнопка</button>'),
    content: '<button data-gjs-type="text" style="padding: 14px 28px; background: #ffffff; color: #000000; border: 2px solid #000000; border-radius: 12px; font-weight: 600; cursor: pointer;">Кнопка</button>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2" fill="none"/><path d="M7 10h10"/></svg>',
  });

  addBlock("link", {
    label: createLabelWithPreview("Ссылка", '<a href="#" data-gjs-type="text" style="color: #000000; text-decoration: underline;">Ссылка</a>'),
    content:
      '<a href="#" data-gjs-type="text" style="color: #000000; text-decoration: underline;">Ссылка</a>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  });

  addBlock("list", {
    label: createLabelWithPreview("Список", '<ul style="list-style: disc; padding-left: 20px; color: #000000;"><li data-gjs-type="text">Элемент списка 1</li><li data-gjs-type="text">Элемент списка 2</li><li data-gjs-type="text">Элемент списка 3</li></ul>'),
    content:
      '<ul style="list-style: disc; padding-left: 20px; color: #000000;"><li data-gjs-type="text">Элемент списка 1</li><li data-gjs-type="text">Элемент списка 2</li><li data-gjs-type="text">Элемент списка 3</li></ul>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  });

  addBlock("list-numbered", {
    label: createLabelWithPreview("Нумерованный список", '<ol style="list-style: decimal; padding-left: 20px; color: #000000;"><li data-gjs-type="text">Первый пункт</li><li data-gjs-type="text">Второй пункт</li><li data-gjs-type="text">Третий пункт</li></ol>'),
    content:
      '<ol style="list-style: decimal; padding-left: 20px; color: #000000;"><li data-gjs-type="text">Первый пункт</li><li data-gjs-type="text">Второй пункт</li><li data-gjs-type="text">Третий пункт</li></ol>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><line x1="4" y1="6" x2="4" y2="6"/><line x1="4" y1="12" x2="4" y2="12"/><line x1="4" y1="18" x2="4" y2="18"/></svg>',
  });

  addBlock("quote", {
    label: createLabelWithPreview("Цитата", '<blockquote style="border-left: 4px solid #000000; padding: 20px 24px; margin: 24px 0; background: #f5f5f5; border-radius: 12px; font-style: italic; color: #000000; font-size: 18px; line-height: 1.6;"><p data-gjs-type="text" style="margin: 0;">Это цитата. Вы можете изменить текст и стиль.</p></blockquote>'),
    content:
      '<blockquote style="border-left: 4px solid #000000; padding: 20px 24px; margin: 24px 0; background: #f5f5f5; border-radius: 12px; font-style: italic; color: #000000; font-size: 18px; line-height: 1.6;"><p data-gjs-type="text" style="margin: 0;">Это цитата. Вы можете изменить текст и стиль.</p></blockquote>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
  });

  addBlock("divider", {
    label: createLabelWithPreview("Разделитель", '<hr style="border: none; border-top: 2px solid #000000; margin: 40px 0; height: 1px;">'),
    content:
      '<hr style="border: none; border-top: 2px solid #000000; margin: 40px 0; height: 1px;">',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/></svg>',
  });

  addBlock("card", {
    label: createLabelWithPreview("Карточка", '<div data-surface="elevated" style="background: #ffffff; border-radius: 16px; padding: 28px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; border: 1px solid #000000; color: #000000;"><h3 data-gjs-type="text" style="margin-top: 0; font-size: 24px; font-weight: 700; color: #000000;">Заголовок карточки</h3><p data-gjs-type="text" style="color: #000000; line-height: 1.6; margin: 0;">Содержимое карточки. Вы можете добавить текст, изображения и другие элементы.</p></div>'),
    content:
      '<div data-surface="elevated" style="background: #ffffff; border-radius: 16px; padding: 28px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; border: 1px solid #000000; color: #000000;"><h3 data-gjs-type="text" style="margin-top: 0; font-size: 24px; font-weight: 700; color: #000000;">Заголовок карточки</h3><p data-gjs-type="text" style="color: #000000; line-height: 1.6; margin: 0;">Содержимое карточки. Вы можете добавить текст, изображения и другие элементы.</p></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
  });

  addBlock("card-image", {
    label: createLabelWithPreview("Карточка с изображением", '<div data-surface="elevated" style="border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; border: 1px solid #000000; color: #000000;"><img src="https://via.placeholder.com/400x200" style="width: 100%; height: auto; display: block;" alt="Изображение"><div style="padding: 24px;"><h3 data-gjs-type="text" style="margin-top: 0; font-size: 22px; font-weight: 700; color: #000000;">Заголовок</h3><p data-gjs-type="text" style="color: #000000; line-height: 1.6; margin: 0;">Описание карточки</p></div></div>'),
    content:
      '<div data-surface="elevated" style="border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); transition: all 0.3s ease; border: 1px solid #000000; color: #000000;"><img src="https://via.placeholder.com/400x200" style="width: 100%; height: auto; display: block;" alt="Изображение"><div style="padding: 24px;"><h3 data-gjs-type="text" style="margin-top: 0; font-size: 22px; font-weight: 700; color: #000000;">Заголовок</h3><p data-gjs-type="text" style="color: #000000; line-height: 1.6; margin: 0;">Описание карточки</p></div></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  });

  addBlock("badge", {
    label: createLabelWithPreview("Бейдж", '<span data-gjs-type="text" style="display: inline-block; padding: 6px 14px; background: #000000; color: #ffffff; border-radius: 20px; font-size: 13px; font-weight: 600; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">Бейдж</span>'),
    content:
      '<span data-gjs-type="text" style="display: inline-block; padding: 6px 14px; background: #000000; color: #ffffff; border-radius: 20px; font-size: 13px; font-weight: 600; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">Бейдж</span>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
  });

  addBlock("table", {
    label: createLabelWithPreview("Таблица", '<table data-surface="base" style="width: 100%; border-collapse: collapse; background: #ffffff; color: #000000; border-radius: 18px; overflow: hidden; border: 1px solid #000000;"><thead><tr style="background: #000000;"><th data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; text-align: left; font-weight: 600; color: #ffffff;">Заголовок 1</th><th data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; text-align: left; font-weight: 600; color: #ffffff;">Заголовок 2</th><th data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; text-align: left; font-weight: 600; color: #ffffff;">Заголовок 3</th></tr></thead><tbody><tr><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 1</td><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 2</td><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 3</td></tr><tr><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 4</td><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 5</td><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 6</td></tr></tbody></table>'),
    content:
      '<table data-surface="base" style="width: 100%; border-collapse: collapse; background: #ffffff; color: #000000; border-radius: 18px; overflow: hidden; border: 1px solid #000000;"><thead><tr style="background: #000000;"><th data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; text-align: left; font-weight: 600; color: #ffffff;">Заголовок 1</th><th data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; text-align: left; font-weight: 600; color: #ffffff;">Заголовок 2</th><th data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; text-align: left; font-weight: 600; color: #ffffff;">Заголовок 3</th></tr></thead><tbody><tr><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 1</td><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 2</td><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 3</td></tr><tr><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 4</td><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 5</td><td data-gjs-type="text" style="padding: 12px; border: 1px solid #000000; color: #000000;">Ячейка 6</td></tr></tbody></table>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>',
  });

  addBlock("form", {
    label: createLabelWithPreview("Форма", '<form data-surface="base" style="padding: 32px; border-radius: 20px; background: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border: 1px solid #000000; display: flex; flex-direction: column; gap: 22px;"><div><label data-gjs-type="text" style="display: block; margin-bottom: 8px; font-weight: 600; color: #000000; font-size: 14px;">Имя</label><input type="text" placeholder="Введите имя" style="width: 100%; padding: 14px 18px; border: 1px solid #000000; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; background: #ffffff; color: #000000;"></div><div><label data-gjs-type="text" style="display: block; margin-bottom: 8px; font-weight: 600; color: #000000; font-size: 14px;">Email</label><input type="email" placeholder="Введите email" style="width: 100%; padding: 14px 18px; border: 1px solid #000000; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; background: #ffffff; color: #000000;"></div><button type="submit" data-gjs-type="text" style="padding: 14px 28px; background: #000000; color: #ffffff; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">Отправить</button></form>'),
    content:
      '<form data-surface="base" style="padding: 32px; border-radius: 20px; background: #ffffff; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); border: 1px solid #000000; display: flex; flex-direction: column; gap: 22px;"><div><label data-gjs-type="text" style="display: block; margin-bottom: 8px; font-weight: 600; color: #000000; font-size: 14px;">Имя</label><input type="text" placeholder="Введите имя" style="width: 100%; padding: 14px 18px; border: 1px solid #000000; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; background: #ffffff; color: #000000;"></div><div><label data-gjs-type="text" style="display: block; margin-bottom: 8px; font-weight: 600; color: #000000; font-size: 14px;">Email</label><input type="email" placeholder="Введите email" style="width: 100%; padding: 14px 18px; border: 1px solid #000000; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; background: #ffffff; color: #000000;"></div><button type="submit" data-gjs-type="text" style="padding: 14px 28px; background: #000000; color: #ffffff; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">Отправить</button></form>',
    category: "Формы",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
  });

  addBlock("input", {
    label: createLabelWithPreview("Поле ввода", '<div style="margin-bottom: 20px;"><label data-gjs-type="text" style="display: block; margin-bottom: 8px; font-weight: 600; color: #000000; font-size: 14px;">Метка</label><input type="text" placeholder="Введите текст" style="width: 100%; padding: 14px 18px; border: 1px solid #000000; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; background: #ffffff; color: #000000;"></div>'),
    content:
      '<div style="margin-bottom: 20px;"><label data-gjs-type="text" style="display: block; margin-bottom: 8px; font-weight: 600; color: #000000; font-size: 14px;">Метка</label><input type="text" placeholder="Введите текст" style="width: 100%; padding: 14px 18px; border: 1px solid #000000; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; background: #ffffff; color: #000000;"></div>',
    category: "Формы",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/></svg>',
  });

  addBlock("textarea", {
    label: createLabelWithPreview("Текстовая область", '<div style="margin-bottom: 20px;"><label data-gjs-type="text" style="display: block; margin-bottom: 8px; font-weight: 600; color: #000000; font-size: 14px;">Сообщение</label><textarea placeholder="Введите текст" style="width: 100%; padding: 14px 18px; border: 1px solid #000000; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; min-height: 120px; resize: vertical; font-family: inherit; background: #ffffff; color: #000000;"></textarea></div>'),
    content:
      '<div style="margin-bottom: 20px;"><label data-gjs-type="text" style="display: block; margin-bottom: 8px; font-weight: 600; color: #000000; font-size: 14px;">Сообщение</label><textarea placeholder="Введите текст" style="width: 100%; padding: 14px 18px; border: 1px solid #000000; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; min-height: 120px; resize: vertical; font-family: inherit; background: #ffffff; color: #000000;"></textarea></div>',
    category: "Формы",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>',
  });

  addBlock("select", {
    label: createLabelWithPreview("Выпадающий список", '<div style="margin-bottom: 20px;"><label data-gjs-type="text" style="display: block; margin-bottom: 8px; font-weight: 600; color: #000000; font-size: 14px;">Выберите опцию</label><select style="width: 100%; padding: 14px 18px; border: 1px solid #000000; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; background: #ffffff; color: #000000; cursor: pointer;"><option>Опция 1</option><option>Опция 2</option><option>Опция 3</option></select></div>'),
    content:
      '<div style="margin-bottom: 20px;"><label data-gjs-type="text" style="display: block; margin-bottom: 8px; font-weight: 600; color: #000000; font-size: 14px;">Выберите опцию</label><select style="width: 100%; padding: 14px 18px; border: 1px solid #000000; border-radius: 12px; font-size: 15px; transition: all 0.3s ease; box-sizing: border-box; background: #ffffff; color: #000000; cursor: pointer;"><option>Опция 1</option><option>Опция 2</option><option>Опция 3</option></select></div>',
    category: "Формы",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
  });

  addBlock("checkbox", {
    label: createLabelWithPreview("Чекбокс", '<div style="margin-bottom: 15px;"><label style="display: flex; align-items: center; gap: 8px; color: #000000;"><input type="checkbox" style="accent-color: #000000;"><span data-gjs-type="text">Я согласен с условиями</span></label></div>'),
    content:
      '<div style="margin-bottom: 15px;"><label style="display: flex; align-items: center; gap: 8px; color: #000000;"><input type="checkbox" style="accent-color: #000000;"><span data-gjs-type="text">Я согласен с условиями</span></label></div>',
    category: "Формы",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  });

  addBlock("radio", {
    label: createLabelWithPreview("Радио кнопка", '<div style="margin-bottom: 15px;"><label style="display: flex; align-items: center; gap: 8px; color: #000000;"><input type="radio" name="option" style="accent-color: #000000;"><span data-gjs-type="text">Опция 1</span></label></div>'),
    content:
      '<div style="margin-bottom: 15px;"><label style="display: flex; align-items: center; gap: 8px; color: #000000;"><input type="radio" name="option" style="accent-color: #000000;"><span data-gjs-type="text">Опция 1</span></label></div>',
    category: "Формы",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>',
  });

  addBlock("div", {
    label: createLabelWithPreview("Контейнер div", '<div style="min-height: 50px; padding: 20px; background: #ffffff; border-radius: 8px;"></div>'),
    content: '<div style="min-height: 50px; padding: 20px; background: #ffffff; border-radius: 8px;"></div>',
    category: "Структура",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>',
  });

  addBlock("section", {
    label: createLabelWithPreview("Секция", '<div data-gjs-type="text">Содержимое секции</div>'),
    content: {
      type: "section",
      components: '<div data-gjs-type="text">Содержимое секции</div>',
    },
    category: "Структура",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>',
  });

  addBlock("column1", {
    label: createLabelWithPreview("1 Колонка", '<div class="row"><div class="cell" style="flex:1"></div></div>'),
    content: '<div class="row"><div class="cell" style="flex:1"></div></div>',
    category: "Структура",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>',
  });

  addBlock("column2", {
    label: createLabelWithPreview("2 Колонки", '<div class="row"><div class="cell" style="flex:1"></div><div class="cell" style="flex:1"></div></div>'),
    content: '<div class="row"><div class="cell" style="flex:1"></div><div class="cell" style="flex:1"></div></div>',
    category: "Структура",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="9" height="18" rx="1"/><rect x="12" y="3" width="9" height="18" rx="1"/></svg>',
  });

  addBlock("column3", {
    label: createLabelWithPreview("3 Колонки", '<div class="row"><div class="cell" style="flex:1"></div><div class="cell" style="flex:1"></div><div class="cell" style="flex:1"></div></div>'),
    content: '<div class="row"><div class="cell" style="flex:1"></div><div class="cell" style="flex:1"></div><div class="cell" style="flex:1"></div></div>',
    category: "Структура",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="9.5" y="3" width="5" height="18" rx="1"/><rect x="16" y="3" width="5" height="18" rx="1"/></svg>',
  });

  addBlock("image-gallery", {
    label: createLabelWithPreview("Галерея изображений", '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;"><div style="aspect-ratio:1;background:#f0f0f0;border:1px solid #ddd;border-radius:8px;"></div><div style="aspect-ratio:1;background:#f0f0f0;border:1px solid #ddd;border-radius:8px;"></div><div style="aspect-ratio:1;background:#f0f0f0;border:1px solid #ddd;border-radius:8px;"></div></div>'),
    content: {
      type: "image",
      src: "https://via.placeholder.com/300x300",
    },
    category: "Медиа",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  });

  addBlock("avatar", {
    label: createLabelWithPreview("Аватар", '<div style="display:flex;align-items:center;gap:12px;"><div style="width:48px;height:48px;border-radius:50%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;">A</div><div><div style="font-size:14px;font-weight:600;color:#000;">Имя</div><div style="font-size:12px;color:#666;">Описание</div></div></div>'),
    content: '<div style="display:flex;align-items:center;gap:16px;"><div style="width:64px;height:64px;border-radius:50%;background:#000000;color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;flex-shrink:0;">A</div><div><h3 data-gjs-type="text" style="margin:0 0 4px 0;font-size:18px;font-weight:700;color:#000000;">Имя Фамилия</h3><p data-gjs-type="text" style="margin:0;font-size:14px;color:#666666;">Должность или описание</p></div></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  });

  addBlock("icon", {
    label: createLabelWithPreview("Иконка", '<div style="display:flex;align-items:center;justify-content:center;width:48px;height:48px;background:#000;border-radius:12px;color:#fff;">★</div>'),
    content: '<div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:#000000;border-radius:16px;color:#ffffff;font-size:32px;">★</div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  });

  addBlock("progress-bar", {
    label: createLabelWithPreview("Прогресс-бар", '<div style="width:100%;height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;"><div style="width:60%;height:100%;background:#000;border-radius:4px;"></div></div>'),
    content: '<div data-progress-component="true" data-progress="60" style="width:100%;"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span data-gjs-type="text" class="progress-label" style="font-size:14px;font-weight:600;color:#000000;">Прогресс</span><span data-gjs-type="text" class="progress-percent" style="font-size:14px;color:#666666;">60%</span></div><div style="width:100%;height:12px;background:#f0f0f0;border-radius:6px;overflow:hidden;"><div class="progress-bar-fill" style="width:60%;height:100%;background:#000000;border-radius:6px;transition:width 0.3s ease;"></div></div></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="12" rx="2"/><rect x="3" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>',
  });

  addBlock("rating", {
    label: createLabelWithPreview("Рейтинг", '<div style="display:flex;gap:4px;color:#ffd700;">★★★★★</div>'),
    content: '<div data-rating-component="true" data-rating-stars="5" style="display:flex;align-items:center;gap:8px;"><div class="rating-stars" style="display:flex;gap:4px;color:#ffd700;font-size:20px;">★★★★★</div><span data-gjs-type="text" class="rating-value" style="font-size:14px;color:#666666;">(4.5)</span></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  });

  addBlock("accordion", {
    label: createLabelWithPreview("Аккордеон", '<div style="border:1px solid #000;border-radius:8px;overflow:hidden;"><div style="padding:12px;background:#f5f5f5;border-bottom:1px solid #000;font-weight:600;">Вопрос</div><div style="padding:12px;background:#fff;">Ответ</div></div>'),
    content: '<div style="border:1px solid #000000;border-radius:12px;overflow:hidden;"><details style="cursor:pointer;"><summary data-gjs-type="text" style="padding:16px;background:#f5f5f5;font-weight:600;color:#000000;list-style:none;cursor:pointer;">Вопрос 1</summary><div style="padding:16px;background:#ffffff;color:#000000;"><p data-gjs-type="text" style="margin:0;">Ответ на вопрос 1. Вы можете редактировать этот текст.</p></div></details><details style="cursor:pointer;"><summary data-gjs-type="text" style="padding:16px;background:#f5f5f5;font-weight:600;color:#000000;list-style:none;cursor:pointer;border-top:1px solid #000000;">Вопрос 2</summary><div style="padding:16px;background:#ffffff;color:#000000;"><p data-gjs-type="text" style="margin:0;">Ответ на вопрос 2. Вы можете редактировать этот текст.</p></div></details></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  });

  addBlock("tabs", {
    label: createLabelWithPreview("Табы", '<div style="border:1px solid #000;border-radius:8px;overflow:hidden;"><div style="display:flex;border-bottom:1px solid #000;"><div style="flex:1;padding:8px;background:#000;color:#fff;text-align:center;font-size:11px;">Вкладка 1</div><div style="flex:1;padding:8px;background:#f5f5f5;text-align:center;font-size:11px;">Вкладка 2</div></div><div style="padding:12px;background:#fff;">Содержимое</div></div>'),
    content: '<div style="border:1px solid #000000;border-radius:12px;overflow:hidden;"><div style="display:flex;border-bottom:1px solid #000000;"><button data-gjs-type="text" style="flex:1;padding:12px 16px;background:#000000;color:#ffffff;border:none;border-right:1px solid #000000;font-weight:600;cursor:pointer;">Вкладка 1</button><button data-gjs-type="text" style="flex:1;padding:12px 16px;background:#ffffff;color:#000000;border:none;font-weight:600;cursor:pointer;">Вкладка 2</button><button data-gjs-type="text" style="flex:1;padding:12px 16px;background:#ffffff;color:#000000;border:none;border-left:1px solid #000000;font-weight:600;cursor:pointer;">Вкладка 3</button></div><div style="padding:24px;background:#ffffff;color:#000000;"><p data-gjs-type="text" style="margin:0;">Содержимое вкладки. Вы можете редактировать этот текст.</p></div></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="3" x2="9" y2="21"/></svg>',
  });

  addBlock("alert", {
    label: createLabelWithPreview("Уведомление", '<div style="padding:12px;background:#fff3cd;border:1px solid #ffc107;border-radius:8px;color:#856404;font-size:12px;">⚠️ Важное уведомление</div>'),
    content: '<div style="padding:16px 20px;background:#fff3cd;border:2px solid #ffc107;border-radius:12px;color:#856404;display:flex;align-items:center;gap:12px;"><span style="font-size:20px;">⚠️</span><div><strong data-gjs-type="text" style="display:block;margin-bottom:4px;font-size:16px;">Внимание!</strong><p data-gjs-type="text" style="margin:0;font-size:14px;">Это важное уведомление. Вы можете изменить текст и стиль.</p></div></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  });

  addBlock("alert-success", {
    label: createLabelWithPreview("Успех", '<div style="padding:12px;background:#d4edda;border:1px solid #28a745;border-radius:8px;color:#155724;font-size:12px;">✓ Успешно</div>'),
    content: '<div style="padding:16px 20px;background:#d4edda;border:2px solid #28a745;border-radius:12px;color:#155724;display:flex;align-items:center;gap:12px;"><span style="font-size:20px;">✓</span><div><strong data-gjs-type="text" style="display:block;margin-bottom:4px;font-size:16px;">Успешно!</strong><p data-gjs-type="text" style="margin:0;font-size:14px;">Операция выполнена успешно.</p></div></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  });

  addBlock("alert-error", {
    label: createLabelWithPreview("Ошибка", '<div style="padding:12px;background:#f8d7da;border:1px solid #dc3545;border-radius:8px;color:#721c24;font-size:12px;">✕ Ошибка</div>'),
    content: '<div style="padding:16px 20px;background:#f8d7da;border:2px solid #dc3545;border-radius:12px;color:#721c24;display:flex;align-items:center;gap:12px;"><span style="font-size:20px;">✕</span><div><strong data-gjs-type="text" style="display:block;margin-bottom:4px;font-size:16px;">Ошибка!</strong><p data-gjs-type="text" style="margin:0;font-size:14px;">Произошла ошибка. Пожалуйста, попробуйте снова.</p></div></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  });

  addBlock("breadcrumbs", {
    label: createLabelWithPreview("Хлебные крошки", '<div style="display:flex;gap:8px;font-size:12px;color:#666;"><span>Главная</span><span>/</span><span>Раздел</span><span>/</span><span>Страница</span></div>'),
    content: '<nav style="display:flex;align-items:center;gap:12px;font-size:14px;"><a href="#" data-gjs-type="text" style="color:#000000;text-decoration:none;">Главная</a><span style="color:#666666;">/</span><a href="#" data-gjs-type="text" style="color:#000000;text-decoration:none;">Раздел</a><span style="color:#666666;">/</span><span data-gjs-type="text" style="color:#666666;">Текущая страница</span></nav>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  });

  addBlock("pagination", {
    label: createLabelWithPreview("Пагинация", '<div style="display:flex;gap:4px;"><button style="padding:8px 12px;background:#000;color:#fff;border:none;border-radius:6px;font-size:12px;">1</button><button style="padding:8px 12px;background:#fff;border:1px solid #000;border-radius:6px;font-size:12px;">2</button><button style="padding:8px 12px;background:#fff;border:1px solid #000;border-radius:6px;font-size:12px;">3</button></div>'),
    content: '<div style="display:flex;align-items:center;gap:8px;justify-content:center;"><button data-gjs-type="text" style="padding:10px 16px;background:#000000;color:#ffffff;border:none;border-radius:8px;font-weight:600;cursor:pointer;">1</button><button data-gjs-type="text" style="padding:10px 16px;background:#ffffff;color:#000000;border:1px solid #000000;border-radius:8px;font-weight:600;cursor:pointer;">2</button><button data-gjs-type="text" style="padding:10px 16px;background:#ffffff;color:#000000;border:1px solid #000000;border-radius:8px;font-weight:600;cursor:pointer;">3</button><button data-gjs-type="text" style="padding:10px 16px;background:#ffffff;color:#000000;border:1px solid #000000;border-radius:8px;font-weight:600;cursor:pointer;">→</button></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
  });

  addBlock("modal", {
    label: createLabelWithPreview("Модальное окно", '<div style="background:#fff;border:2px solid #000;border-radius:12px;padding:20px;max-width:400px;"><div style="font-weight:600;margin-bottom:12px;font-size:14px;">Заголовок</div><div style="font-size:12px;margin-bottom:16px;">Содержимое</div><button style="padding:8px 16px;background:#000;color:#fff;border:none;border-radius:6px;font-size:12px;">Закрыть</button></div>'),
    content: '<dialog style="padding:0;border:2px solid #000000;border-radius:16px;max-width:500px;background:#ffffff;"><div style="padding:24px;"><h2 data-gjs-type="text" style="margin:0 0 16px 0;font-size:24px;font-weight:700;color:#000000;">Заголовок модального окна</h2><p data-gjs-type="text" style="margin:0 0 24px 0;font-size:16px;color:#000000;line-height:1.6;">Содержимое модального окна. Вы можете добавить любой контент.</p><div style="display:flex;gap:12px;justify-content:flex-end;"><button data-gjs-type="text" style="padding:12px 24px;background:#ffffff;color:#000000;border:2px solid #000000;border-radius:8px;font-weight:600;cursor:pointer;">Отмена</button><button data-gjs-type="text" style="padding:12px 24px;background:#000000;color:#ffffff;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Подтвердить</button></div></div></dialog>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>',
  });

  addBlock("social-icons", {
    label: createLabelWithPreview("Социальные сети", '<div style="display:flex;gap:8px;"><div style="width:40px;height:40px;background:#000;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;">f</div><div style="width:40px;height:40px;background:#000;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;">t</div><div style="width:40px;height:40px;background:#000;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;">in</div></div>'),
    content: '<div style="display:flex;gap:12px;align-items:center;"><a href="#" style="display:flex;align-items:center;justify-content:center;width:48px;height:48px;background:#000000;border-radius:50%;color:#ffffff;text-decoration:none;font-weight:700;transition:all 0.3s ease;" data-gjs-type="text">f</a><a href="#" style="display:flex;align-items:center;justify-content:center;width:48px;height:48px;background:#000000;border-radius:50%;color:#ffffff;text-decoration:none;font-weight:700;transition:all 0.3s ease;" data-gjs-type="text">t</a><a href="#" style="display:flex;align-items:center;justify-content:center;width:48px;height:48px;background:#000000;border-radius:50%;color:#ffffff;text-decoration:none;font-weight:700;transition:all 0.3s ease;" data-gjs-type="text">in</a><a href="#" style="display:flex;align-items:center;justify-content:center;width:48px;height:48px;background:#000000;border-radius:50%;color:#ffffff;text-decoration:none;font-weight:700;transition:all 0.3s ease;" data-gjs-type="text">ig</a></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>',
  });

  addBlock("testimonial", {
    label: createLabelWithPreview("Отзыв", '<div style="background:#fff;border:1px solid #000;border-radius:12px;padding:16px;"><div style="font-size:12px;margin-bottom:8px;color:#666;">"Отзыв клиента"</div><div style="display:flex;align-items:center;gap:8px;"><div style="width:32px;height:32px;background:#000;border-radius:50%;"></div><div><div style="font-size:11px;font-weight:600;">Имя</div><div style="font-size:10px;color:#666;">Должность</div></div></div></div>'),
    content: '<div data-surface="elevated" style="background:#ffffff;border:2px solid #000000;border-radius:20px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"><div style="margin-bottom:20px;"><p data-gjs-type="text" style="margin:0;font-size:18px;line-height:1.6;color:#000000;font-style:italic;">"Отличный продукт! Очень доволен качеством и сервисом."</p></div><div style="display:flex;align-items:center;gap:16px;"><div style="width:64px;height:64px;border-radius:50%;background:#000000;color:#ffffff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;flex-shrink:0;">ИФ</div><div><h4 data-gjs-type="text" style="margin:0 0 4px 0;font-size:18px;font-weight:700;color:#000000;">Иван Федоров</h4><p data-gjs-type="text" style="margin:0;font-size:14px;color:#666666;">Генеральный директор</p></div></div></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
  });

  addBlock("pricing-card", {
    label: createLabelWithPreview("Тарифная карточка", '<div style="background:#fff;border:2px solid #000;border-radius:12px;padding:16px;"><div style="font-weight:600;margin-bottom:8px;font-size:14px;">Тариф</div><div style="font-size:20px;font-weight:700;margin-bottom:12px;">$99</div><button style="padding:8px 16px;background:#000;color:#fff;border:none;border-radius:6px;font-size:12px;width:100%;">Выбрать</button></div>'),
    content: '<div data-surface="elevated" style="background:#ffffff;border:2px solid #000000;border-radius:20px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.1);display:flex;flex-direction:column;gap:20px;"><div><h3 data-gjs-type="text" style="margin:0 0 12px 0;font-size:24px;font-weight:700;color:#000000;">Базовый</h3><div style="display:flex;align-items:baseline;gap:8px;"><span data-gjs-type="text" style="font-size:48px;font-weight:800;color:#000000;">$99</span><span data-gjs-type="text" style="font-size:18px;color:#666666;">/месяц</span></div></div><ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:12px;"><li data-gjs-type="text" style="font-size:16px;color:#000000;">✓ Функция 1</li><li data-gjs-type="text" style="font-size:16px;color:#000000;">✓ Функция 2</li><li data-gjs-type="text" style="font-size:16px;color:#000000;">✓ Функция 3</li></ul><button data-gjs-type="text" style="padding:14px 28px;background:#000000;color:#ffffff;border:none;border-radius:12px;font-weight:700;cursor:pointer;margin-top:auto;">Выбрать тариф</button></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
  });

  addBlock("timeline", {
    label: createLabelWithPreview("Таймлайн", '<div style="display:flex;gap:12px;"><div style="width:2px;background:#000;flex-shrink:0;"></div><div><div style="width:12px;height:12px;background:#000;border-radius:50%;margin:-5px 0 0 -7px;"></div><div style="font-size:12px;margin-top:8px;">Событие</div></div></div>'),
    content: '<div style="position:relative;padding-left:32px;"><div style="position:absolute;left:0;top:0;bottom:0;width:2px;background:#000000;"></div><div style="position:relative;margin-bottom:32px;"><div style="position:absolute;left:-28px;top:4px;width:16px;height:16px;background:#000000;border-radius:50%;border:3px solid #ffffff;"></div><h4 data-gjs-type="text" style="margin:0 0 8px 0;font-size:20px;font-weight:700;color:#000000;">Событие 1</h4><p data-gjs-type="text" style="margin:0;font-size:16px;color:#666666;line-height:1.6;">Описание события. Вы можете редактировать этот текст.</p></div><div style="position:relative;margin-bottom:32px;"><div style="position:absolute;left:-28px;top:4px;width:16px;height:16px;background:#000000;border-radius:50%;border:3px solid #ffffff;"></div><h4 data-gjs-type="text" style="margin:0 0 8px 0;font-size:20px;font-weight:700;color:#000000;">Событие 2</h4><p data-gjs-type="text" style="margin:0;font-size:16px;color:#666666;line-height:1.6;">Описание события. Вы можете редактировать этот текст.</p></div></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  });

  addBlock("spinner", {
    label: createLabelWithPreview("Загрузка", '<div style="width:32px;height:32px;border:3px solid #f0f0f0;border-top:3px solid #000;border-radius:50%;animation:spin 1s linear infinite;"></div>'),
    content: '<div style="display:flex;align-items:center;justify-content:center;padding:40px;"><div style="width:48px;height:48px;border:4px solid #f0f0f0;border-top:4px solid #000000;border-radius:50%;animation:spin 1s linear infinite;"></div></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  });

  addBlock("divider-text", {
    label: createLabelWithPreview("Разделитель с текстом", '<div style="display:flex;align-items:center;gap:12px;"><div style="flex:1;height:1px;background:#000;"></div><span style="font-size:12px;color:#666;">или</span><div style="flex:1;height:1px;background:#000;"></div></div>'),
    content: '<div style="display:flex;align-items:center;gap:16px;margin:32px 0;"><div style="flex:1;height:2px;background:#000000;"></div><span data-gjs-type="text" style="font-size:14px;color:#666666;font-weight:600;white-space:nowrap;">или</span><div style="flex:1;height:2px;background:#000000;"></div></div>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/></svg>',
  });

  addBlock("code-block", {
    label: createLabelWithPreview("Блок кода", '<div style="background:#1e1e1e;color:#d4d4d4;padding:12px;border-radius:8px;font-family:monospace;font-size:11px;overflow-x:auto;">const code = "example";</div>'),
    content: '<pre style="background:#1e1e1e;color:#d4d4d4;padding:20px;border-radius:12px;overflow-x:auto;border:1px solid #000000;font-family:\'Courier New\',monospace;font-size:14px;line-height:1.6;margin:0;"><code data-gjs-type="text">const example = "Hello, World!";\nconsole.log(example);</code></pre>',
    category: "Базовые",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  });

  addBlock("tooltip", {
    label: createLabelWithPreview("Подсказка", '<div style="position:relative;display:inline-block;"><span style="border-bottom:1px dotted #000;cursor:help;">Наведите</span><div style="position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#000;color:#fff;padding:6px 10px;border-radius:6px;font-size:11px;white-space:nowrap;margin-bottom:8px;">Текст подсказки</div></div>'),
    content: '<div style="position:relative;display:inline-block;"><span data-gjs-type="text" style="border-bottom:2px dotted #000000;cursor:help;color:#000000;">Наведите на меня</span><div style="position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#000000;color:#ffffff;padding:8px 12px;border-radius:8px;font-size:14px;white-space:nowrap;margin-bottom:8px;opacity:0;pointer-events:none;transition:opacity 0.3s ease;">Текст подсказки</div></div>',
    category: "Компоненты",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  });

  addBlock("navbar", {
    label: createLabelWithPreview("Навигация", '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid #000;"><div style="font-weight:700;font-size:14px;">Логотип</div><div style="display:flex;gap:12px;font-size:12px;"><span>Главная</span><span>О нас</span><span>Контакты</span></div></div>'),
    content: '<nav style="display:flex;justify-content:space-between;align-items:center;padding:20px 32px;border-bottom:2px solid #000000;background:#ffffff;"><div><a href="#" data-gjs-type="text" style="font-size:24px;font-weight:800;color:#000000;text-decoration:none;">Логотип</a></div><div style="display:flex;gap:24px;align-items:center;"><a href="#" data-gjs-type="text" style="color:#000000;text-decoration:none;font-weight:600;font-size:16px;">Главная</a><a href="#" data-gjs-type="text" style="color:#000000;text-decoration:none;font-weight:600;font-size:16px;">О нас</a><a href="#" data-gjs-type="text" style="color:#000000;text-decoration:none;font-weight:600;font-size:16px;">Контакты</a><button data-gjs-type="text" style="padding:10px 20px;background:#000000;color:#ffffff;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Войти</button></div></nav>',
    category: "Структура",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  });

  addBlock("footer", {
    label: createLabelWithPreview("Футер", '<div style="background:#000;color:#fff;padding:20px;border-radius:8px;"><div style="font-weight:700;margin-bottom:12px;font-size:14px;">Компания</div><div style="font-size:11px;opacity:0.7;">© 2024 Все права защищены</div></div>'),
    content: '<footer style="background:#000000;color:#ffffff;padding:48px 32px;border-top:2px solid #ffffff;"><div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;"><div><h4 data-gjs-type="text" style="margin:0 0 16px 0;font-size:20px;font-weight:700;">Компания</h4><p data-gjs-type="text" style="margin:0;font-size:14px;line-height:1.6;opacity:0.8;">Описание компании и её миссии.</p></div><div><h4 data-gjs-type="text" style="margin:0 0 16px 0;font-size:20px;font-weight:700;">Ссылки</h4><ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px;"><li><a href="#" data-gjs-type="text" style="color:#ffffff;text-decoration:none;opacity:0.8;">Главная</a></li><li><a href="#" data-gjs-type="text" style="color:#ffffff;text-decoration:none;opacity:0.8;">О нас</a></li><li><a href="#" data-gjs-type="text" style="color:#ffffff;text-decoration:none;opacity:0.8;">Контакты</a></li></ul></div></div><div style="margin-top:32px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.2);text-align:center;"><p data-gjs-type="text" style="margin:0;font-size:14px;opacity:0.7;">© 2024 Компания. Все права защищены.</p></div></footer>',
    category: "Структура",
    media: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"/></svg>',
  });

  const customSections = [
    {
      id: "hero-gradient",
      title: "Градиентный хиро",
      description: "Визуально мощный первый экран с кнопками CTA",
      preview: `
        <section style="display:flex;flex-direction:column;gap:18px;padding:32px;border-radius:24px;background:#ffffff;color:#000000;border:2px solid #000000;">
          <span style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;background:#000000;border:1px solid #000000;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#ffffff;">новинка</span>
          <h1 style="margin:0;font-size:28px;line-height:1.12;font-weight:700;color:#000000;">Создавайте лендинги мгновенно</h1>
          <p style="margin:0;font-size:13px;line-height:1.6;color:#000000;">
            Готовые секции и палитры — визуальный сайт без ручного кодинга.
          </p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <span style="display:inline-flex;align-items:center;justify-content:center;padding:10px 18px;border-radius:12px;background:#000000;color:#ffffff;font-weight:600;">Начать</span>
            <span style="display:inline-flex;align-items:center;justify-content:center;padding:10px 18px;border-radius:12px;background:#ffffff;border:2px solid #000000;color:#000000;font-weight:500;">Каталог</span>
          </div>
        </section>
      `,
      content: `
        <section data-surface="soft" style="display:flex;flex-direction:column;gap:24px;padding:64px 48px;border-radius:40px;background:#ffffff;color:#000000;box-shadow:0 4px 8px rgba(0,0,0,0.1);border:2px solid #000000;">
          <span style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;background:#000000;border:1px solid #000000;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#ffffff;">новинка</span>
          <h1 style="margin:0;font-size:48px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:#000000;">Создавайте лендинги со скоростью мысли</h1>
          <p style="margin:0;font-size:18px;line-height:1.75;color:#000000;max-width:720px;">
            Готовые секции, аккуратная типографика и живые палитры — все уже собрано в одном месте. Соберите страницу для клиента за считанные минуты.
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:16px;">
            <a href="#" style="display:inline-flex;align-items:center;justify-content:center;padding:16px 28px;border-radius:16px;background:#000000;color:#ffffff;font-weight:700;text-decoration:none;box-shadow:0 2px 4px rgba(0,0,0,0.2);border:1px solid #000000;">Начать бесплатно</a>
            <a href="#" style="display:inline-flex;align-items:center;justify-content:center;padding:16px 28px;border-radius:16px;background:#ffffff;border:2px solid #000000;color:#000000;font-weight:600;text-decoration:none;">Смотреть примеры</a>
          </div>
        </section>
      `,
    },
    {
      id: "features-grid",
      title: "Сетка преимуществ",
      description: "Четыре карточки с описанием выгод продукта",
      preview: `
        <section style="display:flex;flex-direction:column;gap:20px;padding:28px;border-radius:24px;background:#ffffff;color:#000000;border:2px solid #000000;">
          <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-end;flex-wrap:wrap;">
            <div>
              <span style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;background:#000000;border:1px solid #000000;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#ffffff;">особенности</span>
              <h2 style="margin:12px 0 0;font-size:20px;line-height:1.2;font-weight:700;color:#000000;">Что делает инструмент удобным</h2>
            </div>
            <p style="margin:0;font-size:12px;max-width:220px;color:#000000;">
              Миксуйте блоки, меняйте палитры и получайте цельный дизайн без ручной работы.
            </p>
          </div>
          <div style="display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr));">
            ${["Готовые секции", "Тёмные палитры", "Умные стили", "Экспорт без сюрпризов"].map((title) => `
              <article style="display:flex;flex-direction:column;gap:8px;padding:14px;border-radius:16px;background:#ffffff;border:1px solid #000000;">
                <strong style="font-size:13px;color:#000000;">${title}</strong>
                <span style="font-size:11px;color:#000000;">Лаконичный текст</span>
              </article>
            `).join("")}
          </div>
        </section>
      `,
      content: `
        <section data-surface="base" style="display:flex;flex-direction:column;gap:32px;padding:56px;border-radius:32px;background:#ffffff;color:#000000;border:2px solid #000000;box-shadow:0 4px 8px rgba(0,0,0,0.1);">
          <div style="display:flex;justify-content:space-between;gap:32px;align-items:flex-end;flex-wrap:wrap;">
            <div>
              <span style="display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:999px;background:#000000;border:1px solid #000000;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:#ffffff;">особенности</span>
              <h2 style="margin:14px 0 0;font-size:32px;line-height:1.2;font-weight:700;color:#000000;">Что делает Nimble Builder удобным</h2>
            </div>
            <p style="margin:0;font-size:15px;max-width:380px;color:#000000;">
              Каждая секция визуально выверена и готова к использованию. Миксуйте блоки, меняйте палитры и получайте цельный дизайн без лишней ручной работы.
            </p>
          </div>
          <div style="display:grid;gap:20px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));">
            ${[
              { icon: "★", title: "Готовые секции", desc: "Хиро, отзывы, тарифы, контакты и многое другое." },
              { icon: "◆", title: "Продуманные палитры", desc: "Идеально сочетаются и переключаются в один клик." },
              { icon: "⚙", title: "Умные стили", desc: "Типографика и кнопки изменяются максимально аккуратно." },
              { icon: "⬇", title: "Чистый экспорт", desc: "HTML и CSS готовы к интеграции без лишних стилей." },
            ]
              .map(
                (item) => `
                <article data-surface="elevated" style="display:flex;flex-direction:column;gap:12px;padding:22px;border-radius:20px;background:#ffffff;border:1px solid #000000;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                  <div style="width:46px;height:46px;border-radius:16px;background:#000000;border:1px solid #000000;display:flex;align-items:center;justify-content:center;font-weight:700;color:#ffffff;">${item.icon}</div>
                  <h3 style="margin:0;font-size:18px;color:#000000;">${item.title}</h3>
                  <p style="margin:0;font-size:14px;color:#000000;line-height:1.6;">${item.desc}</p>
                </article>`
              )
              .join("")}
          </div>
        </section>
      `,
    },
    {
      id: "pricing-modern",
      title: "Современные тарифы",
      description: "Три тарифа с акцентом на средней карте",
      preview: `
        <section style="display:flex;flex-direction:column;gap:20px;padding:28px;border-radius:24px;background:#ffffff;color:#000000;border:2px solid #000000;">
          <div style="text-align:center;">
            <span style="display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;background:#000000;border:1px solid #000000;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#ffffff;">тарифы</span>
            <h3 style="margin:12px 0 0;font-size:20px;font-weight:700;color:#000000;">Выберите план</h3>
          </div>
          <div style="display:grid;gap:12px;grid-template-columns:repeat(3,minmax(0,1fr));">
            ${["0 ₽", "790 ₽", "1 490 ₽"].map((price, idx) => `
              <article style="display:flex;flex-direction:column;gap:8px;padding:16px;border-radius:18px;background:${idx === 1 ? "#000000" : "#ffffff"};border:2px solid #000000;color:${idx === 1 ? "#ffffff" : "#000000"};">
                <strong>${price}</strong>
                <span style="font-size:11px;opacity:0.7;">/ месяц</span>
              </article>`).join("")}
          </div>
        </section>
      `,
      content: `
        <section data-surface="base" style="display:flex;flex-direction:column;gap:36px;padding:56px;border-radius:36px;background:#ffffff;border:2px solid #000000;box-shadow:0 4px 8px rgba(0,0,0,0.1);color:#000000;">
          <div style="text-align:center;max-width:640px;margin:0 auto;">
            <span style="display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:999px;background:#000000;border:1px solid #000000;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#ffffff;">тарифы</span>
            <h2 style="margin:18px 0 12px;font-size:36px;line-height:1.1;font-weight:700;color:#000000;">Выберите подходящий план</h2>
            <p style="margin:0;font-size:16px;color:#000000;">Оплачивайте только тогда, когда готовы опубликовать проект клиенту.</p>
          </div>
          <div style="display:grid;gap:22px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
            ${[
              {
                name: "Старт",
                price: "0 ₽ / мес",
                perks: ["5 секций", "Экспорт HTML", "Поддержка 24/7"],
                highlight: false,
              },
              {
                name: "Профи",
                price: "790 ₽ / мес",
                perks: ["∞ секций", "Экспорт HTML + CSS", "Командный доступ", "Готовые пресеты"],
                highlight: true,
              },
              {
                name: "Агентство",
                price: "1 490 ₽ / мес",
                perks: ["Все из Профи", "Брендирование", "Приоритетная поддержка"],
                highlight: false,
              },
            ]
              .map(
                (plan) => `
                <article data-surface="${plan.highlight ? "accent" : "elevated"}" style="display:flex;flex-direction:column;gap:18px;padding:28px;border-radius:24px;background:${
                  plan.highlight ? "#000000" : "#ffffff"
                };border:2px solid #000000;color:${
                  plan.highlight ? "#ffffff" : "#000000"
                };box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                  <div>
                    <span style="display:flex;align-items:center;gap:10px;font-size:14px;text-transform:uppercase;letter-spacing:0.12em;color:${
                      plan.highlight ? "#ffffff" : "#000000"
                    };">${plan.name}</span>
                    <strong style="display:block;margin-top:12px;font-size:32px;">${plan.price}</strong>
                  </div>
                  <ul style="margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:12px;font-size:14px;color:${
                    plan.highlight ? "#ffffff" : "#000000"
                  };">
                    ${plan.perks.map((perk) => `<li>✔ ${perk}</li>`).join("")}
                  </ul>
                  <a href="#" style="margin-top:auto;display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:14px;background:${
                    plan.highlight ? "#ffffff" : "#000000"
                  };border:2px solid #000000;color:${
                  plan.highlight ? "#000000" : "#ffffff"
                };font-weight:600;text-decoration:none;">${plan.highlight ? "Попробовать 7 дней" : "Выбрать тариф"}</a>
                </article>`
              )
              .join("")}
          </div>
        </section>
      `,
    },
  ];

  const createLabelMarkup = (title: string, description: string, preview: string) => {
    const safeDescription = description.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `
      <div class="custom-block-label">
        <span class="gjs-block-label" style="display:none;">${title}</span>
        <div class="custom-block-thumb">
          <div class="custom-block-thumb-inner">${preview}</div>
        </div>
        <div class="custom-block-meta">
          <span class="custom-block-title">${title}</span>
          <span class="custom-block-desc">${safeDescription}</span>
        </div>
      </div>
    `;
  };

  customSections.forEach((section) => {
    addBlock(section.id, {
      label: createLabelMarkup(section.title, section.description, section.preview),
      category: "Структура",
      media:
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="5" width="6" height="6" rx="1"/><rect x="14" y="5" width="6" height="6" rx="1"/><rect x="4" y="13" width="6" height="6" rx="1"/><rect x="14" y="13" width="6" height="6" rx="1"/></svg>',
      content: section.content,
    });
  });
}

