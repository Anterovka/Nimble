"use client";

import { useEffect, useRef } from "react";
import { HeaderSettings, FooterSettings } from "../../utils/editor/headerFooter";

interface HeaderFooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  headerSettings: HeaderSettings;
  footerSettings: FooterSettings;
  setHeaderSettings: (settings: HeaderSettings) => void;
  setFooterSettings: (settings: FooterSettings) => void;
}

export function HeaderFooterModal({
  isOpen,
  onClose,
  onApply,
  headerSettings,
  footerSettings,
  setHeaderSettings,
  setFooterSettings,
}: HeaderFooterModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const modalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !modalBodyRef.current) return;

    const modalBody = modalBodyRef.current;

    const handleWheel = (e: WheelEvent) => {
      const target = modalBody;
      const canScroll = target.scrollHeight > target.clientHeight;
      
      if (canScroll) {
        target.scrollTop += e.deltaY / 2;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    modalBody.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      modalBody.removeEventListener('wheel', handleWheel, { capture: true } as EventListenerOptions);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!modalContentRef.current) return;
      if (!modalContentRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="editor-theme-modal" role="dialog" aria-modal="true">
      <div 
        className="editor-theme-modal__backdrop" 
        aria-hidden="true" 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      />
      <div 
        ref={modalContentRef}
        className="editor-theme-modal__content" 
        role="document"
        style={{ width: "min(800px, 96vw)", maxHeight: "min(90vh, 880px)" }}
      >
        <header className="editor-theme-modal__header">
          <div className="editor-theme-modal__header-copy">
            <h2>Настройки Header и Footer</h2>
            <p>Настройте параметры шапки и подвала сайта</p>
          </div>
          <button
            type="button"
            className="editor-theme-modal__close"
            onClick={onClose}
            aria-label="Закрыть модальное окно"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>
        <div ref={modalBodyRef} className="editor-theme-modal__body" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '0' }}>
          <div className="space-y-4 sm:space-y-6 flex-1 overflow-y-auto" style={{ paddingBottom: '1rem' }}>
          {/* Настройки Header */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Header</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Название компании</label>
                <input
                  type="text"
                  value={headerSettings.companyName}
                  onChange={(e) => setHeaderSettings({ ...headerSettings, companyName: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">URL логотипа</label>
                <input
                  type="text"
                  value={headerSettings.logo}
                  onChange={(e) => setHeaderSettings({ ...headerSettings, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Цвет фона</label>
                <input
                  type="color"
                  value={headerSettings.backgroundColor}
                  onChange={(e) => setHeaderSettings({ ...headerSettings, backgroundColor: e.target.value })}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Цвет текста</label>
                <input
                  type="color"
                  value={headerSettings.textColor}
                  onChange={(e) => setHeaderSettings({ ...headerSettings, textColor: e.target.value })}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Пункты навигации (через запятую)</label>
                <input
                  type="text"
                  value={headerSettings.navItemsRaw ?? headerSettings.navItems.join(", ")}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const items = raw
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0);
                    setHeaderSettings({ ...headerSettings, navItems: items, navItemsRaw: raw });
                  }}
                  placeholder="Главная, О нас, Контакты"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          {/* Настройки Footer */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Footer</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Цвет фона</label>
                <input
                  type="color"
                  value={footerSettings.backgroundColor}
                  onChange={(e) => setFooterSettings({ ...footerSettings, backgroundColor: e.target.value })}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Цвет текста</label>
                <input
                  type="color"
                  value={footerSettings.textColor}
                  onChange={(e) => setFooterSettings({ ...footerSettings, textColor: e.target.value })}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Текст копирайта</label>
                <input
                  type="text"
                  value={footerSettings.copyright}
                  onChange={(e) => setFooterSettings({ ...footerSettings, copyright: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>
          </div>

          {/* Кнопки - прилипнуты к низу */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-white/10 bg-[rgba(8,10,18,0.98)] sticky bottom-0 z-10" style={{ marginTop: 'auto', paddingTop: '1rem', paddingBottom: '1rem' }}>
            <button
              onClick={onApply}
              className="flex-1 px-4 py-2 bg-white text-black rounded-lg text-sm sm:text-base font-semibold hover:bg-white/90 transition-colors"
            >
              Применить
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm sm:text-base font-semibold hover:border-white/40 hover:bg-white/5 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

