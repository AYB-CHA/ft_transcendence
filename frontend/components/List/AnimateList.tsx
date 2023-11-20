import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export default function AnimateList({
  top,
  children,
}: { top: number } & PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, top }}
      animate={{ opacity: 1, top }}
      exit={{ opacity: 0 }}
      className="absolute w-full"
    >
      {children}
    </motion.div>
  );
}
