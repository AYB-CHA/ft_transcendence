"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";

import { MessageType } from "../dashboard/chat/channel/[id]/(components)/ChatBox";
import { Socket, io } from "socket.io-client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { mutate } from "swr";

const socketProvider = createContext<Socket | null>(null);

export function useDMSocket() {
  return useContext(socketProvider);
}

export default function DMSocketProvider({ children }: PropsWithChildren) {
  const socket = useMemo(() => {
    const url = new URL(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] ?? "");
    url.protocol = "ws";
    url.pathname = "/dm";
    const socket = io(url.toString(), {
      query: {},
      withCredentials: true,
      transports: ["websocket"],
      reconnection: false,
      autoConnect: false,
    });
    return socket;
  }, []);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    socket.connect();
    return () => {
      if (socket.connected) socket.disconnect();
    };
  }, [socket]);

  const newMessageHandler = (message: MessageType) => {
    mutate("/chat/dm/threads/unread-messages");
    mutate("/chat/dm/threads");
  };

  useEffect(() => {
    socket?.on("newMessage", newMessageHandler);
    return () => {
      socket?.off("newMessage", newMessageHandler);
    };
  }, [user, socket, router]);

  return (
    <socketProvider.Provider value={socket}>{children}</socketProvider.Provider>
  );
}
