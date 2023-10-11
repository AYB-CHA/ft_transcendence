"use client";
import { motion } from "framer-motion";

const transitionParams = {
  repeat: Infinity,
  duration: "3",
};

export default function IntroGame() {
  return (
    <div className="col-span-1 border-r border-r-dark-semi-dim relative">
      <motion.div
        className="w-5 h-5 bg-primary rounded-full absolute"
        animate={{
          top: ["50%", "95%", "50%", "0%", "50%"],
          left: ["0%", "50%", "95%", "50%", "0%"],
          transition: {
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          },
        }}
      ></motion.div>
      <motion.div
        className="h-16 w-3 bg-primary absolute top-2"
        transition={transitionParams}
        animate={{ top: ["45%", "50%", "75%", "30%", "45%"] }}
      ></motion.div>
      <motion.div
        className="h-16 w-3 bg-primary absolute right-0"
        transition={transitionParams}
        animate={{ top: ["20%", "80%", "45%", "45%", "20%"] }}
      ></motion.div>
    </div>
  );
}
