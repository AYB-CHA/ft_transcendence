import { DropdownMenuItem } from "@/components/ui/DropDown";
import axios from "@/lib/axios";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export async function getDmId(userId: string) {
  return (await axios.post("/chat/dm/thread", { userId })).data.id;
}

export default function SendDM({ userId }: { userId: string }) {
  let { push } = useRouter();
  return (
    <DropdownMenuItem
      onClick={async () => {
        let id = await getDmId(userId);
        push(`/dashboard/chat/dm/${id}`);
      }}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      <span>Send DM</span>
    </DropdownMenuItem>
  );
}
