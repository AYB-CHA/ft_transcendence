"use client";
import Button from "@/components/Button";
import { useGames } from "./repo";
import Link from "next/link";
import { ROUTER } from "@/lib/ROUTER";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/auth";

interface GameButtonProps {
  className?: string;
}

export function NewGameButton({ className }: GameButtonProps) {
  return (
    <Link href={ROUTER.NEW_GAME}>
      <Button className={className}>New Game</Button>
    </Link>
  );
}

export default function Games() {
  const { user } = useAuth();
  const { data: games, isLoading } = useGames(user?.id);

  return (
    <div className="container mt-10 h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Games</h1>
        <NewGameButton />
      </div>

      {isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {games && games.length === 0 && (
        <div className="flex text-center">
          <div className="mt-10 mx-auto">
            <h2 className="text-xl font-bold">No Games</h2>
            <p className="text-gray-500">
              You have no games. Start a new game to get started.
            </p>
            <NewGameButton className="mx-auto mt-2" />
          </div>
        </div>
      )}

      {games && games.length > 0 && (
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <div key={game.id} className="text-center">
                <p>
                  {game.initiator.username} vs {game.participant.username}
                </p>
                <p>
                  {game.initiatorScore} - {game.participantScore}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
