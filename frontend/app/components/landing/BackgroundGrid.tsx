// Фоновый грид для лендинга
"use client";

interface BackgroundGridProps {
  className?: string;
  size?: number;
}

export function BackgroundGrid({ className = "", size = 40 }: BackgroundGridProps) {
  const patternId = `grid-pattern-${size}`;
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={patternId} width={size} height={size} patternUnits="userSpaceOnUse">
            <path
              d={`M ${size} 0 L 0 0 0 ${size}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

