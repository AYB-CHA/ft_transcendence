import React, { PropsWithChildren } from "react"

export default function CardHeader({ children }: PropsWithChildren) {
  return <div className="border-b border-gray-700 py-2 px-4">{children}</div>
}
