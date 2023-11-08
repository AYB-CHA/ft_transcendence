import React, { ReactNode, TextareaHTMLAttributes } from "react";

type TextAreaPropsType = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  icon?: ReactNode;
};

export default function TextArea({ icon, ...props }: TextAreaPropsType) {
  return (
    <div className="relative">
      <textarea
        className="py-2.5 placeholder:text-gray-500 px-4 border border-dark-semi-light/20 block w-full bg-dark-semi-dim focus:outline-none"
        {...props}
      ></textarea>
      <div className="absolute top-4 right-3 text-dark-semi-light">{icon}</div>
    </div>
  );
}
