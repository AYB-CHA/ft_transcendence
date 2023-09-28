import Avatar from "@/components/Avatar";
import { Lock } from "lucide-react";
import React from "react";
import JoinChannelButton from "./JoinChannelButton";

export default function ChannelLabel({
  id,
  avatar,
  name,
  type,
  usersCount,
  topic,
}: {
  id: string;
  name: string;
  avatar: string;
  type: "PUBLIC" | "PROTECTED";
  usersCount: number;
  topic: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div>
          <Avatar src={avatar} className="h-10 w-10" />
        </div>
        <div>
          <h4>{name}</h4>
          <h5 className="text-gray-500 text-xs flex items-center gap-1">
            <span>{usersCount} members</span>
            <span>{type === "PROTECTED" && <Lock size={12} />}</span>
          </h5>
        </div>
      </div>
      <div>
        <JoinChannelButton
          type={type}
          avatar={avatar}
          name={name}
          topic={topic}
          id={id}
        />
      </div>
    </div>
  );
}
