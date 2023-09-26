import React, { PropsWithChildren } from "react";

export default function CardFooter({ children }: PropsWithChildren) {
  return (
    <div className="border-t border-dark-semi-dim py-3 px-4 flex gap-4 justify-end">
      {children}
    </div>
  );
}
