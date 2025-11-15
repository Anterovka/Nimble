// карточка с полупрозрачным фоном
"use client";

interface StrictCardProps {
  children: React.ReactNode;
  className?: string;
}

export function StrictCard({
  children,
  className = "",
}: StrictCardProps) {
  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

