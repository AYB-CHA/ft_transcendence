import React, { PropsWithChildren } from "react";

export default function GlowCardFooter({ children }: PropsWithChildren) {
  return (
    <div className="bg-dark-dim mt-px py-3 px-4 flex gap-4 justify-end">
      {children}
    </div>
  );
}
