import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  depth?: number;
  glow?: boolean;
}

export const MotionCard: React.FC<MotionCardProps> = ({
  children,
  className = '',
  onClick,
  depth = 20,
  glow = true
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 16;
    const rotateX = ((y / rect.height) - 0.5) * -16;
    setMousePos({ x: rotateY, y: rotateX });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setMousePos({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      className={cn(
        "relative transform-gpu transition-all duration-300 ease-out overflow-hidden rounded-3xl",
        onClick && "cursor-pointer",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{
        rotateX: mousePos.y,
        rotateY: mousePos.x,
        scale: hovered ? 1.025 : 1,
        z: hovered ? depth : 0,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.7 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {/* Glossy light glare overlay */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none z-30"
          animate={{
            background: hovered
              ? `radial-gradient(circle at ${((mousePos.x / 16) + 0.5) * 100}% ${((-mousePos.y / 16) + 0.5) * 100}%, rgba(255,255,255,0.4) 0%, transparent 60%)`
              : "transparent",
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Inner Content with Z-Depth */}
      <div className="relative z-10 h-full flex flex-col justify-between" style={{ transform: "translateZ(10px)" }}>
        {children}
      </div>
    </motion.div>
  );
};
