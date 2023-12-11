"use client";

import Spinner from "@/components/Spinner";
import { useLeaderboard } from "../games/repo";

export default function Page() {
  const { data: leaderboard, isLoading, error } = useLeaderboard();
  return (
    <div>
      {isLoading && <Spinner />}
      {error && <p>Error: could retrieve leaderboard please try again</p>}
      <div className="space-y-2 mt-10">
        {leaderboard?.map((user, i) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                <p className="font-bold text-lg">{i + 1}</p>
              </div>
              <div className="ml-2">
                <p className="font-bold">{user.username}</p>
                <p className="text-gray-500">{user.fullName}</p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-bold">{user.xp}</p>
              <p className="ml-2 text-gray-500">points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
