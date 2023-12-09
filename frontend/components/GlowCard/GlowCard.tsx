"use client";

import { PropsWithChildren, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function GlowCard({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  const borderRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const listener = (ev: MouseEvent) => {
      if (!borderRef.current || !cardRef.current) return;

      const borderRec = borderRef.current.getBoundingClientRect();
      const cardRec = cardRef.current.getBoundingClientRect();

      const animationKeyframes: Keyframe[] = [
        {
          transform: `translate(${
            ev.clientX - cardRec.left - borderRec.width / 2
          }px,${ev.clientY - cardRec.top - borderRec.height / 2}px)`,
        },
      ];

      const animationParams: KeyframeAnimationOptions = {
        // duration: 300,
        fill: "forwards",
      };

      borderRef.current.animate(animationKeyframes, animationParams);
    };

    window.addEventListener("mousemove", listener);
    return () => {
      window.removeEventListener("mousemove", listener);
    };
  }, []);
  return (
    <div
      ref={cardRef}
      className="p-px bg-dark-semi-dim relative overflow-hidden z-0 flex flex-col"
    >
      <div
        ref={borderRef}
        className="absolute blur-2xl top-0 left-0 h-[100px] aspect-square rounded-full bg-gray-400 -z-10 -translate-x-full -translate-y-full"
      />
      <motion.div
        className="absolute blur-2xl h-[100px] aspect-square rounded-full bg-gray-300 -z-10 -translate-x-1/2 -translate-y-1/2"
        animate={{
          top: ["0%", "100%", "100%", "0%", "0%"],
          left: ["0%", "0%", "100%", "100%", "0%"],
          transition: {
            repeat: Infinity,
            duration: 10,
            ease: "linear",
          },
        }}
      />
      <motion.div
        className="absolute blur-2xl h-[100px] aspect-square rounded-full bg-gray-300 -z-10 -translate-x-1/2 -translate-y-1/2"
        animate={{
          top: ["100%", "0%", "0%", "100%", "100%"],
          left: ["100%", "100%", "0%", "0%", "100%"],
          transition: {
            repeat: Infinity,
            duration: 10,
            ease: "linear",
          },
        }}
      />
      {children}
    </div>
  );
}
