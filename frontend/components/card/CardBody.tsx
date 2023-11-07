import React, { PropsWithChildren } from "react";

import { twMerge } from "tailwind-merge";
export default function CardBody({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  // return <div className={`px-4 py-3 ${className}`}>{children}</div>;
  return <div className={twMerge(`px-4 py-3`, className)}>{children}</div>;
}
