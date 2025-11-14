import type { Template } from '../templateTypes';

export const restaurantElegantTemplate: Template = {
  id: "restaurant-elegant",
  name: "Ресторан - Элегантный",
  description: "Элегантный сайт для ресторана или кафе",
  category: "Ресторан",
  preview: "🍽️",
  html: `<div style="min-height: 100vh; background: #1a1a1a; color: #fff; display: flex; flex-direction: column;">
  <header style="padding: 2rem; position: absolute; top: 0; left: 0; right: 0; z-index: 100; background: rgba(26,26,26,0.8); backdrop-filter: blur(10px);">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <h1 style="font-size: 2rem; font-weight: 300; letter-spacing: 4px; font-family: 'Georgia', serif;">BISTRO NOIR</h1>
      <nav style="display: flex; gap: 2.5rem;">
        <a href="#menu" style="color: inherit; text-decoration: none; font-weight: 300; letter-spacing: 1px;">Меню</a>
        <a href="#about" style="color: inherit; text-decoration: none; font-weight: 300; letter-spacing: 1px;">О нас</a>
        <a href="#reservations" style="color: inherit; text-decoration: none; font-weight: 300; letter-spacing: 1px;">Бронирование</a>
      </nav>
      <button style="padding: 0.8rem 2rem; background: #d4af37; color: #1a1a1a; border: none; border-radius: 0; font-weight: 600; letter-spacing: 1px; cursor: pointer;">Забронировать стол</button>
    </div>
  </header>
  <section style="min-height: 100vh; background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200') center/cover; display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem;">
    <div style="max-width: 800px;">
      <div style="width: 100px; height: 2px; background: #d4af37; margin: 0 auto 2rem;"></div>
      <h2 style="font-size: 5rem; font-weight: 300; margin-bottom: 1.5rem; letter-spacing: 2px; font-family: 'Georgia', serif;">Изысканная кухня</h2>
      <p style="font-size: 1.3rem; margin-bottom: 3rem; color: #ccc; font-weight: 300; letter-spacing: 1px;">Где традиции встречаются с инновациями</p>
      <button style="padding: 1rem 3rem; background: transparent; color: #d4af37; border: 2px solid #d4af37; font-size: 1rem; font-weight: 600; letter-spacing: 2px; cursor: pointer;">Наше меню</button>
    </div>
  </section>
  <section id="about" style="padding: 8rem 2rem; background: #1a1a1a;">
    <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center;">
      <div>
        <div style="width: 60px; height: 2px; background: #d4af37; margin-bottom: 2rem;"></div>
        <h3 style="font-size: 3rem; font-weight: 300; margin-bottom: 1.5rem; font-family: 'Georgia', serif; letter-spacing: 1px;">Наша история</h3>
        <p style="font-size: 1.1rem; line-height: 1.8; color: #aaa; margin-bottom: 1.5rem;">Основанный в 2010 году, Bistro Noir стал символом изысканной кухни и безупречного сервиса.</p>
        <p style="font-size: 1.1rem; line-height: 1.8; color: #aaa;">Наш шеф-повар с более чем 20-летним опытом создаёт уникальные блюда, сочетающие классические рецепты с современными техниками.</p>
      </div>
      <div style="background: #2a2a2a; padding: 0; border: 1px solid #333; overflow: hidden;">
        <div style="height: 200px; background: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600') center/cover;"></div>
        <div style="text-align: center; padding: 2rem;">
          <div style="font-size: 4rem; font-weight: 300; color: #d4af37; margin-bottom: 0.5rem;">15+</div>
          <div style="color: #aaa; letter-spacing: 1px;">Лет опыта</div>
        </div>
        <div style="text-align: center; padding: 2rem; border-top: 1px solid #333;">
          <div style="font-size: 4rem; font-weight: 300; color: #d4af37; margin-bottom: 0.5rem;">5000+</div>
          <div style="color: #aaa; letter-spacing: 1px;">Довольных гостей</div>
        </div>
      </div>
    </div>
  </section>
  <section id="menu" style="padding: 8rem 2rem; background: #0f0f0f;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 5rem;">
        <div style="width: 100px; height: 2px; background: #d4af37; margin: 0 auto 2rem;"></div>
        <h3 style="font-size: 3.5rem; font-weight: 300; font-family: 'Georgia', serif; letter-spacing: 2px;">Наше меню</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem;">
        <div style="border: 1px solid #333; padding: 0; overflow: hidden;">
          <div style="height: 200px; background: url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600') center/cover;"></div>
          <div style="padding: 2.5rem;">
            <h4 style="font-size: 1.5rem; margin-bottom: 1rem; color: #d4af37; font-family: 'Georgia', serif;">Закуски</h4>
          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="font-weight: 600;">Тартар из тунца</span>
              <span style="color: #d4af37;">1,200 ₽</span>
            </div>
            <p style="color: #888; font-size: 0.9rem;">Свежий тунец, авокадо, соус из васаби</p>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="font-weight: 600;">Фуа-гра</span>
              <span style="color: #d4af37;">2,500 ₽</span>
            </div>
            <p style="color: #888; font-size: 0.9rem;">С брусничным соусом и тостами</p>
          </div>
          </div>
        </div>
        <div style="border: 1px solid #333; padding: 0; overflow: hidden;">
          <div style="height: 200px; background: url('https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600') center/cover;"></div>
          <div style="padding: 2.5rem;">
            <h4 style="font-size: 1.5rem; margin-bottom: 1rem; color: #d4af37; font-family: 'Georgia', serif;">Основные блюда</h4>
          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="font-weight: 600;">Стейк рибай</span>
              <span style="color: #d4af37;">3,200 ₽</span>
            </div>
            <p style="color: #888; font-size: 0.9rem;">450г, средней прожарки, овощи гриль</p>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="font-weight: 600;">Лосось на пару</span>
              <span style="color: #d4af37;">2,800 ₽</span>
            </div>
            <p style="color: #888; font-size: 0.9rem;">С овощами и соусом из лимона</p>
          </div>
          </div>
        </div>
        <div style="border: 1px solid #333; padding: 0; overflow: hidden;">
          <div style="height: 200px; background: url('https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600') center/cover;"></div>
          <div style="padding: 2.5rem;">
            <h4 style="font-size: 1.5rem; margin-bottom: 1rem; color: #d4af37; font-family: 'Georgia', serif;">Десерты</h4>
          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="font-weight: 600;">Тирамису</span>
              <span style="color: #d4af37;">850 ₽</span>
            </div>
            <p style="color: #888; font-size: 0.9rem;">Классический рецепт</p>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span style="font-weight: 600;">Шоколадный фондан</span>
              <span style="color: #d4af37;">950 ₽</span>
            </div>
            <p style="color: #888; font-size: 0.9rem;">С ванильным мороженым</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <footer id="reservations" style="padding: 4rem 2rem; background: #0a0a0a; border-top: 1px solid #222; text-align: center;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h3 style="font-size: 2.5rem; font-weight: 300; margin-bottom: 2rem; font-family: 'Georgia', serif; letter-spacing: 2px;">Забронировать стол</h3>
      <p style="color: #888; margin-bottom: 2rem;">Телефон: +7 (495) 123-45-67</p>
      <p style="color: #888;">Адрес: Москва, ул. Тверская, 10</p>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Georgia', 'Times New Roman', serif; }
button:hover { background: #d4af37 !important; color: #1a1a1a !important; }
a:hover { color: #d4af37 !important; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h2 { font-size: 2.5rem !important; }
  section { padding: 3rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
  div[style*="display: grid; grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
}`,
};

