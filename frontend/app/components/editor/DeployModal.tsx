"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deployToVPS } from "@/app/utils/editor/deployUtils";
import { apiClient } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  editor: any;
  projectId?: number | null;
}

export function DeployModal({ isOpen, onClose, editor, projectId }: DeployModalProps) {
  const { user } = useAuth();
  const contentRef = useRef<HTMLDivElement>(null);
  const [deployType, setDeployType] = useState<"vps" | "builder_vps">("vps");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("22");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [deployPath, setDeployPath] = useState("/var/www/my-site");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [nginxConfig, setNginxConfig] = useState(true);
  const [enableSSL, setEnableSSL] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ message: string; url?: string } | null>(null);
  const [savedVPSList, setSavedVPSList] = useState<Array<{ id: string; name: string; host: string }>>([]);
  const [currentVPSId, setCurrentVPSId] = useState<string | null>(null);
  const [vpsName, setVpsName] = useState("");

  const STORAGE_KEY = 'deploy_vps_list';
  const CURRENT_VPS_KEY = 'deploy_current_vps';

  // Загружаем список сохраненных VPS
  useEffect(() => {
    if (isOpen) {
      try {
        const savedList = localStorage.getItem(STORAGE_KEY);
        if (savedList) {
          try {
            const parsed = JSON.parse(savedList);
            // Убеждаемся, что это массив
            if (Array.isArray(parsed)) {
              setSavedVPSList(parsed);
              
              // Загружаем текущий выбранный VPS
              const currentId = localStorage.getItem(CURRENT_VPS_KEY);
              if (currentId && parsed.find((v: any) => v.id === currentId)) {
                loadVPS(currentId);
                setCurrentVPSId(currentId);
              } else if (parsed.length > 0) {
                // Если есть сохраненные VPS, загружаем первый
                loadVPS(parsed[0].id);
                setCurrentVPSId(parsed[0].id);
              } else {
                // Если нет сохраненных VPS, используем email из профиля
                if (user?.email) {
                  setEmail(user.email);
                }
              }
            } else {
              // Если это не массив, очищаем и создаем новый
              console.warn('Данные в localStorage не являются массивом, очищаем');
              localStorage.removeItem(STORAGE_KEY);
              setSavedVPSList([]);
              if (user?.email) {
                setEmail(user.email);
              }
            }
          } catch (parseError) {
            console.warn('Ошибка парсинга данных из localStorage:', parseError);
            localStorage.removeItem(STORAGE_KEY);
            setSavedVPSList([]);
            if (user?.email) {
              setEmail(user.email);
            }
          }
        } else {
          // Если нет сохраненных VPS, используем email из профиля
          setSavedVPSList([]);
          if (user?.email) {
            setEmail(user.email);
          }
        }
      } catch (error) {
        console.warn('Ошибка загрузки списка VPS:', error);
        setSavedVPSList([]);
        if (user?.email) {
          setEmail(user.email);
        }
      }
    }
  }, [isOpen, user?.email]);

  // Функция загрузки данных VPS
  const loadVPS = (vpsId: string) => {
    try {
      const savedList = localStorage.getItem(STORAGE_KEY);
      if (savedList) {
        try {
          const parsed = JSON.parse(savedList);
          if (Array.isArray(parsed)) {
            const vps = parsed.find((v: any) => v.id === vpsId);
            if (vps) {
              setHost(vps.host || '');
              setPort(vps.port || '22');
              setUsername(vps.username || '');
              setPassword(vps.rememberPassword ? (vps.password || '') : '');
              setDeployPath(vps.deployPath || '/var/www/my-site');
              setDomain(vps.domain || '');
              setEmail(vps.email || user?.email || '');
              setNginxConfig(vps.nginxConfig !== undefined ? vps.nginxConfig : true);
              setEnableSSL(vps.enableSSL || false);
              setRememberPassword(vps.rememberPassword || false);
              setVpsName(vps.name || '');
              setCurrentVPSId(vpsId);
              localStorage.setItem(CURRENT_VPS_KEY, vpsId);
            }
          }
        } catch (parseError) {
          console.warn('Ошибка парсинга при загрузке VPS:', parseError);
        }
      }
    } catch (error) {
      console.warn('Ошибка загрузки VPS:', error);
    }
  };

  // Функция сохранения текущего VPS
  const saveCurrentVPS = () => {
    if (!host || !username || !deployPath) {
      setError("Заполните обязательные поля для сохранения");
      return;
    }

    try {
      const savedList = localStorage.getItem(STORAGE_KEY);
      let list: Array<any> = [];
      
      if (savedList) {
        try {
          const parsed = JSON.parse(savedList);
          // Убеждаемся, что это массив
          if (Array.isArray(parsed)) {
            list = parsed;
          } else {
            // Если это не массив, создаем новый
            console.warn('Данные в localStorage не являются массивом, создаем новый список');
            list = [];
          }
        } catch (parseError) {
          console.warn('Ошибка парсинга данных из localStorage:', parseError);
          list = [];
        }
      }
      
      const vpsData = {
        id: currentVPSId || `vps_${Date.now()}`,
        name: vpsName || host || 'Без названия',
        host,
        port,
        username,
        password: rememberPassword ? password : '',
        deployPath,
        domain,
        email: email || user?.email || '',
        nginxConfig,
        enableSSL,
        rememberPassword,
      };

      if (currentVPSId) {
        // Обновляем существующий
        const index = list.findIndex((v: any) => v.id === currentVPSId);
        if (index !== -1) {
          list[index] = vpsData;
        } else {
          // Если не найден, добавляем как новый
          list.push(vpsData);
          setCurrentVPSId(vpsData.id);
          localStorage.setItem(CURRENT_VPS_KEY, vpsData.id);
        }
      } else {
        // Добавляем новый
        list.push(vpsData);
        setCurrentVPSId(vpsData.id);
        localStorage.setItem(CURRENT_VPS_KEY, vpsData.id);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setSavedVPSList(list);
      setError(null);
    } catch (error) {
      console.warn('Ошибка сохранения VPS:', error);
      setError('Ошибка сохранения VPS');
    }
  };

  // Функция создания нового VPS
  const createNewVPS = () => {
    setHost('');
    setPort('22');
    setUsername('');
    setPassword('');
    setDeployPath('/var/www/my-site');
    setDomain('');
    setEmail(user?.email || '');
    setNginxConfig(true);
    setEnableSSL(false);
    setRememberPassword(false);
    setVpsName('');
    setCurrentVPSId(null);
    setError(null);
    localStorage.removeItem(CURRENT_VPS_KEY);
  };

  // Функция удаления VPS
  const deleteVPS = (vpsId: string) => {
    try {
      const savedList = localStorage.getItem(STORAGE_KEY);
      if (savedList) {
        try {
          const parsed = JSON.parse(savedList);
          if (Array.isArray(parsed)) {
            const list = parsed.filter((v: any) => v.id !== vpsId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
            setSavedVPSList(list);
            
            if (currentVPSId === vpsId) {
              if (list.length > 0) {
                loadVPS(list[0].id);
              } else {
                createNewVPS();
              }
            }
          }
        } catch (parseError) {
          console.warn('Ошибка парсинга при удалении VPS:', parseError);
        }
      }
    } catch (error) {
      console.warn('Ошибка удаления VPS:', error);
    }
  };


  // Обработчик прокрутки колесиком мыши
  useEffect(() => {
    if (!isOpen || !contentRef.current) return;

    const content = contentRef.current;
    
    const handleWheel = (e: WheelEvent) => {
      const canScroll = content.scrollHeight > content.clientHeight;
      const isAtTop = content.scrollTop <= 0;
      const isAtBottom = content.scrollTop >= content.scrollHeight - content.clientHeight - 1;
      
      if (canScroll) {
        if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
          e.stopPropagation();
        }
      }
    };

    content.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      content.removeEventListener('wheel', handleWheel);
    };
  }, [isOpen]);

  const handleDeploy = async () => {
    if (deployType === "vps") {
      if (!host || !username || !password || !deployPath) {
        setError("Заполните все обязательные поля");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await deployToVPS(
        editor,
        {
          deployType,
          host: deployType === "vps" ? host : undefined,
          port: deployType === "vps" && port ? parseInt(port) : undefined,
          username: deployType === "vps" ? username : undefined,
          password: deployType === "vps" ? password : undefined,
          deployPath: deployType === "vps" ? deployPath : undefined,
          domain: deployType === "vps" ? (domain || undefined) : undefined,
          email: deployType === "vps" && enableSSL ? email : undefined,
          nginxConfig: deployType === "vps" ? nginxConfig : false,
          enableSSL: deployType === "vps" && enableSSL && !!email,
          projectId: projectId || undefined,
        },
        apiClient
      );
      

      if (result.success) {
        setSuccess({ message: result.message, url: result.url });
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Ошибка деплоя");
    } finally {
      setLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[rgba(8,10,18,0.96)] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-bold text-white">Развертывание проекта</h2>
              {!projectId && (
                <p className="text-yellow-400 text-sm mt-1">
                  ⚠️ Сохраните проект перед деплоем, чтобы информация о развертывании сохранилась в профиле
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Закрыть"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
          {success ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-200 mb-2">{success.message}</p>
                {success.url && (
                  <a
                    href={success.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-green-200 underline"
                  >
                    Открыть сайт: {success.url}
                  </a>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Закрыть
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Выбор типа деплоя */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Тип развертывания
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeployType("vps")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      deployType === "vps"
                        ? "border-white/50 bg-white/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                    disabled={loading}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-white mb-1">VPS (свой сервер)</div>
                      <div className="text-xs text-white/60">
                        Деплой на ваш собственный сервер через SSH
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeployType("builder_vps")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      deployType === "builder_vps"
                        ? "border-white/50 bg-white/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                    disabled={loading}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-white mb-1">VPS сервер конструктора</div>
                      <div className="text-xs text-white/60">
                        Деплой на VPS сервер конструктора (настройки из админки)
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {deployType === "builder_vps" ? (
                /* Форма для деплоя на VPS сервер конструктора */
                <div className="space-y-4">
                  {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                      {error}
                    </div>
                  )}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-white/80">
                      Деплой будет выполнен на VPS сервер конструктора, настроенный в админ-панели.
                      Используется сервер по умолчанию (если указан) или первый активный сервер.
                    </p>
                  </div>
                </div>
              ) : (
                /* Форма для VPS деплоя */
                <>
              {/* Список сохраненных VPS */}
              {savedVPSList.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Сохраненные VPS
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {savedVPSList.map((vps) => (
                      <div
                        key={vps.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                          currentVPSId === vps.id
                            ? 'bg-white/10 border-white/30'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => loadVPS(vps.id)}
                      >
                        <span className="text-sm text-white">{vps.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteVPS(vps.id);
                          }}
                          className="text-white/50 hover:text-red-400 transition-colors"
                          title="Удалить"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={createNewVPS}
                      className="px-3 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-colors text-sm"
                    >
                      + Новый VPS
                    </button>
                  </div>
                </div>
              )}

              {/* Кнопка создания нового VPS, если список пуст */}
              {savedVPSList.length === 0 && (
                <div className="mb-4">
                  <button
                    onClick={createNewVPS}
                    className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    + Создать новый VPS
                  </button>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                  {error}
                </div>
              )}

              {/* Поле для названия VPS */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Название VPS (для сохранения)
                </label>
                <input
                  type="text"
                  value={vpsName}
                  onChange={(e) => setVpsName(e.target.value)}
                  placeholder={host || "Мой VPS"}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  disabled={loading}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={saveCurrentVPS}
                    className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    disabled={loading}
                  >
                    {currentVPSId ? 'Обновить' : 'Сохранить'} VPS
                  </button>
                  {currentVPSId && (
                    <button
                      onClick={createNewVPS}
                      className="px-3 py-1.5 text-xs border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors"
                      disabled={loading}
                    >
                      Новый VPS
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  IP адрес или домен VPS *
                </label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="192.168.1.1 или example.com"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  SSH порт
                </label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder="22"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  SSH пользователь *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="root"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  SSH пароль *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  disabled={loading}
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="rememberPassword"
                    checked={rememberPassword}
                    onChange={(e) => setRememberPassword(e.target.checked)}
                    className="w-4 h-4 rounded bg-white/5 border-white/10 text-white focus:ring-white/20"
                    disabled={loading}
                  />
                  <label htmlFor="rememberPassword" className="text-xs text-white/60 cursor-pointer">
                    Запомнить пароль
                  </label>
                </div>
                <p className="text-xs text-white/50 mt-1">Пароль для SSH подключения</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Путь развёртывания *
                </label>
                <input
                  type="text"
                  value={deployPath}
                  onChange={(e) => setDeployPath(e.target.value)}
                  placeholder="/var/www/my-site"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  disabled={loading}
                />
                <p className="text-xs text-white/50 mt-1">Абсолютный путь на VPS</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Домен (опционально)
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    // Если домен очищен, отключаем SSL
                    if (!e.target.value) {
                      setEnableSSL(false);
                    }
                  }}
                  placeholder="example.com"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                  disabled={loading}
                />
              </div>

              {domain && (
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Email для SSL сертификата
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30"
                    disabled={loading}
                  />
                  <p className="text-xs text-white/50 mt-1">
                    Используется для получения Let's Encrypt SSL сертификата и уведомлений
                  </p>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="nginx"
                    checked={nginxConfig}
                    onChange={(e) => setNginxConfig(e.target.checked)}
                    className="w-4 h-4 rounded bg-white/5 border-white/10 text-white focus:ring-white/20 mt-0.5"
                    disabled={loading}
                  />
                  <div className="flex-1">
                    <label htmlFor="nginx" className="text-sm font-medium text-white cursor-pointer block">
                      Настроить Nginx конфиг (рекомендуется)
                    </label>
                    <p className="text-xs text-white/60 mt-1">
                      Автоматически создаст и применит конфигурацию Nginx для вашего сайта. 
                      Без этого файлы будут загружены, но сайт не будет доступен через веб-браузер.
                    </p>
                  </div>
                </div>
              </div>

              {domain && nginxConfig && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="ssl"
                      checked={enableSSL}
                      onChange={(e) => setEnableSSL(e.target.checked)}
                      className="w-4 h-4 rounded bg-white/5 border-white/10 text-white focus:ring-white/20 mt-0.5"
                      disabled={loading || !email}
                    />
                    <div className="flex-1">
                      <label htmlFor="ssl" className="text-sm font-medium text-white cursor-pointer block">
                        Получить SSL сертификат (Let's Encrypt)
                      </label>
                      <p className="text-xs text-white/60 mt-1">
                        Автоматически установит бесплатный SSL сертификат для вашего домена через Let's Encrypt. 
                        Требуется указать email выше.
                      </p>
                      {!email && (
                        <p className="text-xs text-yellow-400 mt-1">
                          ⚠️ Укажите email для получения SSL сертификата
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
                </>
              )}

              {/* Кнопки деплоя - показываются всегда */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-white/20 text-white rounded-lg font-semibold hover:border-white/40 hover:bg-white/5 transition-colors"
                  disabled={loading}
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeploy}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Деплой..." : "Развернуть"}
                </button>
              </div>
            </div>
          )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

