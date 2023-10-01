import Avatar from "@/components/DropDownAvatar";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropDown";
import { BanIcon, Sparkles, Star, Trash2, UserMinus } from "lucide-react";
import { ChannelType, UserRoleOnChannel } from "./ChannelController";
import { UserType } from "@/hooks/auth";
import { ChannelMemberType } from "./ChannelMembers";
import MakeAdmin from "./MembersAvatarDropDown/MakeAdmin";
import { KeyedMutator } from "swr";
import MakeModerator from "./MembersAvatarDropDown/MakeModerator";
import KickOut from "./MembersAvatarDropDown/KickOut";
import Ban from "./MembersAvatarDropDown/Ban";

export default function MemberLabel({
  channel,
  me,
  member,
  mutator,
}: {
  channel: ChannelType;
  me: UserType;
  member: ChannelMemberType;
  mutator: KeyedMutator<ChannelMemberType[]>;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div>
          <Avatar src={member.avatar} className="h-10 w-10">
            <DropdownMenuLabel>User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <MakeAdmin
              channel={channel}
              me={me}
              member={member}
              mutator={mutator}
            />
            <MakeModerator
              channel={channel}
              me={me}
              member={member}
              mutator={mutator}
            />
            <DropdownMenuItem>
              <UserMinus className="mr-2 h-4 w-4" />
              <span>Block</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <KickOut
              channel={channel}
              me={me}
              member={member}
              mutator={mutator}
            />
            <Ban channel={channel} me={me} member={member} mutator={mutator} />
          </Avatar>
        </div>
        <div>
          <h4>{member.fullName}</h4>
          <h5 className="text-gray-500 text-xs">@{member.username}</h5>
        </div>
      </div>
      <div>
        <div className="mb-2">
          <span className="text-gray-500 text-xs">
            {member.role.toLowerCase()}
          </span>
        </div>
        <div className="rounded-full h-2 w-2 bg-primary-500 border border-white ml-auto"></div>
      </div>
    </div>
  );
}
