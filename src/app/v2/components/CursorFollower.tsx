"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useSpring } from "framer-motion";

const CDN =
  "https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book";

const CAT_SIZE = 28;

export function CursorFollower() {
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);

  const x = useSpring(0, { stiffness: 120, damping: 14 });
  const y = useSpring(0, { stiffness: 120, damping: 14 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX - CAT_SIZE / 2);
      y.set(e.clientY - CAT_SIZE / 2);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    const leave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const enter = () => {
      visibleRef.current = true;
      setVisible(true);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [x, y]);

  if (!visible) return null;

  return (
    <motion.div
      className="cursor-cat"
      style={{ left: x, top: y }}
      aria-hidden="true"
    >
      <Image
        src={`${CDN}/icons/BUKITO_Icon_Cat1.png`}
        alt=""
        width={CAT_SIZE}
        height={CAT_SIZE}
        className="pointer-events-none opacity-60"
      />
    </motion.div>
  );
}
