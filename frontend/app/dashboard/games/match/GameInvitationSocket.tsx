"use client";

import { Socket, io } from "socket.io-client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";

const GameInviteSocketContext = createContext<Socket | undefined>(undefined);

export function useGameInviteSocket() {
  const socket = useContext(GameInviteSocketContext);
  if (socket === undefined) {
    throw new Error("Game invite socket isn't provided");
  }
  return socket;
}

export function GameInviteSocketProvider({ children }: PropsWithChildren) {
  const socket = useMemo(() => {
    const url = new URL(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] ?? "");
    url.pathname = "/game-match";
    url.protocol = "ws";
    return io(url.toString(), {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
    });
  }, []);

  useEffect(() => {
    socket.connect();
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <GameInviteSocketContext.Provider value={socket}>
      {children}
    </GameInviteSocketContext.Provider>
  );
}
