import { DropdownMenuItem } from "@/components/ui/DropDown";
import { ChannelMemberType } from "../ChannelMembers";
import { ChannelType } from "../ChannelController";
import { Trash2 } from "lucide-react";
import { useChannelChatSocket } from "../../providers/ChatSocketProvider";

export default function KickOut({
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
    chatSocket?.emit("kickUser", { channelId: channel.id, userId: member.id });
  }

  return (
    <DropdownMenuItem disabled={isDisabled} onClick={clickHandler}>
      <Trash2 className="mr-2 h-4 w-4" />
      <span>Kick</span>
    </DropdownMenuItem>
  );
}
