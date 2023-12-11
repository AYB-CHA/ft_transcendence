import { useEffect, useRef, useState } from "react";
import { EMITED_MESSAGES_VALUES, SEND_MESSAGE_VALUES } from "@/types/game/ws";
import { Game } from "@/types/game/game";
import useSwr from "swr";
import APIClient from "@/lib/axios";
import { socket } from "./socket";
import { Config } from "@/types/game/config";
import { User } from "@/types/user";

export async function configGet() {
  return await APIClient.get("games/config").then<Config>((res) => res.data);
}

export async function my_games(keys: [string, string]) {
  console.log(keys);
  return APIClient.get<Game[]>(`/games/user/${keys[1]}`).then(
    (res) => res.data,
  );
}

export function useUser(id: string){
  return useSwr(["/user", id], () => APIClient.get<User>(`/user/${id}`).then(res => res.data))
}

export function useConfig() {
  return useSwr("game/config", configGet, {});
}

export function useGames(id: string | undefined) {
  return useSwr(["/games", id], id ? my_games : null, {});
}

export function useLeaderboard() {
  return useSwr("games/users/leaderboard", () =>
    APIClient.get<User[]>("/games/users/leaderboard").then((res) => res.data),
  );
}

export function useGame(id: string) {
  return useSwr(["match", id], () =>
    APIClient.get<Game>(`/games/${id}`).then((res) => res.data),
  );
}

export function sendEvent<T>(event: SEND_MESSAGE_VALUES, data: T) {
  socket.emit(event, data);
}

type UseWsOpts<T> = {
  defaultValue: T;
  transform?: (data: any) => T;
};

export function useWs<T>(event: EMITED_MESSAGES_VALUES, opts: UseWsOpts<T>) {
  const [data, setData] = useState<T>(opts.defaultValue);
  const first = useRef(true);
  useEffect(() => {
    if (!first) return;
    first.current = false;
    socket.on(event, (data: T) => {
      if (!opts.transform) return setData(data);
      setData(opts.transform(data));
    });
    return () => {
      socket.off(event);
    };
  }, [event, opts]);
  return data;
}
