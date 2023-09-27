import Avatar from "@/components/Avatar";
import React from "react";

export default function MyMessage() {
  return (
    <div className="flex gap-2 text-right justify-end">
      <div className="flex flex-col gap-2 items-end">
        <span className="text-gray-500 text-xs">@ssmith</span>
        <div className="p-2 border border-gray-600 w-fit bg-dark-semi-dim rounded rounded-tr-none">
          This is a small test message.
        </div>
        <div className="p-2 border border-gray-600 w-fit bg-dark-semi-dim rounded rounded-tr-none">
          This is a smaller
        </div>
      </div>
      <div>
        <Avatar src={"https://github.com/shadcn.png"} className="h-10 w-10" />
      </div>
    </div>
  );
}
