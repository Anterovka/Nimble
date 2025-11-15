// Анимированные линии сетки с узлами
"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface GridLinesProps {
  className?: string;
  bottomOnly?: boolean;
}

export function GridLines({ className = "", bottomOnly = false }: GridLinesProps) {
  const [network, setNetwork] = useState<{ 
    nodes: Array<{ id: number; x: number; y: number }>; 
    connections: Array<{ from: { id: number; x: number; y: number }; to: { id: number; x: number; y: number } }> 
  } | null>(null);

  useEffect(() => {
    const allCorners = [
      { startX: 60, startY: 0, width: 40, height: 30 },
      { startX: 0, startY: 0, width: 40, height: 30 },
      { startX: 60, startY: 70, width: 40, height: 30 },
      { startX: 0, startY: 70, width: 40, height: 30 },
    ];
    
    const corners = bottomOnly 
      ? allCorners.filter(c => c.startY === 70)
      : allCorners;
    
    const randomCorner = corners[Math.floor(Math.random() * corners.length)];

    const createNetwork = (startX: number, startY: number, width: number, height: number, nodeCount: number) => {
      const nodes = Array.from({ length: nodeCount }, (_, i) => ({
        id: i,
        x: startX + Math.random() * width,
        y: startY + Math.random() * height,
      }));

      const connections: Array<{ from: typeof nodes[0]; to: typeof nodes[0] }> = [];
      nodes.forEach((node, i) => {
        const distances = nodes
          .map((other, j) => ({
            node: other,
            distance: Math.sqrt(Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)),
            index: j,
          }))
          .filter((d) => d.index !== i)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);

        distances.forEach((d) => {
          if (!connections.some((c) => 
            (c.from.id === node.id && c.to.id === d.node.id) ||
            (c.from.id === d.node.id && c.to.id === node.id)
          )) {
            connections.push({ from: node, to: d.node });
          }
        });
      });

      return { nodes, connections };
    };

    setNetwork(createNetwork(randomCorner.startX, randomCorner.startY, randomCorner.width, randomCorner.height, 15));
  }, [bottomOnly]);

  if (!network) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <g>
          {network.connections.map((conn, i) => {
            const dx = conn.to.x - conn.from.x;
            const dy = conn.to.y - conn.from.y;
            const lineLength = Math.sqrt(dx * dx + dy * dy);
            const dashLength = 100;
            
            return (
              <motion.line
                key={`conn-${i}`}
                x1={`${conn.from.x}%`}
                y1={`${conn.from.y}%`}
                x2={`${conn.to.x}%`}
                y2={`${conn.to.y}%`}
                stroke="rgba(100, 200, 255, 0.25)"
                strokeWidth="0.8"
                strokeDasharray={`${dashLength} ${dashLength}`}
                initial={{ 
                  strokeDashoffset: dashLength * 2,
                  opacity: 0 
                }}
                animate={{ 
                  strokeDashoffset: 0,
                  opacity: [0.2, 0.35, 0.25, 0.35, 0.25]
                }}
                transition={{
                  strokeDashoffset: {
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: "easeOut"
                  },
                  opacity: {
                    duration: 3 + Math.random() * 2,
                    delay: i * 0.05 + 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              />
            );
          })}
          {network.nodes.map((node, i) => (
            <motion.circle
              key={`node-${node.id}`}
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="2"
              fill="rgba(100, 200, 255, 0.3)"
              initial={{ 
                scale: 0,
                opacity: 0 
              }}
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                scale: {
                  duration: 2 + Math.random() * 1,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                opacity: {
                  duration: 2 + Math.random() * 1,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

