import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/DropDown";

type MuteDuration = "10M" | "30M" | "1H" | "FOREVER";

import { CircleSlash, Clock12, Clock2, Clock6, TimerOff } from "lucide-react";
import { useChannelChatSocket } from "../../page";

export default function Mute({
  isDisabled = false,
  userId,
  channelId,
  isMuted,
}: {
  isDisabled?: boolean;
  userId: string;
  channelId: string;
  isMuted: boolean;
}) {
  let socket = useChannelChatSocket();
  const muteUser = (duration: MuteDuration) => {
    socket?.emit("muteUser", { channelId, userId, duration });
  };

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger disabled={isDisabled}>
          <CircleSlash className="mr-2 h-4 w-4" />
          <span>{isMuted ? "muted" : "mute"}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => muteUser("10M")}>
              <Clock2 className="mr-2 h-4 w-4" />
              <span>10 Minutes</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => muteUser("30M")}>
              <Clock6 className="mr-2 h-4 w-4" />
              <span>30 minutes</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => muteUser("1H")}>
              <Clock12 className="mr-2 h-4 w-4" />
              <span>1 hour</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => muteUser("FOREVER")}>
              <TimerOff className="mr-2 h-4 w-4" />
              <span>Forever</span>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}
