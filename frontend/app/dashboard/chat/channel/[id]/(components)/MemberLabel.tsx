import Avatar from "@/components/DropDownAvatar";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropDown";
import { Ban, Sparkles, Star, Trash2, UserMinus } from "lucide-react";

export default function MemberLabel({
  avatar,
  username,
  name,
}: {
  avatar: string;
  username: string;
  name: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div>
          <Avatar src={avatar} className="h-10 w-10">
            <DropdownMenuLabel>User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Make Admin</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star className="mr-2 h-4 w-4" />
              <span>Make Moderator</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserMinus className="mr-2 h-4 w-4" />
              <span>Block</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Kick Out</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Ban className="mr-2 h-4 w-4" />
              <span>Ban</span>
            </DropdownMenuItem>
          </Avatar>
        </div>
        <div>
          <h4>{name}</h4>
          <h5 className="text-gray-500 text-xs">@{username}</h5>
        </div>
      </div>
      <div>
        <div className="mb-2">
          <span className="text-gray-500 text-xs">5:16 PM</span>
        </div>
        <div className="rounded-full h-2 w-2 bg-primary-500 border border-white ml-auto"></div>
      </div>
    </div>
  );
}
