import type { Template } from '../templateTypes';

export const blogClassicTemplate: Template = {
  id: "blog-1",
  name: "Блог - Классический",
  description: "Классический дизайн блога с постами",
  category: "Блоги",
  preview: "📝",
  html: `<div style="min-height: 100vh; background: #ffffff; display: flex; flex-direction: column;">
  <header style="border-bottom: 1px solid #e5e7eb; background: #f8fafc;">
    <div style="max-width: 960px; margin: 0 auto; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;">
      <h1 style="font-size: 1.75rem; font-weight: bold;">Мой блог</h1>
      <nav style="display: flex; gap: 1.5rem; font-size: 0.95rem;">
        <a href="#" style="color: #111827; text-decoration: none; font-weight: 600;">Главная</a>
        <a href="#" style="color: #111827; text-decoration: none;">Категории</a>
        <a href="#" style="color: #111827; text-decoration: none;">Обо мне</a>
      </nav>
    </div>
  </header>
  <main style="flex: 1;">
    <div style="max-width: 900px; margin: 0 auto; padding: 3rem 2rem 4rem;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;">Мысли, идеи и новости</h2>
        <p style="color: #6b7280;">Личные заметки и полезные материалы для вашего роста</p>
      </div>
      <article style="margin-bottom: 4rem; padding-bottom: 2rem; border-bottom: 1px solid #eee;">
        <h3 style="font-size: 2rem; margin-bottom: 1rem;">
          <a href="#" style="color: #000; text-decoration: none;">Заголовок статьи</a>
        </h3>
        <p style="color: #666; margin-bottom: 1rem;">12 января 2025</p>
        <p style="line-height: 1.8; color: #333;">Краткое описание статьи. Здесь может быть несколько предложений, которые дают представление о содержании...</p>
        <a href="#" style="color: #0066cc; text-decoration: none; font-weight: 600;">Читать далее →</a>
      </article>
      <article style="margin-bottom: 4rem; padding-bottom: 2rem; border-bottom: 1px solid #eee;">
        <h3 style="font-size: 2rem; margin-bottom: 1rem;">
          <a href="#" style="color: #000; text-decoration: none;">Еще одна статья</a>
        </h3>
        <p style="color: #666; margin-bottom: 1rem;">10 января 2025</p>
        <p style="line-height: 1.8; color: #333;">Еще одно описание статьи...</p>
        <a href="#" style="color: #0066cc; text-decoration: none; font-weight: 600;">Читать далее →</a>
      </article>
    </div>
  </main>
  <footer style="border-top: 1px solid #e5e7eb; background: #f8fafc;">
    <div style="max-width: 960px; margin: 0 auto; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: #6b7280;">
      <span>© 2025 Мой блог. Все права защищены.</span>
      <div style="display: flex; gap: 1.25rem;">
        <a href="#" style="color: inherit; text-decoration: none;">Политика</a>
        <a href="#" style="color: inherit; text-decoration: none;">Контакты</a>
        <a href="#" style="color: inherit; text-decoration: none;">RSS</a>
      </div>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Georgia, serif; color: #000; background: #fff; line-height: 1.6; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h1 { font-size: 2rem !important; }
  section { padding: 2rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
}`,
};


