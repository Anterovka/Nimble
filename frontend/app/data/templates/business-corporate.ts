// корпоративный бизнес шаблон
import type { Template } from '../templateTypes';

export const businessCorporateTemplate: Template = {
  id: "business-1",
  name: "Бизнес - Корпоративный",
  description: "Профессиональный корпоративный сайт",
  category: "Бизнес",
  preview: "🏢",
  html: `<div style="background: #fff; min-height: 100vh; display: flex; flex-direction: column;">
  <header style="border-bottom: 1px solid #e5e7eb;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 1.6rem; font-weight: 700; color: #1e3a8a;">CorporatePro</span>
      <nav style="display: flex; gap: 1.5rem;">
        <a href="#" style="color: #1f2937; text-decoration: none; font-weight: 600;">О компании</a>
        <a href="#services" style="color: #1f2937; text-decoration: none;">Услуги</a>
        <a href="#contact" style="color: #1f2937; text-decoration: none;">Контакты</a>
      </nav>
      <a href="mailto:info@corporate.pro" style="padding: 0.75rem 1.5rem; background: #1e3a8a; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">Связаться</a>
    </div>
  </header>
  <main style="flex: 1;">
    <section style="padding: 6rem 2rem; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; text-align: center;">
      <div style="max-width: 980px; margin: 0 auto;">
        <h1 style="font-size: 3.5rem; font-weight: bold; margin-bottom: 1rem;">Ваш надежный партнер</h1>
        <p style="font-size: 1.25rem; margin-bottom: 2.5rem; opacity: 0.9;">Мы помогаем бизнесу расти и развиваться</p>
        <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 1rem;">
          <a href="#contact" style="padding: 1rem 2.5rem; background: white; color: #1e3a8a; border-radius: 8px; font-size: 1.1rem; font-weight: 600; text-decoration: none;">Связаться с нами</a>
          <a href="#services" style="padding: 1rem 2.5rem; border: 2px solid white; border-radius: 8px; font-size: 1.1rem; font-weight: 600; color: white; text-decoration: none;">Узнать больше</a>
        </div>
      </div>
    </section>
    <section id="services" style="padding: 4rem 2rem; background: #f8f9fa;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #1e3a8a;">Наши услуги</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 35px rgba(30, 58, 138, 0.08);">
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #1e3a8a;">Консалтинг</h3>
            <p style="color: #666;">Профессиональные консультации для вашего бизнеса</p>
          </div>
          <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 35px rgba(30, 58, 138, 0.08);">
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #1e3a8a;">Разработка</h3>
            <p style="color: #666;">Создание решений под ваши задачи</p>
          </div>
          <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 35px rgba(30, 58, 138, 0.08);">
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #1e3a8a;">Поддержка</h3>
            <p style="color: #666;">Круглосуточная поддержка и обслуживание</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer id="contact" style="background: #0f172a; color: rgba(255, 255, 255, 0.85); padding: 2.5rem 2rem;">
    <div style="max-width: 1200px; margin: 0 auto; display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      <div>
        <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem;">CorporatePro</h4>
        <p style="opacity: 0.7;">Комплексные решения для вашего бизнеса</p>
      </div>
      <div>
        <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem;">Контакты</h4>
        <p style="opacity: 0.7;">info@corporate.pro</p>
        <p style="opacity: 0.7;">+7 (800) 000-00-00</p>
      </div>
      <div>
        <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem;">Документы</h4>
        <a href="#" style="color: inherit; text-decoration: none; display: block; opacity: 0.7;">Политика конфиденциальности</a>
        <a href="#" style="color: inherit; text-decoration: none; display: block; opacity: 0.7;">Условия сотрудничества</a>
      </div>
    </div>
    <div style="max-width: 1200px; margin: 2rem auto 0; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; opacity: 0.6;">
      <span>© 2025 CorporatePro. Все права защищены.</span>
      <span>Создано с заботой о клиентах</span>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h1 { font-size: 2rem !important; }
  section { padding: 3rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
}`,
};


