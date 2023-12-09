import { useChannelChatSocket } from "../../providers/ChatSocketProvider";
import { DropdownMenuItem } from "@/components/ui/DropDown";
import { ChannelMemberType } from "../ChannelMembers";
import { ChannelType } from "../ChannelController";
import { BanIcon } from "lucide-react";

export default function Ban({
  channel,
  member,
}: {
  channel: ChannelType;
  member: ChannelMemberType;
}) {
  const chatSocket = useChannelChatSocket();

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
