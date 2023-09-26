import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { Lock } from "lucide-react";
import React from "react";

export default function ChannelLabel() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div>
          <Avatar src={"/avatar-1.png"} className="h-10 w-10" />
        </div>
        <div>
          <h4>Pong gang</h4>
          <h5 className="text-gray-500 text-xs flex items-center gap-1">
            <span>42 members</span>
            <span className="">
              <Lock size={12} />
            </span>
          </h5>
        </div>
      </div>
      <div>
        <Button className="w-32">Join Channel</Button>
      </div>
    </div>
  );
}
