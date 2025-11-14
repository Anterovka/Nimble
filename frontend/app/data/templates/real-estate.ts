import type { Template } from '../templateTypes';

export const realEstateTemplate: Template = {
  id: "real-estate",
  name: "Недвижимость - Премиум",
  description: "Современный сайт для агентства недвижимости",
  category: "Недвижимость",
  preview: "🏠",
  html: `<div style="min-height: 100vh; background: #ffffff; color: #1a1a1a; display: flex; flex-direction: column;">
  <header style="padding: 1.5rem 2rem; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100;">
    <div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <h1 style="font-size: 1.8rem; font-weight: 800; color: #2563eb;">ELITE PROPERTIES</h1>
      <nav style="display: flex; gap: 2rem;">
        <a href="#properties" style="color: inherit; text-decoration: none; font-weight: 600;">Объекты</a>
        <a href="#about" style="color: inherit; text-decoration: none; font-weight: 600;">О нас</a>
        <a href="#contact" style="color: inherit; text-decoration: none; font-weight: 600;">Контакты</a>
      </nav>
      <button style="padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Продать недвижимость</button>
    </div>
  </header>
  <main style="flex: 1;">
    <section style="padding: 6rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center;">
      <div style="max-width: 900px; margin: 0 auto;">
        <h2 style="font-size: 4.5rem; font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -2px;">Найдите дом<br/>своей мечты</h2>
        <p style="font-size: 1.3rem; margin-bottom: 3rem; opacity: 0.95;">Премиальная недвижимость в лучших районах города</p>
        <div style="display: flex; gap: 1rem; justify-content: center; background: white; padding: 1rem; border-radius: 16px; max-width: 700px; margin: 0 auto; flex-wrap: wrap;">
          <input type="text" placeholder="Район, адрес..." style="flex: 1; min-width: 200px; padding: 1rem; border: none; border-radius: 8px; font-size: 1rem; background: #f5f5f5;" />
          <select style="padding: 1rem; border: none; border-radius: 8px; font-size: 1rem; background: #f5f5f5; min-width: 150px;">
            <option>Тип</option>
            <option>Квартира</option>
            <option>Дом</option>
            <option>Коммерческая</option>
          </select>
          <button style="padding: 1rem 2rem; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Найти</button>
        </div>
      </div>
    </section>
    <section id="properties" style="padding: 6rem 2rem; background: #f8f9fa;">
      <div style="max-width: 1400px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4rem; flex-wrap: wrap; gap: 1rem;">
          <h3 style="font-size: 3rem; font-weight: 900;">Премиальные объекты</h3>
          <div style="display: flex; gap: 0.5rem;">
            <button style="padding: 0.75rem 1.5rem; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Все</button>
            <button style="padding: 0.75rem 1.5rem; background: white; color: #1a1a1a; border: 1px solid #ddd; border-radius: 8px; font-weight: 600; cursor: pointer;">Квартиры</button>
            <button style="padding: 0.75rem 1.5rem; background: white; color: #1a1a1a; border: 1px solid #ddd; border-radius: 8px; font-weight: 600; cursor: pointer;">Дома</button>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
          <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); cursor: pointer;">
            <div style="height: 300px; background: url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800') center/cover; position: relative;">
              <div style="position: absolute; top: 1rem; right: 1rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.9); border-radius: 20px; font-weight: 700; color: #2563eb;">НОВОЕ</div>
            </div>
            <div style="padding: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                  <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Пентхаус в центре</h4>
                  <p style="color: #666; font-size: 0.9rem;">Москва, Тверская улица</p>
                </div>
                <div style="font-size: 1.8rem; font-weight: 900; color: #2563eb;">85M ₽</div>
              </div>
              <div style="display: flex; gap: 2rem; padding-top: 1rem; border-top: 1px solid #eee; color: #666; font-size: 0.9rem;">
                <span>🛏️ 3 спальни</span>
                <span>🚿 2 ванные</span>
                <span>📐 180 м²</span>
              </div>
            </div>
          </div>
          <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); cursor: pointer;">
            <div style="height: 300px; background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800') center/cover; position: relative;"></div>
            <div style="padding: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                  <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Загородный дом</h4>
                  <p style="color: #666; font-size: 0.9rem;">Московская область, Рублёвка</p>
                </div>
                <div style="font-size: 1.8rem; font-weight: 900; color: #2563eb;">120M ₽</div>
              </div>
              <div style="display: flex; gap: 2rem; padding-top: 1rem; border-top: 1px solid #eee; color: #666; font-size: 0.9rem;">
                <span>🛏️ 5 спален</span>
                <span>🚿 4 ванные</span>
                <span>📐 450 м²</span>
              </div>
            </div>
          </div>
          <div style="background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); cursor: pointer;">
            <div style="height: 300px; background: url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800') center/cover; position: relative;"></div>
            <div style="padding: 2rem;">
              <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                  <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">Элитная квартира</h4>
                  <p style="color: #666; font-size: 0.9rem;">Москва, Патриаршие пруды</p>
                </div>
                <div style="font-size: 1.8rem; font-weight: 900; color: #2563eb;">45M ₽</div>
              </div>
              <div style="display: flex; gap: 2rem; padding-top: 1rem; border-top: 1px solid #eee; color: #666; font-size: 0.9rem;">
                <span>🛏️ 2 спальни</span>
                <span>🚿 2 ванные</span>
                <span>📐 120 м²</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="about" style="padding: 6rem 2rem; background: white;">
      <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
        <h3 style="font-size: 3.5rem; font-weight: 900; margin-bottom: 2rem;">Почему выбирают нас</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem; margin-top: 4rem;">
          <div>
            <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">15+ лет опыта</h4>
            <p style="color: #666; line-height: 1.6;">Работаем на рынке недвижимости с 2010 года</p>
          </div>
          <div>
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">1000+ сделок</h4>
            <p style="color: #666; line-height: 1.6;">Успешно закрытых сделок за всё время</p>
          </div>
          <div>
            <div style="font-size: 4rem; margin-bottom: 1rem;">⭐</div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">5.0 рейтинг</h4>
            <p style="color: #666; line-height: 1.6;">Средняя оценка наших клиентов</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer id="contact" style="padding: 4rem 2rem; background: #1a1a1a; color: white;">
    <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 3rem;">
      <div>
        <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem;">ELITE PROPERTIES</h4>
        <p style="color: #888; line-height: 1.6;">Премиальное агентство недвижимости</p>
      </div>
      <div>
        <h4 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem;">Контакты</h4>
        <p style="color: #888; margin-bottom: 0.5rem;">+7 (495) 123-45-67</p>
        <p style="color: #888;">info@eliteproperties.ru</p>
      </div>
      <div>
        <h4 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem;">Адрес</h4>
        <p style="color: #888;">Москва, ул. Тверская, 10</p>
      </div>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h2 { font-size: 2.5rem !important; }
  section { padding: 3rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
  input, select { width: 100% !important; margin-bottom: 0.5rem; }
}`,
};

