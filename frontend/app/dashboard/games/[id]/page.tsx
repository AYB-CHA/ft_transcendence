"use client";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useGame } from "../repo";
import Spinner from "@/components/Spinner";
import Avatar from "@/components/Avatar";
import { cn } from "@/app/lib/cn";
import useSWR from "swr";
import { Scoreboard } from "@/types/game/scoreboard";

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

  const { data: scoreboard } = useSWR<Scoreboard | undefined>(
    `match-${id}-scoreboard`,
    () => undefined,
  );

  if (isLoading) return <Spinner />;
  if (!game) return <div>Game not found</div>;

  return (
    <div>
      <div className="flex gap-2 items-center flex-wrap justify-between font-bold w-full ">
        <UserScore
          score={scoreboard?.left ?? game.initiatorScore}
          username={game.initiator.username}
          avatar={game.initiator.avatar}
          status={game.initiatorStatus}
        />

        <p className="text-4xl min-w-full sm:min-w-[100px] text-center">vs</p>
        <UserScore
          score={scoreboard?.right ?? game.participantScore}
          username={game.participant.username}
          avatar={game.participant.avatar}
          status={game.participantStatus}
          className="flex-row-reverse"
        />
      </div>

      {<Game status={game.status} id={game.id} />}
    </div>
  );
}

export default function Page() {
  return (
    <div className="container">
      <div className="mt-10"></div>
      <GameIndex />
      <audio src="/whistle.mp3" id="game-whistle" />
      <audio loop src="/crowd.mp3" id="game-crowd" />
    </div>
  );
}
