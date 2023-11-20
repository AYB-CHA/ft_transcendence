import { MessageCircle } from "lucide-react";
import NavTab from "./NavTab";
import APIClient from "@/lib/axios";
import useSWR from "swr";
import { usePathname } from "next/navigation";

export function useUnreadMessagesCount() {
  return useSWR("/chat/dm/threads/unread-messages", async (uri: string) =>
    APIClient.get<{ count: number }>(uri).then(({ data }) => data)
  ).data?.count;
}

export default function MessagesTab() {
  const pathname = usePathname();
  const messagesCount = useUnreadMessagesCount();
  return (
    <NavTab
      href="/dashboard/chat"
      active={pathname.startsWith("/dashboard/chat")}
      count={messagesCount}
    >
      {<MessageCircle strokeWidth={1} />}
    </NavTab>
  );
}
