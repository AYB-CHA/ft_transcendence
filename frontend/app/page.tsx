"use client";
// import Card from "@/components/card/Card";
// import CardHeader from "@/components/card/CardHeader";
// import CardFooter from "@/components/card/CardFooter";
// import CardBody from "@/components/card/CardBody";
import Lenis from "@studio-freight/lenis";
import { useScroll, motion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Home() {
  let progressRef = useRef<HTMLDivElement | null>(null);
  let container = useRef<HTMLDivElement | null>(null);

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
        <div className="sticky top-0 w-full h-[100vh] flex justify-center items-center"></div>
      </div>
      <div>
        <div className="bg-red-500 h-[100vh]">footer</div>
      </div>
    </div>
  );
}
