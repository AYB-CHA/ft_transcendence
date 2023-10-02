import { DropdownMenuItem } from "@/components/ui/DropDown";
import { Sparkles, Star } from "lucide-react";
import { ChannelType } from "../ChannelController";
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
  let isDisabled =
    me.id === member.id ||
    channel.myRole !== "ADMINISTRATOR" ||
    member.role !== "MEMBER";

  async function clickHandler() {
    chatSocket?.emit("upgrade", {
      channelId: channel.id,
      userId: member.id,
      grade: "MODERATOR",
    });
  }

  return (
    <DropdownMenuItem disabled={isDisabled} onClick={clickHandler}>
      <Star className="mr-2 h-4 w-4" />
      <span>Make Moderator</span>
    </DropdownMenuItem>
  );
}
