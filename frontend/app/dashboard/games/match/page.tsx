"use client";

import { useGameInviteSocket } from "./GameInvitationSocket";
import { useAuth } from "@/hooks/auth";
import { Swords } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTER } from "@/lib/ROUTER";
import { Compititor } from "../new/Compititor";

type Opponent = {
  avatar: string;
  fullName: string;
  username: string;
};

type FindInviteRes = { pending: boolean } & (
  | { success: false }
  | {
      success: true;
      opponent: Opponent;
    }
);

export default function Page() {
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const socket = useGameInviteSocket();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    socket.emit("find-invite", (res: FindInviteRes) => {
      res.success && setOpponent(res.opponent);
      console.log("res opponent: ", res);
    });

    const userId = user?.id;

    if (!userId) return;

    const callback = ({ matchId }: { matchId: string }) => {
      router.replace(ROUTER.GAME(matchId));
      console.log("Match started!");
    };

    socket.on(userId, callback);
    return () => {
      socket.off(userId, callback);
    };
  }, [socket, user?.id]);

  return (
    <div className="h-screen flex flex-col items-center gap-10 justify-center">
      <p className="text-2xl">
        <span className="animate-bounce w-2 h-6 inline-block">.</span>
        <span className="animate-bounce delay-100 w-2 h-6 inline-block">.</span>
        <span className="animate-bounce delay-200 w-2 h-6 inline-block">.</span>
      </p>
      <div className="flex gap-x-5 gap-y-10 flex-wrap text-center items-center">
        <Compititor
          name={user?.fullName ?? "Pending..."}
          username={user?.username ?? "Pending..."}
          image={user?.avatar ?? "Pending..."}
        />
        <div>
          <Swords className="h-24 w-24" />
        </div>
        <Compititor
          name={opponent?.fullName ?? "Pending..."}
          username={opponent?.username ?? "Pending..."}
          image={opponent?.avatar ?? "Pending..."}
        />
      </div>
    </div>
  );
}
