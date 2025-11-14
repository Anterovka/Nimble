import type { Template } from '../templateTypes';

export const fitnessCoachTemplate: Template = {
  id: "fitness-coach",
  name: "Фитнес - Тренер",
  description: "Сайт для фитнес-тренера или спортзала",
  category: "Фитнес",
  preview: "💪",
  html: `<div style="min-height: 100vh; background: #0a0a0a; color: #fff; display: flex; flex-direction: column;">
  <header style="padding: 2rem; position: sticky; top: 0; background: rgba(10,10,10,0.95); backdrop-filter: blur(20px); z-index: 100; border-bottom: 1px solid #222;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <h1 style="font-size: 1.8rem; font-weight: 900; letter-spacing: -0.5px;">POWER GYM</h1>
      <nav style="display: flex; gap: 2rem;">
        <a href="#programs" style="color: inherit; text-decoration: none; font-weight: 600;">Программы</a>
        <a href="#trainers" style="color: inherit; text-decoration: none; font-weight: 600;">Тренеры</a>
        <a href="#pricing" style="color: inherit; text-decoration: none; font-weight: 600;">Цены</a>
      </nav>
      <button style="padding: 0.75rem 1.5rem; background: #ff6b35; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Начать</button>
    </div>
  </header>
  <main style="flex: 1;">
    <section style="padding: 8rem 2rem; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); text-align: center;">
      <div style="max-width: 900px; margin: 0 auto;">
        <div style="display: inline-block; padding: 0.5rem 1.5rem; background: rgba(255, 107, 53, 0.2); border: 1px solid #ff6b35; border-radius: 50px; margin-bottom: 2rem; font-size: 0.9rem; font-weight: 700; color: #ff6b35;">🔥 Трансформируй своё тело</div>
        <h2 style="font-size: 5rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -3px;">Стань сильнее.<br/>Стань лучше.</h2>
        <p style="font-size: 1.4rem; margin-bottom: 3rem; color: #888; line-height: 1.6;">Персональные тренировки и программы питания для достижения ваших целей</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button style="padding: 1.2rem 2.5rem; background: #ff6b35; color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 40px rgba(255, 107, 53, 0.4);">Бесплатная пробная тренировка</button>
          <button style="padding: 1.2rem 2.5rem; background: transparent; color: white; border: 2px solid #333; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer;">Узнать больше</button>
        </div>
      </div>
    </section>
    <section id="programs" style="padding: 6rem 2rem; background: #0a0a0a;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h3 style="text-align: center; font-size: 3.5rem; font-weight: 900; margin-bottom: 4rem;">Наши программы</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <div style="background: #1a1a1a; border: 1px solid #222; border-radius: 20px; overflow: hidden;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800') center/cover;"></div>
            <div style="padding: 3rem;">
              <h4 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 1rem;">Силовые тренировки</h4>
              <p style="color: #888; line-height: 1.6; margin-bottom: 2rem;">Набор мышечной массы и увеличение силы с персональным тренером</p>
              <div style="color: #ff6b35; font-weight: 700; font-size: 1.1rem;">От 3,000 ₽/мес</div>
            </div>
          </div>
          <div style="background: #1a1a1a; border: 1px solid #222; border-radius: 20px; overflow: hidden;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800') center/cover;"></div>
            <div style="padding: 3rem;">
              <h4 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 1rem;">Кардио программы</h4>
              <p style="color: #888; line-height: 1.6; margin-bottom: 2rem;">Сжигание жира и улучшение выносливости</p>
              <div style="color: #ff6b35; font-weight: 700; font-size: 1.1rem;">От 2,500 ₽/мес</div>
            </div>
          </div>
          <div style="background: #1a1a1a; border: 1px solid #222; border-radius: 20px; overflow: hidden;">
            <div style="height: 200px; background: url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800') center/cover;"></div>
            <div style="padding: 3rem;">
              <h4 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 1rem;">Питание</h4>
              <p style="color: #888; line-height: 1.6; margin-bottom: 2rem;">Индивидуальный план питания для ваших целей</p>
              <div style="color: #ff6b35; font-weight: 700; font-size: 1.1rem;">От 2,000 ₽/мес</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="trainers" style="padding: 6rem 2rem; background: #1a1a1a;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h3 style="text-align: center; font-size: 3.5rem; font-weight: 900; margin-bottom: 4rem;">Наши тренеры</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
          <div style="background: #0a0a0a; padding: 2rem; border-radius: 16px; text-align: center;">
            <div style="width: 150px; height: 150px; background: url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400') center/cover; border-radius: 50%; margin: 0 auto 1.5rem; border: 3px solid #ff6b35;"></div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Алексей Петров</h4>
            <p style="color: #ff6b35; margin-bottom: 1rem; font-weight: 600;">Главный тренер</p>
            <p style="color: #888; font-size: 0.9rem;">10+ лет опыта, специализация: силовые тренировки</p>
          </div>
          <div style="background: #0a0a0a; padding: 2rem; border-radius: 16px; text-align: center;">
            <div style="width: 150px; height: 150px; background: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400') center/cover; border-radius: 50%; margin: 0 auto 1.5rem; border: 3px solid #ff6b35;"></div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Мария Соколова</h4>
            <p style="color: #ff6b35; margin-bottom: 1rem; font-weight: 600;">Тренер по кардио</p>
            <p style="color: #888; font-size: 0.9rem;">7+ лет опыта, специализация: функциональный тренинг</p>
          </div>
          <div style="background: #0a0a0a; padding: 2rem; border-radius: 16px; text-align: center;">
            <div style="width: 150px; height: 150px; background: url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400') center/cover; border-radius: 50%; margin: 0 auto 1.5rem; border: 3px solid #ff6b35;"></div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Дмитрий Иванов</h4>
            <p style="color: #ff6b35; margin-bottom: 1rem; font-weight: 600;">Нутрициолог</p>
            <p style="color: #888; font-size: 0.9rem;">5+ лет опыта, специализация: спортивное питание</p>
          </div>
        </div>
      </div>
    </section>
    <section id="pricing" style="padding: 6rem 2rem; background: #0a0a0a;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h3 style="text-align: center; font-size: 3.5rem; font-weight: 900; margin-bottom: 4rem;">Тарифы</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
          <div style="background: #1a1a1a; border: 1px solid #222; padding: 3rem; border-radius: 20px;">
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Базовый</h4>
            <div style="font-size: 3rem; font-weight: 900; margin-bottom: 1rem; color: #ff6b35;">3,000 ₽<span style="font-size: 1rem; color: #888; font-weight: 400;">/мес</span></div>
            <ul style="list-style: none; margin-bottom: 2rem; color: #888;">
              <li style="margin-bottom: 0.75rem;">✓ 8 тренировок в месяц</li>
              <li style="margin-bottom: 0.75rem;">✓ Групповые занятия</li>
              <li style="margin-bottom: 0.75rem;">✓ Доступ к залу</li>
            </ul>
            <button style="width: 100%; padding: 1rem; background: transparent; color: white; border: 2px solid #333; border-radius: 12px; font-weight: 700; cursor: pointer;">Выбрать</button>
          </div>
          <div style="background: linear-gradient(135deg, #ff6b35, #f7931e); border: 2px solid #ff6b35; padding: 3rem; border-radius: 20px;">
            <div style="display: inline-block; padding: 0.25rem 0.75rem; background: rgba(255,255,255,0.2); border-radius: 20px; margin-bottom: 1rem; font-size: 0.8rem; font-weight: 700;">ПОПУЛЯРНЫЙ</div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Премиум</h4>
            <div style="font-size: 3rem; font-weight: 900; margin-bottom: 1rem;">6,000 ₽<span style="font-size: 1rem; opacity: 0.8; font-weight: 400;">/мес</span></div>
            <ul style="list-style: none; margin-bottom: 2rem; opacity: 0.95;">
              <li style="margin-bottom: 0.75rem;">✓ 16 тренировок в месяц</li>
              <li style="margin-bottom: 0.75rem;">✓ Персональный тренер</li>
              <li style="margin-bottom: 0.75rem;">✓ План питания</li>
              <li style="margin-bottom: 0.75rem;">✓ Безлимитный доступ</li>
            </ul>
            <button style="width: 100%; padding: 1rem; background: white; color: #ff6b35; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">Выбрать</button>
          </div>
          <div style="background: #1a1a1a; border: 1px solid #222; padding: 3rem; border-radius: 20px;">
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">VIP</h4>
            <div style="font-size: 3rem; font-weight: 900; margin-bottom: 1rem; color: #ff6b35;">12,000 ₽<span style="font-size: 1rem; color: #888; font-weight: 400;">/мес</span></div>
            <ul style="list-style: none; margin-bottom: 2rem; color: #888;">
              <li style="margin-bottom: 0.75rem;">✓ Безлимитные тренировки</li>
              <li style="margin-bottom: 0.75rem;">✓ 2 персональных тренера</li>
              <li style="margin-bottom: 0.75rem;">✓ Индивидуальный план</li>
              <li style="margin-bottom: 0.75rem;">✓ Приоритетная запись</li>
            </ul>
            <button style="width: 100%; padding: 1rem; background: transparent; color: white; border: 2px solid #333; border-radius: 12px; font-weight: 700; cursor: pointer;">Выбрать</button>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer style="padding: 4rem 2rem; background: #1a1a1a; border-top: 1px solid #222; text-align: center;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h3 style="font-size: 2rem; font-weight: 900; margin-bottom: 2rem;">POWER GYM</h3>
      <p style="color: #888; margin-bottom: 1rem;">Москва, ул. Спортивная, 15</p>
      <p style="color: #888;">Телефон: +7 (495) 123-45-67</p>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
button:hover { }
a:hover { color: #ff6b35 !important; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h2 { font-size: 2.5rem !important; line-height: 1.2 !important; }
  section { padding: 3rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
  button { width: 100%; }
}`,
};

