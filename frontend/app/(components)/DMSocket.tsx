"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

let socketProvider = createContext<Socket | null>(null);

export function useDMSocket() {
  return useContext(socketProvider);
}

export default function DMSocketProvider({ children }: PropsWithChildren) {
  let [socket, setSocket] = useState<null | Socket>(null);
  useEffect(() => {
    let url = new URL(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] ?? "");
    url.protocol = "ws";
    url.pathname = "/dm";
    let createdSocket = io(url.toString(), {
      extraHeaders: { Authorization: `Bearer ${Cookies.get("access_token")}` },
      query: {},
      reconnection: false,
    });

    createdSocket?.on("newMessage", (data) => {
      console.log(data);
    });

    setSocket(createdSocket);

    return () => {
      createdSocket.disconnect();
    };
  }, []);

  return (
    <socketProvider.Provider value={socket}>{children}</socketProvider.Provider>
  );
}
