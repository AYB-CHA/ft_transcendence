import { io } from "socket.io-client";

const url = new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000");

url.protocol = "ws";
url.pathname = "/game";
console.log(url.toString());

export const socket = io(url.toString(), {
  transports: ["websocket"],
  withCredentials: true,
});
