// модальное окно авторизации (вход/регистрация)
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const router = useRouter();
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setMode(initialMode);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialMode]);

  const handleSuccess = () => {
    onClose();
    router.push('/templates');
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !bodyRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      const element = bodyRef.current;
      if (!element) return;

      const { scrollTop, scrollHeight, clientHeight } = element;
      const isAtTop = scrollTop <= 1;
      const isAtBottom = scrollTop >= scrollHeight - clientHeight - 1;

      if ((e.deltaY < 0 && isAtTop) || (e.deltaY > 0 && isAtBottom)) {
        e.preventDefault();
      } else {
        element.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };

    const element = bodyRef.current;
    element.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-gradient-to-br from-[rgba(8,10,18,0.98)] to-[rgba(5,7,15,0.98)] border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] mx-2 sm:mx-0 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-white/10 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                aria-label="Закрыть"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 pr-8 sm:pr-10">
                {mode === 'login' ? 'Вход в аккаунт' : 'Создание аккаунта'}
              </h2>
              <p className="text-xs sm:text-sm text-white/60">
                {mode === 'login'
                  ? 'Войдите, чтобы продолжить работу'
                  : 'Зарегистрируйтесь для начала работы'}
              </p>
            </div>

            {/* Body */}
            <div ref={bodyRef} className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex-1 min-h-0">
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LoginForm
                      onSuccess={handleSuccess}
                      onSwitchToRegister={() => setMode('register')}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RegisterForm
                      onSuccess={handleSuccess}
                      onSwitchToLogin={() => setMode('login')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

