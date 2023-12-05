import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);

const socket = io(process.env["NEXT_PUBLIC_BACKEND_BASEURL"] ?? "", {
  transports: ["websocket"],
  autoConnect: true,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    socket.on("connection", () => {
      console.log("connected", socket.connected);
      setConnected(socket.connected);
    });
    return () => {
      console.log("disconnecting");
      socket.off("connection");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!connected) {
    return <span>connecting ...</span>;
  }
  console.log("socket", socket);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const socket = useContext(SocketContext);

  if (!socket) {
    throw new Error("please use useSocket inside SocketProvider");
  }
  return socket;
}
