"use client";

import { Socket, io } from "socket.io-client";
import { useAuth } from "@/hooks/auth";
import { mutate } from "swr";

import Cookies from "js-cookie";

import { createContext, PropsWithChildren, useMemo, useEffect } from "react";

const FriendsSocketContext = createContext<Socket | undefined>(undefined);

// export function useFriendsSocket() {
//   const socket = useContext(FriendsSocketContext);
//   if (socket === undefined) throw new Error("The socket object isn't provided");
//   return socket;
// }

export function FriendsSocketProvider({ children }: PropsWithChildren) {
  const socket = useMemo(() => {
    const url = new URL(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] ?? "");
    url.pathname = "/friends";
    url.protocol = "ws";
    return io(url.toString(), {
      extraHeaders: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
      },
    });
  }, []);

  const { user } = useAuth();

  useEffect(() => {
    const userId: string | undefined = user?.id;

    if (userId === undefined) {
      return;
    }

    socket.on(userId, () => {
      mutate((key: unknown) => {
        const actualKey =
          typeof key === "string"
            ? key
            : (key as readonly [string, ...unknown[]])[0];
        return (
          actualKey.startsWith("/user/friends") || actualKey === "/user/search"
        );
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, user?.id]);

  return (
    <FriendsSocketContext.Provider value={socket}>
      {children}
    </FriendsSocketContext.Provider>
  );
}
