"use client";

import React, {
  ButtonHTMLAttributes,
  PropsWithChildren,
  forwardRef,
} from "react";

type ButtonPropsType = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & {
    variant?: "primary" | "secondary" | "dark" | "danger";
    className?: string;
  };

export default forwardRef<HTMLButtonElement, ButtonPropsType>(function Button(
  { children, variant = "primary", className, ...props },
  ref
) {
  const variants = {
    primary: "bg-primary hover:bg-primary-400",
    secondary: "bg-gray-100 hover:bg-gray-100/80",
    danger: "bg-red-500 hover:bg-gray-red-600 text-gray-100",
    dark: "bg-dark-dim border border-dark-semi-dim/80 text-gray-200",
  };
  return (
    <button
      ref={ref}
      className={`duration-500 text-black px-4 py-3 flex justify-center disabled:bg-opacity-70 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      style={{ backgroundImage: "url('/dots.svg')" }}
      {...props}
    >
      {children}
    </button>
  );
});
