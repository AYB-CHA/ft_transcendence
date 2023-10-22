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
import { useAuth } from "@/hooks/auth";
import { MessageType } from "../dashboard/chat/channel/[id]/(components)/ChatBox";
import { triggerSuccessToast } from "../lib/Toast";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

let socketProvider = createContext<Socket | null>(null);

export function useDMSocket() {
  return useContext(socketProvider);
}

export default function DMSocketProvider({ children }: PropsWithChildren) {
  let [socket, setSocket] = useState<null | Socket>(null);
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    let url = new URL(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] ?? "");
    url.protocol = "ws";
    url.pathname = "/dm";
    let createdSocket = io(url.toString(), {
      extraHeaders: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
      query: {},
      reconnection: false,
    });

    createdSocket?.on("connect", () => {});

    setSocket(createdSocket);

    return () => {
      createdSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.on("newMessage", (message: MessageType) => {
      console.log(user?.id, message.senderId);

      if (message.senderId !== user?.id) {
        triggerSuccessToast(
          <MessageCircle size={18} />,
          "New Messages",
          message.text,
          () => {
            // router.push(`/dashboard/chat/dm/${message.th}`);
          }
        );
      }
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [user, socket, router]);

  return (
    <socketProvider.Provider value={socket}>{children}</socketProvider.Provider>
  );
}
