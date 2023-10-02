"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import ChannelController from "./(components)/ChannelController";
import ChatBox from "./(components)/ChatBox";
import { Socket, io } from "socket.io-client";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { mutate } from "swr";
let ChatSocketContext = createContext<Socket | null>(null);

export function useChatSocket() {
  return useContext(ChatSocketContext);
}

export function clearSWRCache() {
  mutate(/* match all keys */ () => true);
}
export default function Page() {
  let [socket, setSocket] = useState<Socket | null>(null);
  let { id } = useParams();
  let { refresh } = useRouter();

  useEffect(() => {
    let url = new URL(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] ?? "");
    url.protocol = "ws";
    url.pathname = "/channel";
    let socket = io(url.toString(), {
      extraHeaders: { Authorization: `Bearer ${Cookies.get("access_token")}` },
      query: {
        channelId: id,
      },
    });

    setSocket(socket);

    socket.on("criticalChange", () => {
      console.log("I am clearing the cache");
      clearSWRCache();
      refresh();
    });

    return () => {
      socket.disconnect();
    };
  }, [id, refresh]);

  return (
    <>
      <ChatSocketContext.Provider value={socket}>
        <ChatBox />
        <ChannelController />
      </ChatSocketContext.Provider>
    </>
  );
}
