"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  PropsWithChildren,
  useState,
} from "react";

import { Socket, io } from "socket.io-client";
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

export default function ChatSocketProvider({
  children,
  id,
}: PropsWithChildren & {
  id: string;
}) {
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
      forceNew: true,
    });
  }, [id]);

  useEffect(() => {
    socket.connect();

    socket.on("criticalChange", () => {
      clearSWRCache();
    });

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <ChatSocketContext.Provider value={socket}>
      {children}
    </ChatSocketContext.Provider>
  );
}
