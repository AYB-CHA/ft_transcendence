"use client";
import { Lock } from "lucide-react";
import { InputHTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type InputPropsType = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  className?: string;
};

export default function Input({ icon, className, ...props }: InputPropsType) {
  return (
    <div className="relative">
      <input
        className={twMerge(
          "py-2.5 px-4 border border-dark-semi-light/20 focus:border-b-primary-300/50 transition-colors border-b-2 block w-full bg-dark-semi-dim focus:outline-none",
          props.disabled
            ? "placeholder:text-gray-600 cursor-not-allowed"
            : "placeholder:text-gray-500",
          className
        )}
        {...props}
      />
      <div className="absolute top-1/2 -translate-y-1/2 right-3 text-dark-semi-light">
        {icon}
      </div>
    </div>
  );
}
