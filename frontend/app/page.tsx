"use client";

import { PropsWithChildren } from "react";
import { motion } from "framer-motion";

import IntroGame from "./auth/register/(components)/IntroGame";
import GlowCardBody from "@/components/GlowCard/GlowCardBody";
import GlowCard from "@/components/GlowCard/GlowCard";
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
                  Welcome to The Missing PingPong, the ultimate online
                  destination for table tennis enthusiasts! Our website is
                  designed to bring the thrill of ping pong to your fingertips
                  while connecting you with friends in real-time. Challenge your
                  pals to exhilarating ping pong matches in our user-friendly
                  gaming interface, complete with responsive controls for a
                  seamless playing experience. What sets us apart is our
                  integrated chat system, allowing you to engage with your
                  friends through direct messages or create custom channels for
                  group discussions. Share strategies, celebrate victories, and
                  enjoy the camaraderie as you compete for ping pong supremacy.
                  With The Missing PingPong, the joy of playing your favorite
                  sport is just a click away, bringing together the excitement
                  of competition and the warmth of real-time communication. Join
                  the community and let the games and conversations begin!
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
