import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
export default function GlowCardHeader({
  children,
  className = "",
}: PropsWithChildren & { className?: string }) {
  return (
    <div className={twMerge("mb-px py-3 px-4 bg-dark-dim", className)}>
      {children}
    </div>
  );
}
