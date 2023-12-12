import { io } from "socket.io-client";

const url = new URL(process.env.NEXT_PUBLIC_BACKEND_BASEURL ?? "");

url.protocol = "ws";
url.pathname = "/game";
console.log(url.toString());

export const socket = io(url.toString(), {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false,
  forceNew: true,
});
