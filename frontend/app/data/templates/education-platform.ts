import type { Template } from '../templateTypes';

export const educationPlatformTemplate: Template = {
  id: "education-platform",
  name: "Образование - Платформа",
  description: "Современная платформа для онлайн-обучения",
  category: "Образование",
  preview: "📚",
  html: `<div style="min-height: 100vh; background: #ffffff; color: #1a1a1a; display: flex; flex-direction: column;">
  <header style="padding: 1.5rem 2rem; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100;">
    <div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <h1 style="font-size: 1.8rem; font-weight: 800; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">EduLearn</h1>
      <nav style="display: flex; gap: 2rem;">
        <a href="#courses" style="color: inherit; text-decoration: none; font-weight: 600;">Курсы</a>
        <a href="#teachers" style="color: inherit; text-decoration: none; font-weight: 600;">Преподаватели</a>
        <a href="#pricing" style="color: inherit; text-decoration: none; font-weight: 600;">Тарифы</a>
      </nav>
      <button style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Войти</button>
    </div>
  </header>
  <main style="flex: 1;">
    <section style="padding: 8rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center;">
      <div style="max-width: 900px; margin: 0 auto;">
        <div style="display: inline-block; padding: 0.5rem 1.5rem; background: rgba(255,255,255,0.2); border-radius: 50px; margin-bottom: 2rem; font-size: 0.9rem; font-weight: 700;">🎓 Более 10,000 студентов</div>
        <h2 style="font-size: 4.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -2px;">Обучайтесь у лучших<br/>преподавателей</h2>
        <p style="font-size: 1.3rem; margin-bottom: 3rem; opacity: 0.95; line-height: 1.6;">Интерактивные курсы по программированию, дизайну, маркетингу и многому другому</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button style="padding: 1.2rem 2.5rem; background: white; color: #667eea; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 40px rgba(0,0,0,0.2);">Начать обучение</button>
          <button style="padding: 1.2rem 2.5rem; background: transparent; color: white; border: 2px solid white; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer;">Смотреть курсы</button>
        </div>
      </div>
    </section>
    <section id="courses" style="padding: 6rem 2rem; background: #f8f9fa;">
      <div style="max-width: 1400px; margin: 0 auto;">
        <h3 style="text-align: center; font-size: 3.5rem; font-weight: 900; margin-bottom: 4rem;">Популярные курсы</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); cursor: pointer;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800') center/cover; position: relative;">
              <div style="position: absolute; top: 1rem; right: 1rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.9); border-radius: 20px; font-weight: 700; color: #667eea;">БЕСТСЕЛЛЕР</div>
            </div>
            <div style="padding: 2rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <span style="padding: 0.25rem 0.75rem; background: #f0f0f0; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Программирование</span>
                <span style="color: #667eea; font-weight: 700;">4.9 ⭐</span>
              </div>
              <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">React с нуля до профи</h4>
              <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">Полный курс по React: хуки, роутинг, state management</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 1.5rem; font-weight: 900; color: #667eea;">4,990 ₽</span>
                <span style="color: #999; text-decoration: line-through;">9,990 ₽</span>
              </div>
            </div>
          </div>
          <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); cursor: pointer;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800') center/cover;"></div>
            <div style="padding: 2rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <span style="padding: 0.25rem 0.75rem; background: #f0f0f0; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Дизайн</span>
                <span style="color: #667eea; font-weight: 700;">4.8 ⭐</span>
              </div>
              <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">UI/UX дизайн в Figma</h4>
              <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">Создание интерфейсов и прототипирование</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 1.5rem; font-weight: 900; color: #667eea;">3,990 ₽</span>
                <span style="color: #999; text-decoration: line-through;">7,990 ₽</span>
              </div>
            </div>
          </div>
          <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); cursor: pointer;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800') center/cover;"></div>
            <div style="padding: 2rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                <span style="padding: 0.25rem 0.75rem; background: #f0f0f0; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Маркетинг</span>
                <span style="color: #667eea; font-weight: 700;">4.7 ⭐</span>
              </div>
              <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Digital маркетинг</h4>
              <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">SMM, контент-маркетинг, аналитика</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 1.5rem; font-weight: 900; color: #667eea;">5,990 ₽</span>
                <span style="color: #999; text-decoration: line-through;">11,990 ₽</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="teachers" style="padding: 6rem 2rem; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h3 style="text-align: center; font-size: 3.5rem; font-weight: 900; margin-bottom: 4rem;">Наши преподаватели</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
          <div style="text-align: center;">
            <div style="width: 150px; height: 150px; background: url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400') center/cover; border-radius: 50%; margin: 0 auto 1.5rem; border: 3px solid #667eea;"></div>
            <h4 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem;">Иван Петров</h4>
            <p style="color: #667eea; margin-bottom: 1rem; font-weight: 600;">Senior Developer</p>
            <p style="color: #666; font-size: 0.9rem;">10+ лет опыта, работал в Google и Яндекс</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 150px; height: 150px; background: url('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400') center/cover; border-radius: 50%; margin: 0 auto 1.5rem; border: 3px solid #667eea;"></div>
            <h4 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem;">Мария Соколова</h4>
            <p style="color: #667eea; margin-bottom: 1rem; font-weight: 600;">UI/UX Designer</p>
            <p style="color: #666; font-size: 0.9rem;">Дизайнер с опытом в крупных агентствах</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 150px; height: 150px; background: url('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400') center/cover; border-radius: 50%; margin: 0 auto 1.5rem; border: 3px solid #667eea;"></div>
            <h4 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem;">Алексей Иванов</h4>
            <p style="color: #667eea; margin-bottom: 1rem; font-weight: 600;">Marketing Expert</p>
            <p style="color: #666; font-size: 0.9rem;">Специалист по digital-маркетингу</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer id="pricing" style="padding: 4rem 2rem; background: #1a1a1a; color: white; text-align: center;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h3 style="font-size: 2.5rem; font-weight: 900; margin-bottom: 2rem;">EduLearn</h3>
      <p style="color: #888; margin-bottom: 1rem;">Онлайн-платформа для обучения</p>
      <p style="color: #888;">© 2025 EduLearn. Все права защищены.</p>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
button:hover { }
div[style*="cursor: pointer"]:hover { }
a:hover { opacity: 0.7; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h2 { font-size: 2.5rem !important; }
  section { padding: 3rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
}`,
};
