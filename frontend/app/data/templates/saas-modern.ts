import type { Template } from '../templateTypes';

export const saasModernTemplate: Template = {
  id: "saas-modern",
  name: "SaaS - Современный",
  description: "Современный SaaS лендинг с градиентами и анимациями",
  category: "SaaS",
  preview: "⚡",
  html: `<div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; display: flex; flex-direction: column;">
  <header style="padding: 2rem; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <h1 style="font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px;">CloudSync</h1>
      <nav style="display: flex; gap: 2rem;">
        <a href="#features" style="color: inherit; text-decoration: none; font-weight: 500;">Возможности</a>
        <a href="#pricing" style="color: inherit; text-decoration: none; font-weight: 500;">Тарифы</a>
        <a href="#contact" style="color: inherit; text-decoration: none; font-weight: 500;">Контакты</a>
      </nav>
      <button style="padding: 0.75rem 1.5rem; background: white; color: #667eea; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">Войти</button>
    </div>
  </header>
  <main style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 4rem 2rem; text-align: center; position: relative;">
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200') center/cover; opacity: 0.15; filter: blur(2px);"></div>
    <div style="max-width: 900px; position: relative; z-index: 1;">
      <div style="display: inline-block; padding: 0.5rem 1rem; background: rgba(255,255,255,0.2); border-radius: 50px; margin-bottom: 2rem; font-size: 0.9rem; font-weight: 600;">✨ Новая версия 3.0 доступна</div>
      <h2 style="font-size: 4.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -2px;">Синхронизируйте всё.<br/>Везде. Всегда.</h2>
      <p style="font-size: 1.4rem; margin-bottom: 3rem; opacity: 0.95; line-height: 1.6;">Мощная платформа для синхронизации данных между всеми вашими устройствами. Быстро. Безопасно. Надёжно.</p>
      <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button style="padding: 1.2rem 2.5rem; background: white; color: #667eea; border: none; border-radius: 16px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">Начать бесплатно</button>
        <button style="padding: 1.2rem 2.5rem; background: transparent; color: white; border: 2px solid white; border-radius: 16px; font-size: 1.1rem; font-weight: 700; cursor: pointer;">Смотреть демо</button>
      </div>
      <div style="margin-top: 4rem; padding: 2rem; background: rgba(255,255,255,0.1); border-radius: 24px; backdrop-filter: blur(10px);">
        <p style="font-size: 0.9rem; margin-bottom: 1rem; opacity: 0.8;">Доверяют более 50,000+ компаний</p>
        <div style="display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; opacity: 0.7;">
          <span style="font-weight: 700; font-size: 1.1rem;">Google</span>
          <span style="font-weight: 700; font-size: 1.1rem;">Microsoft</span>
          <span style="font-weight: 700; font-size: 1.1rem;">Apple</span>
          <span style="font-weight: 700; font-size: 1.1rem;">Amazon</span>
        </div>
      </div>
    </div>
  </main>
  <section id="features" style="padding: 6rem 2rem; background: rgba(255,255,255,0.05);">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h3 style="text-align: center; font-size: 3rem; font-weight: 800; margin-bottom: 4rem;">Почему выбирают нас</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        <div style="padding: 2.5rem; background: rgba(255,255,255,0.1); border-radius: 20px; backdrop-filter: blur(10px);">
          <div style="width: 80px; height: 80px; background: url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200') center/cover; border-radius: 16px; margin-bottom: 1.5rem;"></div>
          <h4 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Молниеносная скорость</h4>
          <p style="opacity: 0.9; line-height: 1.6;">Синхронизация в реальном времени на всех устройствах</p>
        </div>
        <div style="padding: 2.5rem; background: rgba(255,255,255,0.1); border-radius: 20px; backdrop-filter: blur(10px);">
          <div style="width: 80px; height: 80px; background: url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=200') center/cover; border-radius: 16px; margin-bottom: 1.5rem;"></div>
          <h4 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Безопасность</h4>
          <p style="opacity: 0.9; line-height: 1.6;">Шифрование уровня банков с двухфакторной аутентификацией</p>
        </div>
        <div style="padding: 2.5rem; background: rgba(255,255,255,0.1); border-radius: 20px; backdrop-filter: blur(10px);">
          <div style="width: 80px; height: 80px; background: url('https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=200') center/cover; border-radius: 16px; margin-bottom: 1.5rem;"></div>
          <h4 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">Везде доступно</h4>
          <p style="opacity: 0.9; line-height: 1.6;">Работает на всех платформах: iOS, Android, Web, Desktop</p>
        </div>
      </div>
    </div>
  </section>
  <footer id="contact" style="padding: 3rem 2rem; background: rgba(0,0,0,0.2); text-align: center;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <p style="opacity: 0.8;">© 2025 CloudSync. Все права защищены.</p>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif; }
button:hover { }
a:hover { opacity: 0.8; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h2 { font-size: 2.5rem !important; line-height: 1.2 !important; }
  section { padding: 3rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
  button { width: 100%; margin-bottom: 0.5rem; }
}`,
};

