import Avatar from "@/components/DropDownAvatar";
import { ChannelType } from "./ChannelsSidebar";
import {
  Link,
  LockIcon,
  LogOut,
  Share,
  Share2,
  Target,
  Trash,
} from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropDown";

export default function ChatGroup({ data }: { data: ChannelType }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div>
          <Avatar src={"/avatar-1.png"} className="h-10 w-10">
            <DropdownMenuLabel>Channel</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link className="mr-2 h-4 w-4" />
              <span>Invite People</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Leave Channel</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Trash className="mr-2 h-4 w-4" />
              <span>Delete Channel</span>
            </DropdownMenuItem>
          </Avatar>
        </div>
        <div>
          <h4>{data.name}</h4>
          <h5 className="text-gray-500 text-xs">{data.topic}...</h5>
        </div>
      </div>
      <div>
        <div className="mb-2">
          <span className="text-gray-500 text-xs">5:16 PM</span>
        </div>
        {data.type === "PROTECTED" && (
          <LockIcon size={11} className="text-gray-500 ml-auto" />
        )}
        {data.type === "PRIVATE" && (
          <Share2 size={11} className="text-gray-500 ml-auto" />
        )}
        {data.type === "PUBLIC" && (
          <Target size={11} className="text-gray-500 ml-auto" />
        )}
      </div>
    </div>
  );
}
