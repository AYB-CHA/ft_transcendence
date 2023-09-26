import React, { PropsWithChildren } from "react";

export default function CardBody({ children }: PropsWithChildren) {
  return <div className="px-4 py-3">{children}</div>;
}
