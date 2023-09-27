"use client";
import useSWR from "swr";
import axios from "@/lib/axios";
import ChatGroup from "./ChatGroup";
import React from "react";
import Link from "next/link";
import Spinner from "@/components/Spinner";

export type ChannelType = {
  id: string;
  avatar: string;
  name: string;
  topic: string;
  type: "PRIVATE" | "PUBLIC" | "PROTECTED";
};

async function getMyChannels(data: string) {
  let response = await axios.get(data);
  return response.data;
}
export default function ChannelsSidebar() {
  let { isLoading, data } = useSWR<ChannelType[]>(
    "/chat/channel",
    getMyChannels
  );

  if (isLoading)
    return (
      <div className="h-full flex justify-center py-24">
        <Spinner />
      </div>
    );

  if (data?.length === 0)
    return (
      <div className="py-24 text-xs text-gray-500 text-center">
        Join A Channel to start talking
      </div>
    );

  const Elements = data?.map((channel, index) => {
    return (
      <React.Fragment key={channel.id}>
        <Link href={`/dashboard/chat/channel/${channel.id}`}>
          <ChatGroup data={channel} />
        </Link>
        {index != (data?.length ?? 0) - 1 && (
          <hr className="border-dark-semi-dim" />
        )}
      </React.Fragment>
    );
  });

  return <>{Elements}</>;
}
