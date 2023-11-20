import { AnimatePresence } from "framer-motion";
import React, { PropsWithChildren } from "react";

export default function AnimateListContainer({
  children,
  height = "auto",
}: PropsWithChildren & { height?: number | "auto" }) {
  return (
    <div className="relative" style={{ height }}>
      <AnimatePresence>{children}</AnimatePresence>
    </div>
  );
}
