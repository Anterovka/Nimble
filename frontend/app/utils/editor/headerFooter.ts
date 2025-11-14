export interface HeaderSettings {
  logo: string;
  companyName: string;
  backgroundColor: string;
  textColor: string;
  navItems: string[];
  navItemsRaw?: string;
}

export interface FooterSettings {
  backgroundColor: string;
  textColor: string;
  copyright: string;
}

export function generateHeaderHTML(header: HeaderSettings): string {
  const defaultNavItems = ["О продукте", "Возможности", "Тарифы", "Команда"];
  const items = header.navItems.length ? header.navItems : defaultNavItems;

  const navLinks = items
    .map((item: string) => `<a class="nimble-nav__link" href="#">${item}</a>`)
    .join("");

  const logoFallback = header.companyName.trim().slice(0, 2) || "NM";
  const logoElement = header.logo
    ? `<span class="nimble-brand__logo"><img src="${header.logo}" alt="Logo"></span>`
    : `<span class="nimble-brand__logo">${logoFallback.toUpperCase()}</span>`;

  return `
    <header class="nimble-header" style="--header-bg:${header.backgroundColor}; --header-text:${header.textColor};">
      <div class="nimble-header__inner">
        <div class="nimble-brand">
          ${logoElement}
          <div class="nimble-brand__info">
            <span class="nimble-brand__name">${header.companyName || "Nimble"}</span>
            <span class="nimble-brand__tagline">Digital Experiences</span>
          </div>
      </div>
        <nav class="nimble-nav">
          ${navLinks}
          <a class="nimble-nav__cta" href="#">Демо</a>
      </nav>
      </div>
    </header>
  `;
}

export function generateFooterHTML(footer: FooterSettings): string {
  return `
    <footer class="nimble-footer" style="--footer-bg:${footer.backgroundColor}; --footer-text:${footer.textColor};">
      <div class="nimble-footer__grid">
        <div class="nimble-footer__column">
          <span class="nimble-footer__brand">${footer.copyright.split("©").join("© ").trim() || "© 2025 Nimble"}</span>
          <p class="nimble-footer__text">
            Мы помогаем командам запускать современные цифровые продукты быстрее, сочетая продуманный дизайн и гибкие инструменты.
          </p>
        </div>
        <div class="nimble-footer__column">
          <span class="nimble-footer__heading">Навигация</span>
          <a class="nimble-footer__link" href="#">О продукте</a>
          <a class="nimble-footer__link" href="#">Блог</a>
          <a class="nimble-footer__link" href="#">Тарифы</a>
          <a class="nimble-footer__link" href="#">Поддержка</a>
        </div>
        <div class="nimble-footer__column">
          <span class="nimble-footer__heading">Контакты</span>
          <p class="nimble-footer__text">hello@nimble.co</p>
          <p class="nimble-footer__text">+7 (495) 123-45-67</p>
          <div class="nimble-footer__social">
            <span class="nimble-footer__social-badge">Be</span>
            <span class="nimble-footer__social-badge">Dr</span>
            <span class="nimble-footer__social-badge">In</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function applyHeaderFooter(
  editor: any,
  header: HeaderSettings,
  footer: FooterSettings
) {
  const headerHtml = generateHeaderHTML(header);
  const footerHtml = generateFooterHTML(footer);

  const wrapper = editor.getWrapper();
  if (!wrapper) return;

  const pageShell =
    wrapper.find(".page-shell")?.[0] ||
    wrapper.components().find((comp: any) => comp.getClasses?.().includes("page-shell"));

  const targetContainer = pageShell || wrapper;
  const containerComponents = targetContainer.components?.();

  function findComponent(selector: string, tagName: string, fromEnd = false): any {
    try {
      const byClass = targetContainer.find?.(selector);
      if (byClass) {
        const arr = Array.isArray(byClass) ? byClass : [byClass];
        if (arr.length > 0) return arr[0];
      }
      
      const allComponents = targetContainer.components?.() || [];
      const compsArray = Array.isArray(allComponents) ? allComponents : Array.from(allComponents || []);
      const range = fromEnd ? Array.from({ length: compsArray.length }, (_, i) => compsArray.length - 1 - i) : compsArray;
      
      for (const comp of range) {
        if (comp.get?.('tagName')?.toLowerCase() === tagName) {
          return comp;
        }
      }
    } catch (e) {
      console.warn(`Ошибка при поиске ${tagName}:`, e);
    }
    return null;
  }

  const existingHeader = findComponent('.nimble-header', 'header');
  const existingFooter = findComponent('.nimble-footer', 'footer', true);

  // Убеждаемся, что стили для header/footer загружены
  const currentStyles = editor.getStyle() || '';
  const headerFooterStyles = `
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

  if (!currentStyles.includes('.nimble-header')) {
    editor.addStyle(headerFooterStyles);
  }

  function replaceComponent(existing: any, newHtml: string, insertAt: number | null = null) {
    const parent = existing.parent();
    if (parent) {
      existing.remove();
      const components = parent.components();
      if (insertAt !== null) {
        components.add(newHtml, { at: insertAt });
      } else {
        components.add(newHtml);
      }
    } else {
      existing.replaceWith(newHtml);
    }
  }

  if (existingHeader) {
    const parent = existingHeader.parent();
    const components = parent?.components();
    const compsArray = components ? (Array.isArray(components) ? components : Array.from(components)) : [];
    const headerIndex = compsArray.indexOf(existingHeader);
    replaceComponent(existingHeader, headerHtml, headerIndex >= 0 ? headerIndex : 0);
  } else if (containerComponents) {
    containerComponents.add(headerHtml, { at: 0 });
  }
    
  if (existingFooter) {
    const parent = existingFooter.parent();
    const components = parent?.components();
    const compsArray = components ? (Array.isArray(components) ? components : Array.from(components)) : [];
    const footerIndex = compsArray.indexOf(existingFooter);
    replaceComponent(existingFooter, footerHtml, footerIndex >= 0 ? footerIndex : null);
  } else if (containerComponents) {
    containerComponents.add(footerHtml);
  }

  setTimeout(() => {
    const allHeaders = targetContainer.find?.('header') || [];
    const allFooters = targetContainer.find?.('footer') || [];
    const headersArray = Array.isArray(allHeaders) ? allHeaders : [allHeaders];
    const footersArray = Array.isArray(allFooters) ? allFooters : [allFooters];
    
    if (headersArray.length > 1) {
      for (let i = 1; i < headersArray.length; i++) {
        headersArray[i].remove();
      }
    }
    
    if (footersArray.length > 1) {
      for (let i = 0; i < footersArray.length - 1; i++) {
        footersArray[i].remove();
      }
    }
  }, 100);

  // Обновляем редактор, чтобы применить изменения
  editor.refresh();
}

export function getInitialContent(header: HeaderSettings, footer: FooterSettings): string {
  const headerHtml = generateHeaderHTML(header);
  const footerHtml = generateFooterHTML(footer);
  
  // Возвращаем пустой контент - только обертку с header и footer
  return `
    <div class="page-shell">
      ${headerHtml}
      <main class="nimble-main">
      </main>
      ${footerHtml}
    </div>
  `;
}

