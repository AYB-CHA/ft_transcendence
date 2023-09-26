import React, { PropsWithChildren } from "react";

export default function Card({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return (
    <div className={`bg-dark-dim border border-dark-semi-dim ${className}`}>
      {children}
    </div>
  );
}
