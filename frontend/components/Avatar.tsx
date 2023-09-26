"use client";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/DropDown";

import { PropsWithChildren } from "react";

export default function Avatar({
  src,
  className,
  children,
}: {
  src: string;
  className?: string;
} & PropsWithChildren) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Image
            className={`rounded-full border border-primary cursor-pointer ${className}`}
            height={60}
            width={60}
            src={src}
            unoptimized
            alt="avatar"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" sideOffset={10}>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
