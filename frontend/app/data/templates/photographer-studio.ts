import type { Template } from '../templateTypes';

export const photographerStudioTemplate: Template = {
  id: "photographer-studio",
  name: "Фотограф - Студия",
  description: "Портфолио для фотографа с галереей работ",
  category: "Фотография",
  preview: "📸",
  html: `<div style="min-height: 100vh; background: #fafafa; color: #1a1a1a; display: flex; flex-direction: column;">
  <header style="padding: 2rem; background: white; border-bottom: 1px solid #e5e5e5; position: sticky; top: 0; z-index: 100;">
    <div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <h1 style="font-size: 1.8rem; font-weight: 700; letter-spacing: -0.5px;">MARIA PHOTO</h1>
      <nav style="display: flex; gap: 2.5rem;">
        <a href="#portfolio" style="color: inherit; text-decoration: none; font-weight: 500;">Портфолио</a>
        <a href="#about" style="color: inherit; text-decoration: none; font-weight: 500;">Обо мне</a>
        <a href="#contact" style="color: inherit; text-decoration: none; font-weight: 500;">Контакты</a>
      </nav>
      <button style="padding: 0.75rem 1.5rem; background: #1a1a1a; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Забронировать</button>
    </div>
  </header>
  <main style="flex: 1;">
    <section style="padding: 8rem 2rem; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="font-size: 4.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -2px;">Запечатлеваю<br/>моменты жизни</h2>
        <p style="font-size: 1.3rem; margin-bottom: 3rem; opacity: 0.95;">Профессиональная фотография для ваших особенных моментов</p>
        <button style="padding: 1.2rem 2.5rem; background: white; color: #667eea; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">Смотреть работы</button>
      </div>
    </section>
    <section id="portfolio" style="padding: 6rem 2rem; background: #fafafa;">
      <div style="max-width: 1400px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 4rem;">
          <h3 style="font-size: 3rem; font-weight: 800; margin-bottom: 1rem;">Галерея</h3>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <button style="padding: 0.5rem 1.5rem; background: #1a1a1a; color: white; border: none; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">Все</button>
            <button style="padding: 0.5rem 1.5rem; background: transparent; color: #1a1a1a; border: 1px solid #ddd; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">Свадьбы</button>
            <button style="padding: 0.5rem 1.5rem; background: transparent; color: #1a1a1a; border: 1px solid #ddd; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">Портреты</button>
            <button style="padding: 0.5rem 1.5rem; background: transparent; color: #1a1a1a; border: 1px solid #ddd; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 0.9rem;">События</button>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <div style="background: url('https://images.unsplash.com/photo-1519741497674-611481863552?w=600') center/cover; aspect-ratio: 4/5; border-radius: 12px; overflow: hidden; cursor: pointer; position: relative;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);">
              <div style="color: white; font-weight: 700; font-size: 1.2rem;">Свадебная фотосессия</div>
              <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-top: 0.5rem;">2024</div>
            </div>
          </div>
          <div style="background: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600') center/cover; aspect-ratio: 4/5; border-radius: 12px; overflow: hidden; cursor: pointer; position: relative;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);">
              <div style="color: white; font-weight: 700; font-size: 1.2rem;">Портретная съёмка</div>
              <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-top: 0.5rem;">2024</div>
            </div>
          </div>
          <div style="background: url('https://images.unsplash.com/photo-1511578314322-379afb476865?w=600') center/cover; aspect-ratio: 4/5; border-radius: 12px; overflow: hidden; cursor: pointer; position: relative;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);">
              <div style="color: white; font-weight: 700; font-size: 1.2rem;">Корпоративное событие</div>
              <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-top: 0.5rem;">2024</div>
            </div>
          </div>
          <div style="background: url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600') center/cover; aspect-ratio: 4/5; border-radius: 12px; overflow: hidden; cursor: pointer; position: relative;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);">
              <div style="color: white; font-weight: 700; font-size: 1.2rem;">Love Story</div>
              <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-top: 0.5rem;">2024</div>
            </div>
          </div>
          <div style="background: url('https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600') center/cover; aspect-ratio: 4/5; border-radius: 12px; overflow: hidden; cursor: pointer; position: relative;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);">
              <div style="color: white; font-weight: 700; font-size: 1.2rem;">Семейная фотосессия</div>
              <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-top: 0.5rem;">2024</div>
            </div>
          </div>
          <div style="background: url('https://images.unsplash.com/photo-1539109136881-4be0616af9ef?w=600') center/cover; aspect-ratio: 4/5; border-radius: 12px; overflow: hidden; cursor: pointer; position: relative;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);">
              <div style="color: white; font-weight: 700; font-size: 1.2rem;">Fashion съёмка</div>
              <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-top: 0.5rem;">2024</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="about" style="padding: 6rem 2rem; background: white;">
      <div style="max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
        <div>
          <h3 style="font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem;">Обо мне</h3>
          <p style="font-size: 1.1rem; line-height: 1.8; color: #666; margin-bottom: 1.5rem;">Я профессиональный фотограф с более чем 10-летним опытом работы. Специализируюсь на свадебной, портретной и событийной фотографии.</p>
          <p style="font-size: 1.1rem; line-height: 1.8; color: #666;">Моя цель — запечатлеть самые важные моменты вашей жизни и создать фотографии, которые будут радовать вас долгие годы.</p>
        </div>
        <div style="background: #f5f5f5; padding: 3rem; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 4rem; font-weight: 800; color: #667eea; margin-bottom: 0.5rem;">500+</div>
            <div style="color: #666; font-weight: 600;">Съёмок</div>
          </div>
          <div style="text-align: center; margin-bottom: 2rem; padding-top: 2rem; border-top: 1px solid #ddd;">
            <div style="font-size: 4rem; font-weight: 800; color: #667eea; margin-bottom: 0.5rem;">10+</div>
            <div style="color: #666; font-weight: 600;">Лет опыта</div>
          </div>
          <div style="text-align: center; padding-top: 2rem; border-top: 1px solid #ddd;">
            <div style="font-size: 4rem; font-weight: 800; color: #667eea; margin-bottom: 0.5rem;">100%</div>
            <div style="color: #666; font-weight: 600;">Довольных клиентов</div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer id="contact" style="padding: 4rem 2rem; background: #1a1a1a; color: white; text-align: center;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h3 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 2rem;">Свяжитесь со мной</h3>
      <p style="font-size: 1.2rem; margin-bottom: 1rem; color: #aaa;">Email: hello@mariaphoto.ru</p>
      <p style="font-size: 1.2rem; color: #aaa;">Телефон: +7 (495) 123-45-67</p>
      <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 3rem;">
        <a href="#" style="color: #aaa; text-decoration: none; font-weight: 500;">Instagram</a>
        <a href="#" style="color: #aaa; text-decoration: none; font-weight: 500;">VK</a>
        <a href="#" style="color: #aaa; text-decoration: none; font-weight: 500;">Telegram</a>
      </div>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
button:hover { box-shadow: 0 5px 20px rgba(0,0,0,0.15) !important; }
div[style*="cursor: pointer"]:hover { }
a:hover { opacity: 0.7; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h2 { font-size: 2.5rem !important; }
  section { padding: 3rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
  div[style*="display: grid; grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
  button { font-size: 0.8rem !important; padding: 0.4rem 1rem !important; }
}`,
};

