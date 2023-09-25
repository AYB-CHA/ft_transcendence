import React, { PropsWithChildren } from "react"

export default function Card({
  children,
  className,
}: PropsWithChildren & { className?: string }) {
  return (
    <div className={`bg-dark/90 backdrop-blur-md border border-gray-700 ${className}`}>
      {children}
    </div>
  )
}
