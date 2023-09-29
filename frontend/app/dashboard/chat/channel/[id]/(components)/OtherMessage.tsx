import Avatar from "@/components/DropDownAvatar";
import React from "react";
import { MessageType } from "./ChatBox";

export default function OtherMessage({
  messages,
}: {
  messages: MessageType[];
}) {
  return (
    <div className="flex gap-2 text-right justify-end">
      <div className="flex flex-col gap-2 items-end">
        <span className="text-gray-500 text-xs">@ssmith</span>
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className="p-2 border border-gray-600 w-fit bg-dark-semi-dim rounded rounded-tr-none"
            >
              {message.text}
            </div>
          );
        })}
      </div>
      <div>
        <Avatar src={"https://github.com/shadcn.png"} className="h-10 w-10" />
      </div>
    </div>
  );
}
