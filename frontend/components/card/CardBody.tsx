import React, { PropsWithChildren } from "react";

export default function CardBody({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return <div className={`px-4 py-3 ${className}`}>{children}</div>;
}
