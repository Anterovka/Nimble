"use client";

import { useState, useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  // Валидация пароля
  const passwordValidation = useMemo(() => {
    const hasMinLength = password.length >= 8;
    const hasLetters = /[a-zA-Zа-яА-Я]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasBoth = hasLetters && hasNumbers;
    
    return {
      hasMinLength,
      hasLetters,
      hasNumbers,
      hasBoth,
      isValid: hasMinLength && hasBoth,
    };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация имени пользователя - только английские буквы, цифры, дефисы и подчеркивания
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setError('Имя пользователя может содержать только английские буквы, цифры, дефисы и подчеркивания');
      return;
    }

    if (!passwordValidation.isValid) {
      setError('Пароль должен содержать минимум 8 символов, буквы и цифры');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username,
        email,
        password,
        password_confirm: passwordConfirm,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
      });
      onSuccess?.();
    } catch (err) {
      // Обрабатываем ошибки от API
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(String(err.message));
      } else {
        setError('Ошибка регистрации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
      <div>
        <label htmlFor="register-username" className="block text-sm font-medium text-white/90 mb-2.5">
          Имя пользователя *
        </label>
        <input
          id="register-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/20 transition-all"
          placeholder="Введите имя пользователя"
        />
        <p className="mt-1.5 text-xs text-white/40">Только английские буквы, цифры, дефисы и подчеркивания</p>
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-white/90 mb-2.5">
          Email *
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/20 transition-all"
          placeholder="Введите email"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="register-first-name" className="block text-sm font-medium text-white/90 mb-2.5">
            Имя
          </label>
          <input
            id="register-first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/20 transition-all"
            placeholder="Имя"
          />
        </div>

        <div>
          <label htmlFor="register-last-name" className="block text-sm font-medium text-white/90 mb-2.5">
            Фамилия
          </label>
          <input
            id="register-last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/20 transition-all"
            placeholder="Фамилия"
          />
        </div>
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-white/90 mb-2.5">
          Пароль *
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:ring-2 transition-all ${
            password && !passwordValidation.isValid
              ? 'border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20'
              : password && passwordValidation.isValid
              ? 'border-green-500/50 focus:border-green-500/70 focus:ring-green-500/20'
              : 'border-white/10 focus:border-white/30 focus:ring-white/20'
          }`}
          placeholder="Введите пароль"
        />
        
        {/* Индикаторы валидации пароля */}
        {password && (
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all ${
                passwordValidation.hasMinLength
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-white/30 bg-transparent'
              }`}>
                {passwordValidation.hasMinLength && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-500">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={passwordValidation.hasMinLength ? 'text-green-400' : 'text-white/50'}>
                Минимум 8 символов
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all ${
                passwordValidation.hasLetters
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-white/30 bg-transparent'
              }`}>
                {passwordValidation.hasLetters && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-500">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={passwordValidation.hasLetters ? 'text-green-400' : 'text-white/50'}>
                Содержит буквы
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all ${
                passwordValidation.hasNumbers
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-white/30 bg-transparent'
              }`}>
                {passwordValidation.hasNumbers && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-500">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={passwordValidation.hasNumbers ? 'text-green-400' : 'text-white/50'}>
                Содержит цифры
              </span>
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="register-password-confirm" className="block text-sm font-medium text-white/90 mb-2.5">
          Подтвердите пароль *
        </label>
        <input
          id="register-password-confirm"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 focus:ring-2 focus:ring-white/20 transition-all"
          placeholder="Подтвердите пароль"
        />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm whitespace-pre-line backdrop-blur-sm"
        >
          {error}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3.5 mt-5 bg-gradient-to-r from-white to-white/95 text-black rounded-xl font-semibold hover:from-white/95 hover:to-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10 hover:shadow-white/20"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Регистрация...
          </span>
        ) : (
          'Зарегистрироваться'
        )}
      </button>

      {onSwitchToLogin && (
        <p className="text-center text-sm text-white/50 pt-2">
          Уже есть аккаунт?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-white font-medium hover:text-white/80 underline underline-offset-2 transition-colors"
          >
            Войти
          </button>
        </p>
      )}
    </form>
  );
}


