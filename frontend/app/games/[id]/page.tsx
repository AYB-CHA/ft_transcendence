"use client";
import dynamic from "next/dynamic";
import { SocketProvider } from "../context/socket";

const Game = dynamic(
  () => import("./components/index").then((mod) => mod.Game),
  { ssr: false },
);

export default function Page() {
  return <Game />;
}
