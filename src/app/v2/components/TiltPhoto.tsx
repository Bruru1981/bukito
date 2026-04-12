"use client";

import { useRef, type ReactNode } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface TiltPhotoProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltPhoto({
  children,
  className = "",
  maxTilt = 5,
}: TiltPhotoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 120, damping: 14 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 14 });
  const isTouch = useMotionValue(false);

  const handleMouse = (e: React.MouseEvent) => {
    if (isTouch.get()) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = (e.clientX - cx) / (rect.width / 2);
    const py = (e.clientY - cy) / (rect.height / 2);
    rotateY.set(px * maxTilt);
    rotateX.set(-py * maxTilt);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={ref}
      className={`tilt-container ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      onTouchStart={() => isTouch.set(true)}
    >
      <motion.div style={{ rotateX, rotateY }}>
        {children}
      </motion.div>
    </div>
  );
}
