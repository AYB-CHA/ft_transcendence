import { PropsWithChildren } from "react";

export default function Label({ children }: PropsWithChildren) {
  return <span className="font-medium mb-2 block">{children}</span>;
}
