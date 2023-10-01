import { DropdownMenuItem } from "@/components/ui/DropDown";
import { Sparkles, Star, Trash2 } from "lucide-react";
import { ChannelType } from "../ChannelController";
import { UserType } from "@/hooks/auth";
import { ChannelMemberType } from "../ChannelMembers";
import axios from "@/lib/axios";
import { KeyedMutator } from "swr";
export default function KickOut({
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
  let isDisabled = true;
  if (member.id === channel.id) isDisabled = true;
  else if (
    channel.myRole === "ADMINISTRATOR" &&
    member.role !== "ADMINISTRATOR"
  )
    isDisabled = false;
  else if (channel.myRole === "MODERATOR" && member.role === "MEMBER")
    isDisabled = false;
  async function clickHandler() {
    try {
      await axios.post(`/chat/channel/kick/${channel.id}`, {
        userId: member.id,
      });
      mutator();
    } catch (error) {}
  }

  return (
    <DropdownMenuItem disabled={isDisabled} onClick={clickHandler}>
      <Trash2 className="mr-2 h-4 w-4" />
      <span>Kick</span>
    </DropdownMenuItem>
  );
}
