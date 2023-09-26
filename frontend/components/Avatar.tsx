"use client";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/DropDown";

import { PropsWithChildren } from "react";

export default function Avatar({
  src = null,
  className,
  children,
}: {
  src: string | null;
  className?: string;
} & PropsWithChildren) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {src && (
            <Image
              src={src}
              className={`rounded-full border border-primary cursor-pointer ${className}`}
              height={60}
              width={60}
              unoptimized
              alt="avatar"
            />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" sideOffset={10}>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
