import Image from "next/image";
import React from "react";

export default function Avatar({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      className={`rounded-full border border-primary ${className}`}
      height={60}
      width={60}
      unoptimized
      alt="avatar"
    />
  );
}
