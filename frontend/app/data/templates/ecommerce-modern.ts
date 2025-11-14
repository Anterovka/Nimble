import type { Template } from '../templateTypes';

export const ecommerceModernTemplate: Template = {
  id: "ecommerce-1",
  name: "Магазин - Современный",
  description: "Современный дизайн интернет-магазина",
  category: "E-commerce",
  preview: "🛒",
  html: `<div style="min-height: 100vh; background: #f1f5f9; display: flex; flex-direction: column;">
  <header style="background: #0f172a; color: white;">
    <div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: 1.75rem; font-weight: 700;">ShopMaster</span>
      <nav style="display: flex; gap: 1.5rem;">
        <a href="#catalog" style="color: rgba(255,255,255,0.85); text-decoration: none;">Каталог</a>
        <a href="#delivery" style="color: rgba(255,255,255,0.85); text-decoration: none;">Доставка</a>
        <a href="#contacts" style="color: rgba(255,255,255,0.85); text-decoration: none;">Контакты</a>
      </nav>
      <div style="display: flex; gap: 1rem;">
        <a href="#" style="color: white; text-decoration: none;">Войти</a>
        <a href="#" style="padding: 0.6rem 1.4rem; background: #2563eb; color: white; border-radius: 999px; text-decoration: none; font-weight: 600;">Регистрация</a>
      </div>
    </div>
  </header>
  <main style="flex: 1;">
    <section style="background: white;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 3.5rem 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; align-items: center;">
        <div>
          <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.85rem; color: #2563eb; margin-bottom: 1rem;">Новая коллекция</p>
          <h1 style="font-size: clamp(2.5rem, 4vw, 3.5rem); margin-bottom: 1.5rem; color: #0f172a;">Шопинг с доставкой за 24 часа</h1>
          <p style="font-size: 1.05rem; color: #475569; margin-bottom: 2rem;">Откройте для себя подборку трендовых товаров по честным ценам и с заботой о сервисе.</p>
          <div style="display: flex; gap: 1rem;">
            <a href="#catalog" style="padding: 0.9rem 1.8rem; background: #2563eb; color: white; border-radius: 0.75rem; text-decoration: none; font-weight: 600;">Смотреть каталог</a>
            <a href="#delivery" style="padding: 0.9rem 1.8rem; border: 1px solid #cbd5f5; border-radius: 0.75rem; text-decoration: none; color: #2563eb; font-weight: 600;">Условия доставки</a>
          </div>
        </div>
        <div style="height: 320px; border-radius: 24px; background: url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800') center/cover; position: relative;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(147, 51, 234, 0.8)); border-radius: 24px;"></div>
        </div>
      </div>
    </section>
    <section id="catalog" style="max-width: 1200px; margin: 0 auto; padding: 3rem 2rem;">
      <h2 style="font-size: 2.25rem; margin-bottom: 2rem; text-align: center; color: #0f172a;">Каталог товаров</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 2rem;">
        <div style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: white;">
          <div style="height: 200px; background: url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600') center/cover;"></div>
          <div style="padding: 1.5rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Товар 1</h3>
            <p style="color: #64748b; margin-bottom: 1rem;">Описание товара</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 1.5rem; font-weight: bold; color: #667eea;">1 990 ₽</span>
              <button style="padding: 0.6rem 1.1rem; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">В корзину</button>
            </div>
          </div>
        </div>
        <div style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: white;">
          <div style="height: 200px; background: url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600') center/cover;"></div>
          <div style="padding: 1.5rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Товар 2</h3>
            <p style="color: #64748b; margin-bottom: 1rem;">Описание товара</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 1.5rem; font-weight: bold; color: #f5576c;">2 490 ₽</span>
              <button style="padding: 0.6rem 1.1rem; background: #f5576c; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">В корзину</button>
            </div>
          </div>
        </div>
        <div style="border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: white;">
          <div style="height: 200px; background: url('https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600') center/cover;"></div>
          <div style="padding: 1.5rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Товар 3</h3>
            <p style="color: #64748b; margin-bottom: 1rem;">Описание товара</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 1.5rem; font-weight: bold; color: #00f2fe;">3 290 ₽</span>
              <button style="padding: 0.6rem 1.1rem; background: #0ea5e9; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">В корзину</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer id="contacts" style="background: #0f172a; color: rgba(255,255,255,0.8); padding: 2.5rem 2rem;">
    <div style="max-width: 1200px; margin: 0 auto; display: grid; gap: 2rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      <div>
        <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: white;">ShopMaster</h4>
        <p style="opacity: 0.7;">Лучшие товары с моментальной доставкой по всей стране.</p>
      </div>
      <div>
        <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: white;">Поддержка</h4>
        <a href="mailto:support@shopmaster.ru" style="color: inherit; text-decoration: none; display: block;">support@shopmaster.ru</a>
        <a href="tel:+78000000000" style="color: inherit; text-decoration: none; display: block;">+7 (800) 000-00-00</a>
      </div>
      <div id="delivery">
        <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: white;">Доставка и оплата</h4>
        <a href="#" style="color: inherit; text-decoration: none; display: block; margin-bottom: 0.3rem;">Способы доставки</a>
        <a href="#" style="color: inherit; text-decoration: none; display: block; margin-bottom: 0.3rem;">Возврат товара</a>
        <a href="#" style="color: inherit; text-decoration: none; display: block;">Условия оплаты</a>
      </div>
    </div>
    <div style="max-width: 1200px; margin: 2rem auto 0; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; font-size: 0.85rem; opacity: 0.6;">
      <span>© 2025 ShopMaster. Все права защищены.</span>
      <span>Политика конфиденциальности · Пользовательское соглашение</span>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background: #f8f9fa; }
header nav a:hover,
footer a:hover { text-decoration: underline; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h1 { font-size: 2rem !important; }
  section { padding: 2rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
  div[style*="display: flex; gap"] { flex-direction: column !important; }
}`,
};


