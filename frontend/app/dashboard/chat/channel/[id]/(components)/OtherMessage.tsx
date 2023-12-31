import React from "react";
import { MessageType } from "./ChatBox";
import useSWR from "swr";
import axios from "@/lib/axios";
import { UserType } from "@/hooks/auth";
import Avatar from "@/components/Avatar";

export default function OtherMessage({
  messages,
}: {
  messages: MessageType[];
}) {
  const { data } = useSWR<UserType>(
    `/user/${messages[0].senderId}`,
    async (url) => {
      return (await axios.get(url)).data;
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <div className="flex gap-2 text-right justify-end">
      <div className="flex flex-col gap-2 items-end w-1/2">
        <span className="text-gray-500 text-xs">@{data?.username}</span>
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className="p-2 border border-dark-semi-dim w-fit max-w-full break-words bg-dark-semi-dark/30 rounded rounded-tl-none"
            >
              {message.text}
            </div>
          );
        })}
      </div>
      <div>{data && <Avatar src={data?.avatar} className="h-10 w-10" />}</div>
    </div>
  );
}
