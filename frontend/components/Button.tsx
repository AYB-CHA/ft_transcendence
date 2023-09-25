"use client";

import { PropsWithChildren } from "react";

export default function Button({
  children,
  onClick = undefined,
  variant = "primary",
  className,
}: PropsWithChildren & {
  onClick?: () => void;
  variant?: "primary" | "secondary" | "dark";
  className?: string;
}) {
  const variants = {
    primary: "bg-primary hover:bg-primary-400",
    secondary: "bg-gray-100 hover:bg-gray-100/80",
    dark: "bg-black border border-[#4B5563] text-gray-200",
  };
  return (
    <button
      onClick={onClick}
      className={`duration-500 text-black px-4 py-3 flex justify-center ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
