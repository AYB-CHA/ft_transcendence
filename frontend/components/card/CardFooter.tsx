import React, { PropsWithChildren } from "react";

export default function CardFooter({ children }: PropsWithChildren) {
  return (
    <div className="border-t border-dark-semi-dim py-2 px-4">{children}</div>
  );
}
