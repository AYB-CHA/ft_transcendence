import Avatar from "@/components/DropDownAvatar";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/DropDown";
import { UserMinus } from "lucide-react";
import { ChannelType } from "./ChannelController";
import { UserType } from "@/hooks/auth";
import { ChannelMemberType } from "./ChannelMembers";
import MakeAdmin from "./MembersAvatarDropDown/MakeAdmin";
import MakeModerator from "./MembersAvatarDropDown/MakeModerator";
import KickOut from "./MembersAvatarDropDown/KickOut";
import Ban from "./MembersAvatarDropDown/Ban";
import SendDM from "./MembersAvatarDropDown/SendDM";
import OnlineStatus from "@/app/dashboard/(components)/OnlineStatus";
import Block from "./MembersAvatarDropDown/Block";
import Mute from "./MembersAvatarDropDown/Mute";

export default function MemberLabel({
  channel,
  me,
  member,
}: {
  channel: ChannelType;
  me: UserType;
  member: ChannelMemberType;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <div>
          <Avatar src={member.avatar} className="h-10 w-10">
            <DropdownMenuLabel>User</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <MakeAdmin channel={channel} me={me} member={member} />
            <MakeModerator channel={channel} member={member} />
            <Mute
              isDisabled={
                member.isMuted ||
                member.role === "ADMINISTRATOR" ||
                channel.myRole === "MEMBER" ||
                me.id === member.id
              }
              userId={member.id}
              channelId={channel.id}
              isMuted={member.isMuted}
            />
            {/* <SendDM userId={member.id} />
            <Block userId={member.id} myId={me.id} /> */}
            <DropdownMenuSeparator />
            <KickOut channel={channel} member={member} />
            <Ban channel={channel} member={member} />
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
        <OnlineStatus
          status={member.status != "OFFLINE" || me.id === member.id}
        />
      </div>
    </div>
  );
}
