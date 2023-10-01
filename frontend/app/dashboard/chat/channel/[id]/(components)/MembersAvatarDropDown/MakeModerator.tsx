import { DropdownMenuItem } from "@/components/ui/DropDown";
import { Sparkles, Star } from "lucide-react";
import { ChannelType } from "../ChannelController";
import { UserType } from "@/hooks/auth";
import { ChannelMemberType } from "../ChannelMembers";
import axios from "@/lib/axios";
import { KeyedMutator } from "swr";
export default function MakeModerator({
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
  let isDisabled =
    me.id === member.id ||
    channel.myRole !== "ADMINISTRATOR" ||
    member.role !== "MEMBER";

  async function clickHandler() {
    try {
      await axios.put(`/chat/channel/upgrade/${channel.id}`, {
        grade: "MODERATOR",
        userId: member.id,
      });
      mutator();
    } catch (error) {}
  }

  return (
    <DropdownMenuItem disabled={isDisabled} onClick={clickHandler}>
      <Star className="mr-2 h-4 w-4" />
      <span>Make Moderator</span>
    </DropdownMenuItem>
  );
}
