"use client";

import ChannelController from "./(components)/ChannelController";
import ChatSocketProvider from "./providers/ChatSocketProvider";
import ChatBox from "./(components)/ChatBox";

import { useParams } from "next/navigation";
import { mutate } from "swr";

export default function Page() {
  const { id } = useParams<{ id: string }>();

  return (
    <ChatSocketProvider id={id}>
      <ChatBox />
      <ChannelController />
    </ChatSocketProvider>
  );
}
