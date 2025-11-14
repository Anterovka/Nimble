"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getSubscription, updateSubscription, type Subscription } from "@/app/lib/subscription";
import Link from "next/link";
import { StaticStarField } from "@/app/components/StaticStarField";
import { Notification } from "@/app/components/Notification";
import { AppHeader } from "@/app/components/AppHeader";

export default function SubscriptionPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "warning" | "info" | "success";
    action?: { label: string; href: string };
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
      return;
    }

    if (isAuthenticated) {
      loadSubscription();
    }
  }, [isAuthenticated, isLoading, router]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSubscription();
      setSubscription(data);
    } catch (err) {
      console.error("Ошибка загрузки подписки", err);
      setError("Не удалось загрузить информацию о подписке");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (!subscription) return;
    
    try {
      setUpdating(true);
      setError(null);
      // В реальном приложении здесь будет интеграция с платежной системой
      // Пока просто обновляем подписку (для тестирования)
      const updated = await updateSubscription('premium');
      setSubscription(updated);
      setNotification({
        message: "Подписка успешно обновлена! Теперь вы можете создавать неограниченное количество проектов.",
        type: "success",
      });
    } catch (err: any) {
      console.error("Ошибка обновления подписки", err);
      setError(err.message || "Не удалось обновить подписку");
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#050505] to-[#000000] flex items-center justify-center">
        <div className="text-white text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isPremium = subscription?.subscription_type === 'premium';
  const projectLimit = subscription?.project_limit === -1 ? '∞' : subscription?.project_limit || 3;
  const currentCount = subscription?.current_project_count || 0;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#050505] to-[#000000] text-white relative">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          action={notification.action}
          onClose={() => setNotification(null)}
          duration={5000}
        />
      )}
      <StaticStarField starCount={200} />
      <AppHeader />

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16 relative z-10">
        <div className="text-center mb-4">
          <h1 className="text-5xl font-bold mb-4">Планы подписки</h1>
          <p className="text-white/60 text-lg">Выберите план, который подходит вам</p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Текущая подписка */}
        {subscription && (
          <div className="max-w-2xl mx-auto mb-8 p-6 bg-white/5 border border-white/10 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Текущая подписка</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/60">Тип подписки:</span>
                <span className="font-semibold">
                  {subscription.subscription_type === 'premium' ? 'Премиум' : 'Бесплатная'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Лимит проектов:</span>
                <span className="font-semibold">
                  {subscription.project_limit === -1 ? 'Неограниченно' : `${subscription.project_limit} проекта`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Текущее количество проектов:</span>
                <span className="font-semibold">{subscription.current_project_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Можно создать еще:</span>
                <span className={`font-semibold ${subscription.can_create_more ? 'text-green-400' : 'text-red-400'}`}>
                  {subscription.can_create_more ? 'Да' : 'Нет'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Планы */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Бесплатный план */}
          <div className={`bg-white/5 border rounded-xl p-8 ${isPremium ? 'border-white/10' : 'border-white/20'}`}>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Бесплатный</h3>
              <div className="text-4xl font-bold mb-1">0₽</div>
              <div className="text-white/60 text-sm">навсегда</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0 mt-0.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>До 3 проектов</span>
              </li>
              <li className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0 mt-0.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Все функции редактора</span>
              </li>
              <li className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0 mt-0.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Экспорт HTML/CSS</span>
              </li>
            </ul>
            {!isPremium && (
              <button
                disabled
                className="w-full px-6 py-3 border border-white/20 text-white rounded-lg font-semibold cursor-not-allowed opacity-50"
              >
                Текущий план
              </button>
            )}
          </div>

          {/* Премиум план */}
          <div className={`bg-white/5 border rounded-xl p-8 relative ${isPremium ? 'border-white/20' : 'border-white/10'}`}>
            {isPremium && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                Активна
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Премиум</h3>
              <div className="text-4xl font-bold mb-1">499₽</div>
              <div className="text-white/60 text-sm">в месяц</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0 mt-0.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Неограниченное количество проектов</span>
              </li>
              <li className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0 mt-0.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Все функции редактора</span>
              </li>
              <li className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0 mt-0.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Экспорт HTML/CSS</span>
              </li>
              <li className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0 mt-0.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Приоритетная поддержка</span>
              </li>
            </ul>
            {isPremium ? (
              <button
                disabled
                className="w-full px-6 py-3 bg-white/10 text-white rounded-lg font-semibold cursor-not-allowed"
              >
                Текущий план
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={updating}
                className="w-full px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Обновление...' : 'Перейти на премиум'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-white/60">
          <p>Вопросы? <Link href="/" className="text-white hover:underline">Свяжитесь с нами</Link></p>
        </div>
      </div>
    </div>
  );
}

