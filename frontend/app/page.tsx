"use client";

import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";

import Lenis from "@studio-freight/lenis";

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

  const { scrollYProgress } = useScroll({
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
          <div className="h-[250px] aspect-square bg-primary rounded-full relative border border-dark-semi-light">
            <div className="h-[85%] aspect-square bg-dark rounded-full absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-10 border border-dark-semi-light"></div>
            <div></div>
          </div>
          {/* <Link href="/auth/login">
            <Button>Login</Button>
          </Link> */}
        </div>
      </div>
      <div>
        <div className="bg-red-500 h-[100vh]">footer</div>
      </div>
    </div>
  );
}
