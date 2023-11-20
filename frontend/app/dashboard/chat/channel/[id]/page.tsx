"use client";

import ChannelController from "./(components)/ChannelController";
import ChatBox from "./(components)/ChatBox";

import { createContext, useContext, useEffect, useMemo } from "react";
import { Socket, io } from "socket.io-client";
import { useParams } from "next/navigation";
import { mutate } from "swr";

const ChatSocketContext = createContext<Socket | null>(null);

export function useChannelChatSocket() {
  return useContext(ChatSocketContext);
}

export function clearSWRCache() {
  mutate(
    /* match all keys for now */ (key) => {
      return true;
    }
  );
}

export default function Page() {
  const { id } = useParams();

  const socket = useMemo(() => {
    const url = new URL(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] ?? "");
    url.protocol = "ws";
    url.pathname = "/channel";
    return io(url.toString(), {
      withCredentials: true,
      transports: ["websocket"],
      query: {
        channelId: id,
      },
      autoConnect: false,
      reconnection: false,
    });
  }, [id]);

  useEffect(() => {
    socket.connect();
    socket.on("criticalChange", () => {
      console.log("SHOULD RELOAD.");
      clearSWRCache();
    });
    return () => {
      if (socket.connected) socket.disconnect();
    };
  }, [socket]);

  return (
    <>
      <ChatSocketContext.Provider value={socket}>
        <ChatBox />
        <ChannelController />
      </ChatSocketContext.Provider>
    </>
  );
}
