import { DropdownMenuItem } from "@/components/ui/DropDown";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

import axios from "@/lib/axios";
import React from "react";
import { dispatchServerError } from "@/app/lib/Toast";

export async function getDmId(userId: string) {
  try {
    return (await axios.post("/chat/dm/thread", { userId })).data.id;
  } catch {
    dispatchServerError();
  }
}

export default function SendDM({ userId }: { userId: string }) {
  const { push } = useRouter();

  return (
    <DropdownMenuItem
      onClick={async () => {
        const id = await getDmId(userId);
        if (!id) return;
        push(`/dashboard/chat/dm/${id}`);
      }}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      <span>Send DM</span>
    </DropdownMenuItem>
  );
}
