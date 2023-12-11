import Spinner from "@/components/Spinner";
import { useGames } from "@/app/dashboard/games/repo";
import Alert from "@/components/Alert";
import Avatar from "@/components/Avatar";
import { User } from "@/types/user";
import { cn } from "@/app/lib/cn";
import { Game } from "@/types/game/game";
import Stats from "./stats";
import { Swords } from "lucide-react";
import { useMemo } from "react";

type MatchUserProps = User & { className?: string };

function MatchUser({
  id,
  fullName,
  username,
  avatar,
  className,
}: MatchUserProps) {
  return (
    <div className={cn("flex items-center gap-4 w-[400px] ", className)}>
      <Avatar src={avatar}></Avatar>
      <div className="md:text-left text-center">
        <p title={fullName} className="text-2xl truncate max-w-[300px]">
          {fullName}
        </p>
        <p title={username} className="truncate max-w-[300px]">
          @{username}
        </p>
      </div>
    </div>
  );
}
//truncate
type MatchHistoryProps = {
  match: Game;
};
function MatchHistory({ match }: MatchHistoryProps) {
  return (
    <div className="group space-y-4">
      <div className="flex w-full justify-between gap-4 flex-wrap">
        <MatchUser {...match.initiator} />
        <div className="text-center grow basis-full lg:basis-[unset]">
          <p className=" text-2xl text-white">{`${match.initiatorScore} : ${match.participantScore}`}</p>
          <p>FINAL SCORE</p>
        </div>
        <MatchUser
          {...match.participant}
          className="flex-row-reverse basis-full lg:basis-[unset]"
        />
      </div>
      <hr className="w-[99%] mx-auto flex items-center group-last:border-none" />
    </div>
  );
}

interface HistoryProps {
  id: string;
}

export function History({ id }: HistoryProps) {
  const { isLoading, data: history, error } = useGames(id);
  const myWonGames = useMemo(
    () =>
      history?.filter(
        (game) =>
          (game.initiator.id === id &&
            game.initiatorScore > game.participantScore) ||
          (game.participant.id === id &&
            game.initiatorScore < game.participantScore),
      ),
    [history, id],
  );

  const myLostGames = useMemo(
    () =>
      history?.filter(
        (game) =>
          (game.initiator.id === id &&
            game.initiatorScore < game.participantScore) ||
          (game.participant.id === id &&
            game.initiatorScore > game.participantScore),
      ),
    [history, id],
  );
  return (
    <div className="lg:flex gap-4 w-full">
      {isLoading && <Spinner />}
      {error && <Alert variant="danger">Failed to get Games</Alert>}
      <div className="border bg-dark-dim flex lg:w-[70%]">
        <div className="w-full">
          <p className="border-b text-xl p-6">Match History</p>
          <div className="p-4 space-y-4 max-h-96 overflow-auto">
            {history?.length === 0 && (
              <p className="text-center text-xl">No Games</p>
            )}
            {history &&
              history.length > 0 &&
              history?.map((game) => (
                <MatchHistory key={game.id} match={game} />
              ))}
          </div>
        </div>
      </div>
      <div className="border lg:w-[30%]">
        <p className="border-b text-xl p-6">Stats</p>
        <div className="flex items-center justify-center relative">
          {history?.length === 0 && (
            <p className="text-center text-xl p-4">No Games</p>
          )}
          {history && history.length > 0 && (
            <>
              <div className="flex flex-col items-center absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Swords className="w-10 h-10" />
                <p className="text-xl">
                  {(myWonGames?.length ?? 0) + (myLostGames?.length ?? 0)} TOTAL
                  GAMES
                </p>
              </div>
              {myWonGames != undefined && myLostGames != undefined && (
                <Stats
                  wonGames={myWonGames?.length}
                  lostGames={myLostGames?.length}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
