import React, { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export default function Card({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return (
    <div
      className={twMerge("bg-dark-dim border border-dark-semi-dim", className)}
    >
      {children}
    </div>
  );
}
