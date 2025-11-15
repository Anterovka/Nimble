// музыкальный лейбл шаблон
import type { Template } from '../templateTypes';

export const musicLabelTemplate: Template = {
  id: "music-label",
  name: "Музыка - Лейбл",
  description: "Современный сайт для музыкального лейбла или артиста",
  category: "Музыка",
  preview: "🎵",
  html: `<div style="min-height: 100vh; background: #000000; color: #fff; display: flex; flex-direction: column;">
  <header style="padding: 2rem; position: sticky; top: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(20px); z-index: 100; border-bottom: 1px solid #222;">
    <div style="max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
      <h1 style="font-size: 1.8rem; font-weight: 900; letter-spacing: 2px;">SOUNDWAVE</h1>
      <nav style="display: flex; gap: 2.5rem;">
        <a href="#artists" style="color: inherit; text-decoration: none; font-weight: 600;">Артисты</a>
        <a href="#releases" style="color: inherit; text-decoration: none; font-weight: 600;">Релизы</a>
        <a href="#events" style="color: inherit; text-decoration: none; font-weight: 600;">События</a>
      </nav>
      <button style="padding: 0.75rem 1.5rem; background: #ff006e; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">Связаться</button>
    </div>
  </header>
  <main style="flex: 1;">
    <section style="padding: 8rem 2rem; background: linear-gradient(135deg, #000000 0%, #1a0033 100%); text-align: center; position: relative; overflow: hidden;">
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 50% 50%, rgba(255,0,110,0.1), transparent);"></div>
      <div style="max-width: 900px; margin: 0 auto; position: relative; z-index: 1;">
        <h2 style="font-size: 6rem; font-weight: 900; line-height: 1; margin-bottom: 2rem; letter-spacing: -3px; background: linear-gradient(135deg, #ff006e, #8338ec); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">ЗВУК<br/>БУДУЩЕГО</h2>
        <p style="font-size: 1.5rem; margin-bottom: 3rem; color: #aaa; line-height: 1.6;">Независимый музыкальный лейбл, открывающий новые таланты</p>
        <button style="padding: 1.2rem 2.5rem; background: linear-gradient(135deg, #ff006e, #8338ec); color: white; border: none; border-radius: 12px; font-size: 1.1rem; font-weight: 700; cursor: pointer; box-shadow: 0 10px 40px rgba(255, 0, 110, 0.4);">Слушать музыку</button>
      </div>
    </section>
    <section id="releases" style="padding: 6rem 2rem; background: #000;">
      <div style="max-width: 1400px; margin: 0 auto;">
        <h3 style="text-align: center; font-size: 3.5rem; font-weight: 900; margin-bottom: 4rem;">Новые релизы</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
          <div style="background: #1a1a1a; border: 1px solid #222; border-radius: 20px; overflow: hidden; cursor: pointer;">
            <div style="height: 300px; background: url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800') center/cover; position: relative;">
              <div style="position: absolute; bottom: 1rem; right: 1rem; width: 60px; height: 60px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer;">▶</div>
            </div>
            <div style="padding: 2rem;">
              <h4 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem;">Midnight Dreams</h4>
              <p style="color: #888; margin-bottom: 1rem;">Artist Name</p>
              <div style="display: flex; gap: 1rem; color: #666; font-size: 0.9rem;">
                <span>🎵 Electronic</span>
                <span>📅 2024</span>
              </div>
            </div>
          </div>
          <div style="background: #1a1a1a; border: 1px solid #222; border-radius: 20px; overflow: hidden; cursor: pointer;">
            <div style="height: 300px; background: url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800') center/cover; position: relative;">
              <div style="position: absolute; bottom: 1rem; right: 1rem; width: 60px; height: 60px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer;">▶</div>
            </div>
            <div style="padding: 2rem;">
              <h4 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem;">Neon Nights</h4>
              <p style="color: #888; margin-bottom: 1rem;">Artist Name</p>
              <div style="display: flex; gap: 1rem; color: #666; font-size: 0.9rem;">
                <span>🎵 House</span>
                <span>📅 2024</span>
              </div>
            </div>
          </div>
          <div style="background: #1a1a1a; border: 1px solid #222; border-radius: 20px; overflow: hidden; cursor: pointer;">
            <div style="height: 300px; background: url('https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800') center/cover; position: relative;">
              <div style="position: absolute; bottom: 1rem; right: 1rem; width: 60px; height: 60px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; cursor: pointer;">▶</div>
            </div>
            <div style="padding: 2rem;">
              <h4 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.5rem;">City Lights</h4>
              <p style="color: #888; margin-bottom: 1rem;">Artist Name</p>
              <div style="display: flex; gap: 1rem; color: #666; font-size: 0.9rem;">
                <span>🎵 Techno</span>
                <span>📅 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="artists" style="padding: 6rem 2rem; background: #0a0a0a;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h3 style="text-align: center; font-size: 3.5rem; font-weight: 900; margin-bottom: 4rem;">Наши артисты</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
          <div style="text-align: center;">
            <div style="width: 200px; height: 200px; background: url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400') center/cover; border-radius: 50%; margin: 0 auto 1.5rem; border: 3px solid #333;"></div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">DJ PRODIGY</h4>
            <p style="color: #888; font-size: 0.9rem;">Electronic / House</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 200px; height: 200px; background: url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400') center/cover; border-radius: 50%; margin: 0 auto 1.5rem; border: 3px solid #333;"></div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">SYNTH WAVE</h4>
            <p style="color: #888; font-size: 0.9rem;">Synthwave / Retro</p>
          </div>
          <div style="text-align: center;">
            <div style="width: 200px; height: 200px; background: url('https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400') center/cover; border-radius: 50%; margin: 0 auto 1.5rem; border: 3px solid #333;"></div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">NEON DREAMS</h4>
            <p style="color: #888; font-size: 0.9rem;">Techno / Ambient</p>
          </div>
        </div>
      </div>
    </section>
    <section id="events" style="padding: 6rem 2rem; background: #000;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h3 style="text-align: center; font-size: 3.5rem; font-weight: 900; margin-bottom: 4rem;">Ближайшие события</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
          <div style="background: #1a1a1a; border: 1px solid #222; padding: 2.5rem; border-radius: 20px;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎤</div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Live Concert</h4>
            <p style="color: #888; margin-bottom: 1.5rem; line-height: 1.6;">Москва, клуб "Арена"</p>
            <div style="color: #ff006e; font-weight: 700;">15 декабря 2024</div>
          </div>
          <div style="background: #1a1a1a; border: 1px solid #222; padding: 2.5rem; border-radius: 20px;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎧</div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">DJ Set Night</h4>
            <p style="color: #888; margin-bottom: 1.5rem; line-height: 1.6;">Санкт-Петербург, "Клуб"</p>
            <div style="color: #ff006e; font-weight: 700;">22 декабря 2024</div>
          </div>
          <div style="background: #1a1a1a; border: 1px solid #222; padding: 2.5rem; border-radius: 20px;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎹</div>
            <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 1rem;">Studio Session</h4>
            <p style="color: #888; margin-bottom: 1.5rem; line-height: 1.6;">Онлайн-трансляция</p>
            <div style="color: #ff006e; font-weight: 700;">30 декабря 2024</div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <footer style="padding: 4rem 2rem; background: #0a0a0a; border-top: 1px solid #222; text-align: center;">
    <div style="max-width: 1200px; margin: 0 auto;">
      <h3 style="font-size: 2rem; font-weight: 900; margin-bottom: 2rem; letter-spacing: 2px;">SOUNDWAVE</h3>
      <p style="color: #666; margin-bottom: 1rem;">Независимый музыкальный лейбл</p>
      <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 2rem;">
        <a href="#" style="color: #888; text-decoration: none; font-weight: 500;">Яндекс Музыка</a>
        <a href="#" style="color: #888; text-decoration: none; font-weight: 500;">Apple Music</a>
        <a href="#" style="color: #888; text-decoration: none; font-weight: 500;">Rutube</a>
        <a href="#" style="color: #888; text-decoration: none; font-weight: 500;">ВКонтакте</a>
      </div>
    </div>
  </footer>
</div>`,
  css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
@media (max-width: 768px) {
  header nav { display: none !important; }
  h2 { font-size: 3rem !important; line-height: 1.1 !important; }
  section { padding: 3rem 1rem !important; }
  div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
}`,
};

