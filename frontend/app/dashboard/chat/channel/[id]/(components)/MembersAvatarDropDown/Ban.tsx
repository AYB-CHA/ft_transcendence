import { DropdownMenuItem } from "@/components/ui/DropDown";
import { ChannelType } from "../ChannelController";
import { UserType } from "@/hooks/auth";
import { ChannelMemberType } from "../ChannelMembers";
import axios from "@/lib/axios";
import { KeyedMutator } from "swr";
import { BanIcon } from "lucide-react";
export default function Ban({
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
  if (channel.myRole === "ADMINISTRATOR" && member.role !== "ADMINISTRATOR")
    isDisabled = false;
  else if (channel.myRole === "MODERATOR" && member.role === "MEMBER")
    isDisabled = false;
  async function clickHandler() {
    try {
      await axios.post(`/chat/channel/ban/${channel.id}`, {
        userId: member.id,
      });
      mutator();
    } catch (error) {}
  }

  return (
    <DropdownMenuItem disabled={isDisabled} onClick={clickHandler}>
      <BanIcon className="mr-2 h-4 w-4" />
      <span>Ban</span>
    </DropdownMenuItem>
  );
}
