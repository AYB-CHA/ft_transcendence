import { DropdownMenuItem } from "@/components/ui/DropDown";
import { Sparkles } from "lucide-react";
import { ChannelType } from "../ChannelController";
import { UserType } from "@/hooks/auth";
import { ChannelMemberType } from "../ChannelMembers";
import axios from "@/lib/axios";
import { KeyedMutator } from "swr";
import { useChatSocket } from "../../page";
export default function MakeAdmin({
  channel,
  me,
  member,
}: {
  channel: ChannelType;
  me: UserType;
  member: ChannelMemberType;
}) {
  const chatSocket = useChatSocket();
  let isDisabled =
    me.id === member.id ||
    channel.myRole !== "ADMINISTRATOR" ||
    member.role === "ADMINISTRATOR";

  async function clickHandler() {
    chatSocket?.emit("upgrade", {
      channelId: channel.id,
      userId: member.id,
      grade: "ADMINISTRATOR",
    });
  }

  return (
    <DropdownMenuItem disabled={isDisabled} onClick={clickHandler}>
      <Sparkles className="mr-2 h-4 w-4" />
      <span>Make Admin</span>
    </DropdownMenuItem>
  );
}
