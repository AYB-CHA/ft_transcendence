import React, { PropsWithChildren } from "react";

import { twMerge } from "tailwind-merge";
export default function GlowCardBody({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return (
    <div className={twMerge(`px-4 py-3 bg-dark-dim grow`, className)}>
      {children}
    </div>
  );
}
