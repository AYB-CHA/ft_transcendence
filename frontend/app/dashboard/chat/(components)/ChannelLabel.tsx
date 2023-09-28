import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { Lock } from "lucide-react";
import React from "react";
import { ChannelType } from "./ChannelsSidebar";

export default function ChannelLabel({
  avatar,
  name,
  type,
}: {
  name: string;
  avatar: string;
  type: "PRIVATE" | "PUBLIC" | "PROTECTED";
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
            <span>42 members</span>
            <span>{type === "PROTECTED" && <Lock size={12} />}</span>
          </h5>
        </div>
      </div>
      <div>
        <Button className="w-32" variant="secondary">
          Join Channel
        </Button>
      </div>
    </div>
  );
}
