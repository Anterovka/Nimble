// контекст авторизации пользователя
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  LoginCredentials,
  RegisterData,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  getUser,
  getProfile,
  refreshToken,
  isAuthenticated as checkIsAuthenticated,
  clearAuth,
} from '@/app/lib/auth';
import { ApiError } from '@/app/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (checkIsAuthenticated()) {
        try {
          const savedUser = getUser();
          if (savedUser) {
            setUser(savedUser);
          }

          try {
            const profile = await getProfile();
            setUser(profile);
          } catch (error) {
            const tokens = await refreshToken();
            if (tokens) {
              try {
                const profile = await getProfile();
                setUser(profile);
              } catch {
                clearAuth();
                setUser(null);
              }
            } else {
              clearAuth();
              setUser(null);
            }
          }
        } catch (error) {
          clearAuth();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!checkIsAuthenticated()) return;

    const interval = setInterval(async () => {
      try {
        await refreshToken();
      } catch {
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authLogin(credentials);
      if (response.user) {
        setUser(response.user);
      } else {
        // Если пользователь не пришел в ответе, получаем профиль
        const profile = await getProfile();
        setUser(profile);
      }
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Ошибка входа');
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authRegister(data);
      if (response.user) {
        setUser(response.user);
      } else {
        const profile = await getProfile();
        setUser(profile);
      }
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Ошибка регистрации');
    }
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!checkIsAuthenticated()) return;
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (error) {
      const tokens = await refreshToken();
      if (tokens) {
        try {
          const profile = await getProfile();
          setUser(profile);
        } catch {
          clearAuth();
          setUser(null);
        }
      } else {
        clearAuth();
        setUser(null);
      }
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


