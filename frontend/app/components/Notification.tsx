"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface NotificationProps {
  message: string;
  type?: "error" | "warning" | "info" | "success";
  action?: {
    label: string;
    href: string;
  };
  onClose: () => void;
  duration?: number;
}

export function Notification({
  message,
  type = "info",
  action,
  onClose,
  duration = 5000,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Ждем завершения анимации
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const typeStyles = {
    error: "bg-red-500/20 border-red-500/50 text-red-200",
    warning: "bg-yellow-500/20 border-yellow-500/50 text-yellow-200",
    info: "bg-blue-500/20 border-blue-500/50 text-blue-200",
    success: "bg-green-500/20 border-green-500/50 text-green-200",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-20 right-4 z-[100] max-w-md w-full"
        >
          <div
            className={`${typeStyles[type]} border rounded-xl p-4 backdrop-blur-md shadow-2xl`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium leading-relaxed">{message}</p>
                {action && (
                  <Link
                    href={action.href}
                    className="mt-3 inline-block px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-semibold transition-colors"
                    onClick={handleClose}
                  >
                    {action.label}
                  </Link>
                )}
              </div>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0"
                aria-label="Закрыть"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-current"
                >
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

