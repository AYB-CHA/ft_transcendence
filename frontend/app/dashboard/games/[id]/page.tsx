"use client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useGame, useWs } from "../repo";
import Spinner from "@/components/Spinner";
import Avatar from "@/components/Avatar";
import { cn } from "@/app/lib/cn";
import useSWR, { useSWRConfig } from "swr";
import { Scoreboard } from "@/types/game/scoreboard";
import { socket } from "../socket";
import { useEffect } from "react";

const status2title = {
  FINISHED: "Finished",
  UNFINISHED: "Withdrew",
};

const Game = dynamic(
  () => import("./(components)/index").then((mod) => mod.Game),
  { ssr: false },
);

interface UserScoreProps {
  score: number;
  username: string;
  avatar: string;
  status: string;
  className?: string;
}

function UserScore({
  score,
  username,
  avatar,
  status,
  className,
}: UserScoreProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <p className="text-5xl bg-slate-900 h-16 w-16 flex items-center justify-center rounded">
        {score}
      </p>
      <Avatar src={avatar} />
      <p title={status2title[status as "FINISHED"]}>{username}</p>
    </div>
  );
}

function GameIndex() {
  const { id } = useParams();
  const { data: game, isLoading } = useGame(id as string);
  const { mutate } = useSWRConfig();

  const { data: scoreboard } = useSWR<Scoreboard | undefined>([
    "scoreboard",
    id,
  ]);

  const finished = useWs<Record<string, never> | undefined>("FINISHED", {
    defaultValue: undefined,
  });

  useEffect(() => {
    if (!finished) return;
    const crowd = document.getElementById("game-crowd") as HTMLAudioElement;
    if (crowd) crowd.pause();
  }, [finished]);

  useEffect(() => {
    if (!finished || !game) return;
    mutate(["match", game.id]);
  }, [finished, game, mutate]);

  console.log(scoreboard, "scoreboard");

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  if (isLoading) return <Spinner />;
  if (!game) return <div>Game not found</div>;

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center flex-wrap justify-between font-bold w-full ">
        <UserScore
          score={
            scoreboard === undefined ? game.initiatorScore : scoreboard.left
          }
          username={game.initiator.username}
          avatar={game.initiator.avatar}
          status={game.initiatorStatus}
        />

        <p className="text-4xl min-w-full sm:min-w-[100px] text-center">vs</p>
        <UserScore
          score={
            scoreboard === undefined ? game.participantScore : scoreboard.right
          }
          username={game.participant.username}
          avatar={game.participant.avatar}
          status={game.participantStatus}
          className="flex-row-reverse"
        />
      </div>

      {<Game status={finished ? "FINISHED" : game.status} id={game.id} />}
    </div>
  );
}

export default function Page() {
  return (
    <div className="container">
      <div className="mt-10"></div>
      <GameIndex />
      <pre>
        {`
          arrow up - to go up
          arrow down - to go down
        `}
      </pre>
      <audio src="/whistle.mp3" id="game-whistle" />
      <audio loop src="/crowd.mp3" id="game-crowd" />
    </div>
  );
}
