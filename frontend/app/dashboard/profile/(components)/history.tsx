import Spinner from "@/components/Spinner";
import { useMyGames } from "../../games/repo";
import Alert from "@/components/Alert";
import Avatar from "@/components/Avatar";
import { User } from "@/types/user";
import { cn } from "@/app/lib/cn";
import { Game } from "@/types/game/game";
import Stats from "./stats";
import { Swords } from "lucide-react";

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

export function History({ id }: { id: string }) {
  const { isLoading, data: history, error } = useMyGames();
  const myWonGames = history?.filter(
    (game) =>
      (game.initiator.id === id &&
        game.initiatorScore > game.participantScore) ||
      (game.participant.id === id &&
        game.initiatorScore < game.participantScore)
  );
  const myLostGames = history?.filter(
    (game) =>
      (game.initiator.id === id &&
        game.initiatorScore < game.participantScore) ||
      (game.participant.id === id &&
        game.initiatorScore > game.participantScore)
  );
  return (
    <div className="lg:flex gap-4 w-full">
      {isLoading && <Spinner />}
      {error && <Alert variant="danger">Failed to get Games</Alert>}
      {!isLoading && !error && !history?.length && <Alert>No Games</Alert>}
      <div className="border bg-dark-dim flex lg:w-[70%]">
        <div className="w-full">
          <p className="border-b text-xl p-6">Match History</p>
          <div className="p-4 space-y-4 max-h-96 overflow-auto">
            {history?.map((game) => (
              <MatchHistory key={game.id} match={game} />
            ))}
          </div>
        </div>
      </div>
      <div className="border lg:w-[30%]">
          <p className="border-b text-xl p-6">Stats</p>
          <div className="flex mt-8 items-center">
            {/* <p>wonGames</p> */}
            <div className=" relative m-auto left-[25%]">
              <Swords className="w-16 h-16 m-auto" />
              <p className="text-xl">{(myWonGames?.length ?? 0) + (myLostGames?.length ?? 0)} TOTAL GAMES</p>
            </div>
            <Stats
              wonGames={myWonGames?.length}
              lostGames={myLostGames?.length}
            />
            {/* <p>lostGames</p> */}
          </div>
      </div>
    </div>
  );
}
