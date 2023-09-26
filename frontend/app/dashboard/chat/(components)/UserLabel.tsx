import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import React from "react";

export default function UserLabel() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div>
          <Avatar src={"/avatar-1.png"} className="h-10 w-10" />
        </div>
        <div>
          <h4>Pong gang</h4>
          <h5 className="text-gray-500 text-xs">@ssmith</h5>
        </div>
      </div>
      <div>
        <Button className="w-28">Send DM</Button>
      </div>
    </div>
  );
}
