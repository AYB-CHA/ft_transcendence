import { DropdownMenuItem } from "@/components/ui/DropDown";
import { ChannelType } from "../ChannelController";
import { UserType } from "@/hooks/auth";
import { ChannelMemberType } from "../ChannelMembers";
import axios from "@/lib/axios";
import { KeyedMutator } from "swr";
import { BanIcon } from "lucide-react";
import { useChatSocket } from "../../page";
export default function Ban({
  channel,
  member,
}: {
  channel: ChannelType;
  member: ChannelMemberType;
}) {
  let chatSocket = useChatSocket();

  let isDisabled = true;
  if (channel.myRole === "ADMINISTRATOR" && member.role !== "ADMINISTRATOR")
    isDisabled = false;
  else if (channel.myRole === "MODERATOR" && member.role === "MEMBER")
    isDisabled = false;
  async function clickHandler() {
    chatSocket?.emit("banUser", { channelId: channel.id, userId: member.id });
  }

  return (
    <DropdownMenuItem disabled={isDisabled} onClick={clickHandler}>
      <BanIcon className="mr-2 h-4 w-4" />
      <span>Ban</span>
    </DropdownMenuItem>
  );
}
