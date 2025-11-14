import type { Template } from '../templateTypes';

export const blankWhiteTemplate: Template = {
  id: "blank-white",
  name: "Пустой белый",
  description: "Чистый белый шаблон для начала работы с нуля",
  category: "Базовые",
  preview: "⬜",
  html: `<div style="min-height: 100vh; background: #ffffff; color: #000000; display: flex; flex-direction: column;">
  <header style="padding: 1.5rem 2rem; border-bottom: 1px solid #e5e7eb;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <h1 style="font-size: 1.5rem; font-weight: 600;">Название проекта</h1>
      <nav style="display: flex; gap: 1.5rem;">
        <a href="#" style="color: inherit; text-decoration: none; font-weight: 500;">Главная</a>
        <a href="#" style="color: inherit; text-decoration: none; font-weight: 500;">О нас</a>
        <a href="#" style="color: inherit; text-decoration: none; font-weight: 500;">Контакты</a>
      </nav>
    </div>
  </header>
  <main style="flex: 1; padding: 2rem 2rem 3rem;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <!-- Начните добавлять контент здесь -->
    </div>
  </main>
  <footer style="padding: 2rem; border-top: 1px solid #e5e7eb; background: #f9fafb;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: #4b5563;">
      <span>© 2025 Компания. Все права защищены.</span>
      <div style="display: flex; gap: 1rem;">
        <a href="#" style="color: inherit; text-decoration: none;">Политика конфиденциальности</a>
        <a href="#" style="color: inherit; text-decoration: none;">Условия использования</a>
      </div>
    </div>
  </footer>
</div>`,
  css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #ffffff;
  color: #000000;
  line-height: 1.6;
}

}`,
};


