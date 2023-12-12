"use client";

import Avatar from "@/components/Avatar";

interface CompititorProps {
  className?: string;
  name: string;
  username: string;
  image?: string;
}

export function Compititor({
  className,
  name,
  username,
  image,
}: CompititorProps) {
  return (
    <div className="grow border rounded min-h-[250px] p-4 w-48 flex flex-col justify-center">
      <Avatar
        src={image ?? "http://github.com/shadcn.png"}
        className="h-20 w-20 mx-auto"
      />
      <p className="font-bold mt-2 text-xl truncate">{name}</p>
      <p className="text-gray-500 truncate">@{username}</p>
    </div>
  );
}
