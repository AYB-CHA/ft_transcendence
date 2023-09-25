"use client";
import { Lock } from "lucide-react";
import { InputHTMLAttributes, PropsWithChildren, ReactNode } from "react";

type InputPropsType = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
};

export default function Input({ icon, ...props }: InputPropsType) {
  return (
    <div className="relative">
      <input
        className="py-3 px-4 border border-dark-semi-light block w-full bg-dark-semi-dim focus:outline-none"
        {...props}
      />
      <div className="absolute top-1/2 -translate-y-1/2 right-3 text-dark-semi-light">
        {icon}
      </div>
    </div>
  );
}
