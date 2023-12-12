"use client";

import Button from "@/components/Button";
import { ROUTER } from "@/lib/ROUTER";
import { sendEvent, useWs } from "../repo";
import { Swords } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { socket } from "../socket";
import Link from "next/link";
import { GameLaunch } from "@/types/game/game";
import { useAuth } from "@/hooks/auth";
import { Compititor } from "./Compititor";

export default function NewGame() {
  const router = useRouter();
  const { user } = useAuth();
  const status = useWs<"PENDING" | "CONNECTING">("PEERING", {
    defaultValue: "CONNECTING",
  });

  const lanuchGame = useWs<GameLaunch | undefined>("LAUNCH_GAME", {
    defaultValue: undefined,
  });

  const timeout = useWs<boolean>("TIMEOUT", { defaultValue: false });

  const [count, setCount] = React.useState(0);
  const arr = [
    "Ismail ait bella",
    "Fatima Zehra",
    "Lahcen kharbouch",
    "Youssef Elbouaazaoui",
    "Yassine Naimi",
    "Younes Sbai",
    "Hassan Dardour",
  ];

  useEffect(() => {
    if (!lanuchGame) return;
    const to = setTimeout(() => {
      router.push(ROUTER.GAME(lanuchGame.matchId));
    }, 1000);

    return () => {
      clearTimeout(to);
    };
  }, [lanuchGame, router]);

  useEffect(() => {
    if (status === "PENDING" || status == "CONNECTING") return;
    router.push(ROUTER.GAME(status));
  }, [status, router]);

  useEffect(() => {
    const i = setInterval(() => {
      setCount((c) => (c % 6) + 1);
    }, 100);
    if (!socket.connected) socket.connect();
    socket.on("connect", () => {
      sendEvent("PEERING", {});
    });
    return () => {
      socket.off("connect");
      if (socket.connected) socket.disconnect();
      clearInterval(i);
    };
  }, []);

  let initiator = {
    fullName: arr[count],
    username: arr[count].split(" ")[0],
    avatar: `${process.env["NEXT_PUBLIC_BACKEND_BASEURL"]}public/avatars/${count}.png`,
  };
  let participant = {
    fullName: arr[count],
    username: arr[count].split(" ")[0],
    avatar: `${process.env["NEXT_PUBLIC_BACKEND_BASEURL"]}public/avatars/${count}.png`,
  };
  if (lanuchGame && user) {
    initiator = lanuchGame.isInitiator ? user : lanuchGame.opponent;
    participant = lanuchGame.isInitiator ? lanuchGame.opponent : user;
  }

  return (
    <div className="h-screen flex flex-col items-center gap-10 justify-center">
      {timeout && <h2 className="text-2xl font-bold"> NO COMPATITOR FOUND </h2>}
      {!timeout && status === "PENDING" && (
        <h2 className="text-2xl font-bold"> LOOK FOR A COMPATITOR </h2>
      )}
      {!timeout && status === "CONNECTING" && (
        <h2 className="text-2xl font-bold"> CONNECTING </h2>
      )}
      {!timeout && lanuchGame && (
        <h2 className="text-2xl font-bold">REDIRECTING TO GAME...</h2>
      )}

      {!timeout && (
        <p className="text-2xl">
          <span className="animate-bounce w-2 h-6 inline-block">.</span>
          <span className="animate-bounce delay-100 w-2 h-6 inline-block">
            .
          </span>
          <span className="animate-bounce delay-200 w-2 h-6 inline-block">
            .
          </span>
        </p>
      )}

      <div className="flex gap-x-5 gap-y-10 flex-wrap text-center items-center">
        {!timeout && (
          <>
            <Compititor
              name={initiator.fullName}
              username={initiator.username}
              image={initiator.avatar}
            />
            <div>
              <Swords className="h-24 w-24" />
            </div>
            <Compititor
              name={participant.fullName}
              username={participant.username}
              image={participant.avatar}
            />
          </>
        )}

        <div className="w-full ">
          <Link href={ROUTER.GAMES}>
            <Button className="mx-auto min-w-[200px] font-bold"> Cancel</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
