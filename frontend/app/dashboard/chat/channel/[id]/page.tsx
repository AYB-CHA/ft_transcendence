"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useParams, useRouter } from "next/navigation";
import { mutate } from "swr";
import ChatBox from "./(components)/ChatBox";
import ChannelController from "./(components)/ChannelController";

let ChatSocketContext = createContext<Socket | null>(null);

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
  let { id } = useParams();

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const url = new URL(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] ?? "");
    url.protocol = "ws";
    url.pathname = "/channel";
    const socket = io(url.toString(), {
      withCredentials: true,
      transports: ["websocket"],
      query: {
        channelId: id,
      },
      reconnection: false,
    });

    socket.on("criticalChange", () => {
      console.log("SHOULD RELOAD.");
      clearSWRCache();
    });

    setSocket(socket);
    return () => {
      socket.off("criticalChange");
      socket.disconnect();
    };
  }, [id]);

  return (
    <>
      <ChatSocketContext.Provider value={socket}>
        <ChatBox />
        <ChannelController />
      </ChatSocketContext.Provider>
    </>
  );
}
