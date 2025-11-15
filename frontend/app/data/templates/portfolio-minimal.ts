// минималистичное портфолио шаблон
import type { Template } from '../templateTypes';

export const portfolioMinimalTemplate: Template = {
  id: "portfolio-1",
  name: "Портфолио - Минималистичное",
  description: "Чистое и минималистичное портфолио",
  category: "Портфолио",
  preview: "💼",
  html: `<div style="min-height: 100vh; background: #ffffff; color: #0f172a; display: flex; flex-direction: column;">
  <header style="border-bottom: 1px solid #e5e7eb; background: #f8fafc;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center;">
      <h1 style="font-size: 1.75rem; font-weight: 600;">Иван Иванов</h1>
      <nav style="display: flex; gap: 1.5rem;">
        <a href="#about" style="color: inherit; text-decoration: none;">О себе</a>
        <a href="#projects" style="color: inherit; text-decoration: none;">Проекты</a>
        <a href="#contact" style="color: inherit; text-decoration: none;">Контакты</a>
      </nav>
      <a href="mailto:hello@portfolio.dev" style="padding: 0.6rem 1.4rem; border: 1px solid #0f172a; border-radius: 999px; text-decoration: none; font-weight: 500; color: inherit;">Написать мне</a>
    </div>
  </header>
  <main style="flex: 1;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 4rem 2rem;">
      <section id="about" style="margin-bottom: 4rem;">
        <h2 style="font-size: 2.5rem; font-weight: 300; margin-bottom: 1rem;">Веб-разработчик и дизайнер</h2>
        <p style="font-size: 1.1rem; line-height: 1.8; color: #334155; max-width: 720px;">Я создаю красивые и функциональные веб-сайты, которые помогают бизнесу расти. Фокус на пользовательском опыте, производительности и визуальной выразительности.</p>
      </section>
      <section id="projects" style="margin-bottom: 4rem;">
        <h2 style="font-size: 2rem; margin-bottom: 2rem; border-bottom: 2px solid #0f172a; padding-bottom: 0.5rem;">Проекты</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div style="border: 1px solid #e2e8f0; padding: 2rem; border-radius: 16px;">
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Проект 1</h3>
            <p style="color: #64748b; margin-bottom: 1rem;">Описание проекта и достигнутые результаты.</p>
            <a href="#" style="color: #2563eb; text-decoration: none; font-weight: 500;">Смотреть →</a>
          </div>
          <div style="border: 1px solid #e2e8f0; padding: 2rem; border-radius: 16px;">
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Проект 2</h3>
            <p style="color: #64748b; margin-bottom: 1rem;">Описание проекта и достигнутые результаты.</p>
            <a href="#" style="color: #2563eb; text-decoration: none; font-weight: 500;">Смотреть →</a>
          </div>
          <div style="border: 1px solid #e2e8f0; padding: 2rem; border-radius: 16px;">
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Проект 3</h3>
            <p style="color: #64748b; margin-bottom: 1rem;">Описание проекта и достигнутые результаты.</p>
            <a href="#" style="color: #2563eb; text-decoration: none; font-weight: 500;">Смотреть →</a>
          </div>
        </div>
      </section>
    </div>
  </main>
  <footer id="contact" style="border-top: 1px solid #e5e7eb; background: #f8fafc;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 1.75rem 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; font-size: 0.95rem; color: #475569;">
      <span>© 2025 Иван Иванов. Все права защищены.</span>
      <div style="display: flex; gap: 1rem;">
        <a href="#" style="color: inherit; text-decoration: none;">Telegram</a>
        <a href="#" style="color: inherit; text-decoration: none;">Figma</a>
        <a href="#" style="color: inherit; text-decoration: none;">Behance</a>
      </div>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; color: #000; background: #fff; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h2 { font-size: 2rem !important; }
  section { padding: 2rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
}`,
};


