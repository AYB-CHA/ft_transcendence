"use client";

import { Socket, io } from "socket.io-client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";

const GameSocketContext = createContext<Socket | undefined>(undefined);

export function useGameSocket(): Socket {
  const socket = useContext(GameSocketContext);
  if (socket === undefined) {
    throw new Error("Game socket isn't provided");
  }
  return socket;
}

export function GameSocketProvider({ children }: PropsWithChildren) {
  const socket = useMemo(() => {
    const url = new URL(
      process.env.NEXT_PUBLIC_BACKEND_BASEURL ?? "http://localhost:4000"
    );
    url.pathname = "/game";
    url.protocol = "ws";
    return io(url, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
    });
  }, []);

  // useEffect(() => {
  //   socket.connect();
  //   return () => {
  //     if (socket.connected) socket.disconnect();
  //   };
  // }, [socket]);

  return (
    <GameSocketContext.Provider value={socket}>
      {children}
    </GameSocketContext.Provider>
  );
}
