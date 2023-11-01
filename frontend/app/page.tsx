"use client";

import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";

import Lenis from "@studio-freight/lenis";
import Link from "next/link";
import Button from "@/components/Button";

export default function Home() {
  const progressRef = useRef<HTMLDivElement | null>(null);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", (e: any) => {
      if (progressRef.current) {
        progressRef.current.style.width = `${lenis.progress * 100}%`;
      }
    });

    function raf(time: any) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });
  let { scrollYProgress } = useScroll({
    target: container,
  });

  return (
    <div>
      <div
        className="h-1 bg-primary-500 fixed top-0z-50 w-0"
        ref={progressRef}
      ></div>
      <div className="h-[300vh] relative" ref={container}>
        <div className="sticky top-0 w-full h-[100vh] flex justify-center items-center">
          <Button>
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
      <div>
        <div className="bg-red-500 h-[100vh]">footer</div>
      </div>
    </div>
  );
}
