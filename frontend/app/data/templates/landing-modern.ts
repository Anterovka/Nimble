import type { Template } from '../templateTypes';

export const landingModernTemplate: Template = {
  id: "landing-modern",
  name: "Лендинг - Современный",
  description: "Современный и минималистичный лендинг",
  category: "Лендинги",
  preview: "🚀",
  html: `<div style="min-height: 100vh; background: #0f172a; color: #f8fafc; display: flex; flex-direction: column;">
  <header style="border-bottom: 1px solid #1e293b; background: #1a202c;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;">
      <h1 style="font-size: 1.8rem; font-weight: 700;">Nimble</h1>
      <nav style="display: flex; gap: 1.5rem;">
        <a href="#" style="color: inherit; text-decoration: none;">О продукте</a>
        <a href="#" style="color: inherit; text-decoration: none;">Возможности</a>
        <a href="#" style="color: inherit; text-decoration: none;">Контакты</a>
      </nav>
      <a href="#" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">Начать</a>
    </div>
  </header>
  <main style="flex: 1; display: flex; align-items: center; justify-content: center; text-align: center; padding: 4rem 2rem;">
    <div style="max-width: 800px;">
      <h2 style="font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem;">Создавайте потрясающие веб-сайты за минуты</h2>
      <p style="font-size: 1.25rem; color: #94a3b8; margin-bottom: 2.5rem;">Наш интуитивно понятный редактор позволяет легко воплощать ваши идеи в жизнь без кода.</p>
      <button style="padding: 1rem 2.5rem; background: #3b82f6; color: white; border: none; border-radius: 10px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);">Начать бесплатно</button>
    </div>
  </main>
  <footer style="border-top: 1px solid #1e293b; background: #1a202c;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 2rem; text-align: center; color: #94a3b8; font-size: 0.9rem;">
      © 2025 Nimble. Все права защищены.
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h2 { font-size: 2rem !important; }
  section { padding: 2rem 1rem !important; }
  div[style*="max-width: 1200px"] { padding: 1rem !important; }
}`,
};
