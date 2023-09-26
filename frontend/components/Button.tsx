"use client";

import React, { LegacyRef, PropsWithChildren } from "react";

type ButtonPropsType = PropsWithChildren & {
  onClick?: () => void;
  variant?: "primary" | "secondary" | "dark";
  className?: string;
};

export default React.forwardRef<HTMLButtonElement, ButtonPropsType>(
  function Button(
    { children, onClick = undefined, variant = "primary", className },
    ref
  ) {
    const variants = {
      primary: "bg-primary hover:bg-primary-400",
      secondary: "bg-gray-100 hover:bg-gray-100/80",
      dark: "bg-black border border-[#4B5563] text-gray-200",
    };
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`duration-500 text-black px-4 py-3 flex justify-center ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  }
);
