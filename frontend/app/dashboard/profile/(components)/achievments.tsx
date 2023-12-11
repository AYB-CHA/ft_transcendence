import { AchievementIcon } from "@/components/Achievement_icon";
import Alert from "@/components/Alert";
import Spinner from "@/components/Spinner";
import APIClient from "@/lib/axios";
import type { Achievement } from "@/types/Achievments";
import React from "react";
import useSWR from "swr";

interface AchievmentsProps {
  id: string | undefined;
}
const useAchievements = (id: string | undefined) => {
  return useSWR(`/achievements/user/${id}`, (key) =>
    APIClient.get<Achievement[]>(key).then((res) => res.data),
  );
};

//swr (check)
export function Achievments({ id }: AchievmentsProps) {
  const { isLoading, data: achievements, error } = useAchievements(id);

  return (
    <div className="border bg-dark-dim flex w-full">
      <div className="w-full">
        <p className="border-b text-xl p-6">Achievements</p>
        <div className="flex p-4 gap-4 overflow-auto">
          {isLoading && <Spinner />}
          {error && <Alert variant="danger" />}
          {achievements?.map((achievement) => (
            <AchievementIcon
              key={achievement.name}
              src={achievement.icon}
              obtained={achievement.obtained}
              title={achievement.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
