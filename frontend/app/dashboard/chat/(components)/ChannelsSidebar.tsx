"use client";
import useSWR from "swr";
import axios from "@/lib/axios";
import ChatGroup from "./ChatGroup";
import React, { useEffect } from "react";
import Spinner from "@/components/Spinner";
import MemberLabeLoading from "../channel/[id]/(components)/MemberLabeLoading";

export type ChannelType = {
  id: string;
  avatar: string;
  name: string;
  topic: string;
  isAdmin?: boolean;
  type: "PRIVATE" | "PUBLIC" | "PROTECTED";
};

async function getMyChannels(data: string) {
  let response = await axios.get(data);
  return response.data;
}
export default function ChannelsSidebar() {
  let { isLoading, data, mutate } = useSWR<ChannelType[]>(
    "/chat/channel",
    getMyChannels
  );

  if (isLoading)
    return (
      <>
        <MemberLabeLoading />
        <MemberLabeLoading />
        <MemberLabeLoading />
        <MemberLabeLoading />
        <MemberLabeLoading />
      </>
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
        <ChatGroup data={channel} />
        {index != (data?.length ?? 0) - 1 && (
          <hr className="border-dark-semi-dim" />
        )}
      </React.Fragment>
    );
  });

  return <>{Elements}</>;
}
