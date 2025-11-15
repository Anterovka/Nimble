// креативное портфолио шаблон
import type { Template } from '../templateTypes';

export const creativePortfolioTemplate: Template = {
  id: "creative-portfolio",
  name: "Портфолио - Креативное",
  description: "Яркое и креативное портфолио для дизайнеров",
  category: "Портфолио",
  preview: "🎨",
  html: `<div style="min-height: 100vh; background: #0a0a0a; color: #fff; display: flex; flex-direction: column;">
  <header style="padding: 2rem; position: sticky; top: 0; background: rgba(10,10,10,0.95); backdrop-filter: blur(20px); z-index: 100;">
    <div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <div style="font-size: 1.5rem; font-weight: 900; background: linear-gradient(135deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">ALEX CREATIVE</div>
      <nav style="display: flex; gap: 2.5rem;">
        <a href="#work" style="color: inherit; text-decoration: none; font-weight: 500; position: relative;">Работы</a>
        <a href="#about" style="color: inherit; text-decoration: none; font-weight: 500;">Обо мне</a>
        <a href="#contact" style="color: inherit; text-decoration: none; font-weight: 500;">Контакты</a>
      </nav>
    </div>
  </header>
  <main style="flex: 1;">
    <section style="padding: 8rem 2rem; text-align: center; background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);">
      <div style="max-width: 1000px; margin: 0 auto;">
        <h1 style="font-size: 6rem; font-weight: 900; line-height: 1; margin-bottom: 2rem; background: linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -3px;">Креативный<br/>Дизайнер</h1>
        <p style="font-size: 1.5rem; color: #888; margin-bottom: 3rem; line-height: 1.6;">Создаю визуальные решения, которые вдохновляют и привлекают внимание</p>
        <button style="padding: 1.2rem 3rem; background: linear-gradient(135deg, #ff6b6b, #4ecdc4); color: white; border: none; border-radius: 50px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 40px rgba(255, 107, 107, 0.4);">Посмотреть работы</button>
      </div>
    </section>
    <section id="work" style="padding: 6rem 2rem; background: #0a0a0a;">
      <div style="max-width: 1400px; margin: 0 auto;">
        <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 4rem; text-align: center;">Избранные проекты</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem;">
          <div style="background: url('https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800') center/cover; padding: 3rem; border-radius: 24px; min-height: 400px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(102,126,234,0.9), rgba(118,75,162,0.9)); border-radius: 24px;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 1rem; font-weight: 600;">BRANDING</div>
              <h3 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem;">Rebrand Project</h3>
              <p style="opacity: 0.95; line-height: 1.6;">Современный ребрендинг для технологической компании</p>
            </div>
            <div style="font-size: 1.2rem; font-weight: 700; position: relative; z-index: 1;">→</div>
          </div>
          <div style="background: url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800') center/cover; padding: 3rem; border-radius: 24px; min-height: 400px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(240,147,251,0.9), rgba(245,87,108,0.9)); border-radius: 24px;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 1rem; font-weight: 600;">UI/UX</div>
              <h3 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem;">Mobile App</h3>
              <p style="opacity: 0.95; line-height: 1.6;">Дизайн мобильного приложения для стартапа</p>
            </div>
            <div style="font-size: 1.2rem; font-weight: 700; position: relative; z-index: 1;">→</div>
          </div>
          <div style="background: url('https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800') center/cover; padding: 3rem; border-radius: 24px; min-height: 400px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; position: relative;">
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(79,172,254,0.9), rgba(0,242,254,0.9)); border-radius: 24px;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 1rem; font-weight: 600;">WEB DESIGN</div>
              <h3 style="font-size: 2rem; font-weight: 800; margin-bottom: 1rem;">E-commerce</h3>
              <p style="opacity: 0.95; line-height: 1.6;">Интернет-магазин с современным дизайном</p>
            </div>
            <div style="font-size: 1.2rem; font-weight: 700; position: relative; z-index: 1;">→</div>
          </div>
        </div>
      </div>
    </section>
    <section id="about" style="padding: 6rem 2rem; background: #1a1a1a;">
      <div style="max-width: 1000px; margin: 0 auto; text-align: center;">
        <h2 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 2rem;">Обо мне</h2>
        <p style="font-size: 1.2rem; line-height: 1.8; color: #aaa; max-width: 700px; margin: 0 auto;">Я дизайнер с 8-летним опытом работы в области брендинга, веб-дизайна и UI/UX. Специализируюсь на создании визуально привлекательных и функциональных решений для бизнеса.</p>
      </div>
    </section>
  </main>
  <footer id="contact" style="padding: 4rem 2rem; background: #0a0a0a; border-top: 1px solid #222;">
    <div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem;">
      <div>
        <div style="font-size: 1.5rem; font-weight: 900; margin-bottom: 1rem; background: linear-gradient(135deg, #ff6b6b, #4ecdc4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">ALEX CREATIVE</div>
        <p style="color: #666;">Создаю визуальные решения</p>
      </div>
      <div style="display: flex; gap: 2rem;">
        <a href="#" style="color: #888; text-decoration: none; font-weight: 500;">ВКонтакте</a>
        <a href="#" style="color: #888; text-decoration: none; font-weight: 500;">Behance</a>
        <a href="#" style="color: #888; text-decoration: none; font-weight: 500;">Figma</a>
        <a href="#" style="color: #888; text-decoration: none; font-weight: 500;">Telegram</a>
      </div>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h1 { font-size: 3rem !important; line-height: 1.1 !important; }
  section { padding: 3rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
  div[style*="minmax(400px"] { min-width: 100% !important; }
}`,
};

