// анимированный заголовок лендинга с навигацией
"use client";

import { motion, useScroll } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLenis } from "@studio-freight/react-lenis";
import { smoothScrollTo } from "@/app/utils/landing/scroll";
import { buttonHoverAnimation } from "@/app/utils/landing/animations";
import { useAuth } from "@/app/context/AuthContext";
import { AuthModal } from "@/app/components/auth/AuthModal";

const navItems = [
  { label: "Возможности", id: "features" },
  { label: "Как это работает", id: "steps" },
  { label: "Примеры", id: "examples" },
  { label: "О проекте", id: "about" },
];

export function AnimatedHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { scrollY } = useScroll();
  const lenis = useLenis();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = (latest: number) => {
      setScrolled(latest > 50);
    };
    
    const unsubscribe = scrollY.on("change", handleScroll);
    return () => unsubscribe();
  }, [scrollY]);

  const navScale = scrolled ? [1, 1.05, 1] : 1;
  const navScaleTransition = scrolled
    ? { duration: 0.5, times: [0, 0.5, 1], ease: "easeOut" as const }
    : undefined;

  const headerHeight = scrolled ? 60 : 80;

  const navBackgroundColor = scrolled ? "rgba(5, 5, 5, 0.75)" : "rgba(5, 5, 5, 0)";
  const navBackdropFilter = scrolled ? "blur(20px) saturate(180%)" : "blur(0px)";
  const navBorder = scrolled ? "1px solid rgba(255, 255, 255, 0.18)" : "1px solid transparent";
  const navBorderRadius = scrolled ? 16 : 0;
  const navMarginTop = scrolled ? 16 : 0;
  const navWidth = scrolled ? "calc(100% - 2rem)" : "100%";
  const navBoxShadow = scrolled
    ? "0 8px 32px rgba(0, 0, 0, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
    : "none";
  const navBackground = scrolled
    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(255, 255, 255, 0.01) 100%)"
    : "transparent";

  const overlayOpacity = scrolled ? 1 : 0;
  const overlayBackground = scrolled
    ? "linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)"
    : "transparent";

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 h-20"
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        height: headerHeight,
      }}
      transition={{
        y: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.6 },
        height: { duration: 0.3, ease: "easeOut" },
      }}
    >
      <motion.nav
        className="h-full max-w-7xl mx-auto px-3 sm:px-4 md:px-8 relative overflow-hidden"
        animate={{
          backgroundColor: navBackgroundColor,
          backdropFilter: navBackdropFilter,
          border: navBorder,
          borderRadius: navBorderRadius,
          marginTop: scrolled ? 12 : 0,
          width: scrolled ? "calc(100% - 1.5rem)" : "100%",
          boxShadow: navBoxShadow,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: navBackground,
          WebkitBackdropFilter: navBackdropFilter,
        } as React.CSSProperties}
      >
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
          animate={{ opacity: overlayOpacity }}
          transition={{ duration: 0.3 }}
          style={{
            background: overlayBackground,
            mixBlendMode: "overlay",
          }}
        />

        <div className="flex items-center justify-between h-full gap-4 relative z-10 min-w-0">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 min-w-0"
          >
            <Link href="/" className="flex items-center gap-3 shrink-0 group min-w-0">
              <div className="flex items-center justify-center shrink-0 relative">
                <motion.svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <path
                    d="M20 4L32 12V28L20 36L8 28V12L20 4Z"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M14 20L20 14L26 20L20 26L14 20Z"
                    fill="white"
                    fillOpacity="0.9"
                  />
                  <path
                    d="M10 12L20 8L30 12M10 28L20 32L30 28"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity="0.7"
                  />
                </motion.svg>
              </div>
              <motion.span
                className="text-white font-semibold whitespace-nowrap text-lg sm:text-xl md:text-2xl shrink-0"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Nimble
              </motion.span>
            </Link>
          </motion.div>

          <motion.div
            className="hidden lg:flex items-center gap-6 xl:gap-8 shrink-0"
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: navScale,
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] },
              scale: navScaleTransition,
            }}
          >
            {navItems.map((item, index) => {
              const buttonDelay = 0.5 + index * 0.1;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => smoothScrollTo(item.id, lenis)}
                  className="text-white/80 hover:text-white text-xs lg:text-sm transition-colors whitespace-nowrap relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: buttonDelay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </motion.div>

          <motion.div className="flex items-center gap-2 sm:gap-3 shrink-0"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {isAuthenticated ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <Link
                    href="/profile"
                    className="user-avatar-circle"
                    title={user?.username || user?.email || "Профиль"}
                  >
                    {user?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </Link>
                  <button
                    type="button"
                    className="editor-logout-button"
                    aria-label="Выйти"
                    onClick={logout}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div {...buttonHoverAnimation}>
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 sm:px-4 sm:py-2 border border-white/20 text-white rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap hover:border-white/40 hover:bg-white/5 transition-all"
                  >
                    Войти
                  </button>
                </motion.div>
                <motion.div {...buttonHoverAnimation}>
                  <button
                    onClick={() => {
                      setAuthModalMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white text-black rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap hover:bg-white/90 transition-all"
                  >
                    Регистрация
                  </button>
                </motion.div>
                <motion.div {...buttonHoverAnimation} className="hidden sm:block">
                  <Link
                    href="/editor"
                    className="relative px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white text-black rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap overflow-hidden group block"
                  >
                    <motion.span className="relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.7 }}>
                      Начать
                    </motion.span>
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </motion.header>
  );
}

