import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
export default function CardHeader({
  children,
  className = "",
}: PropsWithChildren & { className?: string }) {
  return (
    <div
      className={twMerge("border-b border-dark-semi-dim py-3 px-4", className)}
    >
      {children}
    </div>
  );
}
