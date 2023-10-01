"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import ChannelController from "./(components)/ChannelController";
import ChatBox from "./(components)/ChatBox";
import { Socket, io } from "socket.io-client";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

let ChatSocketContext = createContext<Socket | null>(null);

export function useChatSocket() {
  return useContext(ChatSocketContext);
}

export default function Page() {
  let [socket, setSocket] = useState<Socket | null>(null);
  let { id } = useParams();

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

    socket.on("", () => {});

    return () => {
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
