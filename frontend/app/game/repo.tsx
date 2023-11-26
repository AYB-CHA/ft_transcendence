import { useEffect, useRef, useState } from "react";
import { EMITED_MESSAGES_VALUES, SEND_MESSAGE_VALUES } from "@/types/game/ws";
import { socket } from "./socket";
import useSwr from "swr";
import APIClient from "@/lib/axios";

export interface Config {
  width: number;
  height: number;
  fov: number;
  near: number;
  cameraPosition: [number, number, number];
  aspect: number;
  worldHeight: number;
  worldWidth: number;
  paddleSizeX: number;
  paddleSizeY: number;
  ballSize: number;
}

export async function configGet() {
  return await APIClient.get("game/config").then<Config>((res) => res.data);
}

export function useConfig() {
  return useSwr("game/config", configGet, {});
}

export function sendEvent<T>(event: SEND_MESSAGE_VALUES, data: T) {
  socket.emit(event, data);
}

type UseWsOpts<T> = {
  defaultValue: T;
  transform?: (data: any) => T;
};

export function useWs<T>(
  event: EMITED_MESSAGES_VALUES,
  { defaultValue, transform = (data: T) => data }: UseWsOpts<T>,
) {
  const [data, setData] = useState<T>(defaultValue);
  const first = useRef(true);
  useEffect(() => {
    if (!first) return;
    console.log("subscribing to: ", event);
    first.current = false;
    socket.on(event, (data: T) => {
      setData(transform(data));
    });
  }, [event, transform]);
  return data;
}
