"use client";

import { PropsWithChildren } from "react";
import { motion } from "framer-motion";

import { ROUTER } from "@/lib/ROUTER";
import IntroGame from "./auth/register/(components)/IntroGame";
import GlowCardBody from "@/components/GlowCard/GlowCardBody";
import GlowCard from "@/components/GlowCard/GlowCard";
import Button from "@/components/Button";
import Link from "next/link";
import StartPlayingButton from "./(components)/StartPlayingButton";

function Reveal({ children }: PropsWithChildren) {
  return (
    <div className="relative py-3 overflow-hidden w-fit">
      <motion.div
        initial={{ y: 75, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "linear",
          delay: 0.2,
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-x-0 top-1 bottom-0 bg-primary-200"
        initial={{ left: "0%" }}
        animate={{ left: "100%" }}
        transition={{
          ease: "easeIn",
          duration: 0.5,
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <div className="w-full h-[100vh] relative bg-black">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(rgba(217, 217, 217, 0.20) 1px, transparent 0px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="bg-gradient-to-b from-transparent to-black absolute inset-0" />
        <div className="h-full z-20 absolute inset-0 grid grid-cols-2 place-content-center container mx-auto">
          <div>
            <Reveal>
              <div className="text-4xl font-bold text-white flex justify-center">
                The Missing PingPong.
              </div>
            </Reveal>
            <div className="w-2/3">
              <Reveal>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
                  ex neque magni beatae culpa nulla, deleniti maxime quasi
                  voluptatum cum veritatis ratione voluptatem nostrum in qui
                  enim odit aliquid. Velit modi similique dolor sint recusandae
                  quis repellat ipsum facere sed quaerat asperiores quam,
                  aspernatur repudiandae necessitatibus minima nesciunt,
                  consequatur maiores molestiae officia eius corrupti rerum
                  accusantium laboriosam! Delectus porro eum quam, nisi at
                  consequuntur suscipit quo incidunt modi et. Delectus ipsum
                  esse explicabo fugit maxime, exercitationem ipsam possimus
                  veniam laboriosam ut. Doloribus earum illum, sapiente pariatur
                  consectetur sequi sed nam, quis eligendi recusandae, cum
                  praesentium eaque? Nostrum molestiae harum accusamus?
                </p>
              </Reveal>
            </div>
            <Reveal>
              <StartPlayingButton />
            </Reveal>
          </div>
          <div>
            <div className="h-[500px] w-[800px] grid shadow-2xl">
              <GlowCard>
                <GlowCardBody className="grid p-0 bg-black">
                  <IntroGame />
                </GlowCardBody>
              </GlowCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
