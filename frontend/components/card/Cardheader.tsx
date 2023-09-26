import React, { PropsWithChildren } from "react";

export default function CardHeader({ children }: PropsWithChildren) {
  return (
    <div className="border-b border-dark-semi-dim py-2 px-4">{children}</div>
  );
}
