import { DropdownMenuItem } from "@/components/ui/DropDown";
import { Sparkles, Star, User2 } from "lucide-react";
import { ChannelType, UserRoleOnChannel } from "../ChannelController";
import { UserType } from "@/hooks/auth";
import { ChannelMemberType } from "../ChannelMembers";
import axios from "@/lib/axios";
import { KeyedMutator } from "swr";
import { useChatSocket } from "../../page";
export default function MakeModerator({
  channel,
  me,
  member,
}: {
  channel: ChannelType;
  me: UserType;
  member: ChannelMemberType;
}) {
  let chatSocket = useChatSocket();

  let isDisabled = true;

  if (channel.myRole === "ADMINISTRATOR" && member.role === "MEMBER") {
    isDisabled = false;
  }

  async function clickHandler(grade: UserRoleOnChannel) {
    chatSocket?.emit("upgrade", {
      channelId: channel.id,
      userId: member.id,
      grade: grade,
    });
  }

  if (channel.myRole === "ADMINISTRATOR" && member.role === "MODERATOR") {
    return (
      <DropdownMenuItem
        onClick={() => {
          clickHandler("MEMBER");
        }}
      >
        <User2 className="mr-2 h-4 w-4" />
        <span>Make Member</span>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      disabled={isDisabled}
      onClick={() => {
        clickHandler("MODERATOR");
      }}
    >
      <Star className="mr-2 h-4 w-4" />
      <span>Make Moderator</span>
    </DropdownMenuItem>
  );
}
