"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export function AppHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const [isSuperuser, setIsSuperuser] = useState(false);
  
  useEffect(() => {
    const checkSuperuser = async () => {
      if (!user) return;
      try {
        const { apiClient } = await import('@/app/lib/api');
        const profile = await apiClient.get<any>('/auth/profile/');
        setIsSuperuser(profile.is_superuser || false);
      } catch (err) {
      }
    };
    
    checkSuperuser();
  }, [user]);
  
  const navItems = useMemo(() => {
    const items: Array<{ href: string; label: string }> = [
      { href: "/profile", label: "Мои проекты" },
      { href: "/templates", label: "Готовые шаблоны" },
      { href: "/subscription", label: "Подписка" },
    ];
    
    if (isSuperuser) {
      items.push({ href: "/admin/blocks", label: "Админка" });
    }
    
    return items;
  }, [isSuperuser]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(5,5,5,0.75)] backdrop-blur-[20px] border-b border-white/18">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="flex items-center justify-center shrink-0 relative">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10"
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
            </svg>
          </div>
          <span className="text-white font-semibold whitespace-nowrap text-xl md:text-2xl shrink-0">
            Nimble
          </span>
        </Link>

        <div className="hidden min-[950px]:flex items-center gap-2 flex-1 justify-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white/10 text-white border border-white shadow-[0_1px_12px_rgba(255,255,255,0.15)]"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user && (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="user-avatar-circle"
                title={user.username || user.email || "Профиль"}
              >
                {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
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
            </div>
          )}
          <Link
            href="/editor"
            className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 transition-all"
          >
            Редактор
          </Link>
        </div>
      </nav>
    </header>
  );
}

