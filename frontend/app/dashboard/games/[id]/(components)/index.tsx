"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { KeyRecorder } from "./recorder";
import { sendEvent, useConfig, useWs } from "../../repo";
import { Plane } from "./plane";
import { Whisle } from "./whisle";
import { GameOver } from "./over";
import { TextureLoader } from "three";
import { OrbitControls } from "@react-three/drei";
import { useSWRConfig } from "swr";
import { socket } from "../../socket";
import { Scoreboard } from "@/types/game/scoreboard";
import { Camera } from "./camera";
import { useThemeStore } from "@/app/store/theme";

interface GameProps {
  status: "READY" | "FINISHED";
  id: string;
}

export function Game({ status, id }: GameProps) {
  const [down, setDown] = useState(0);
  const started = useRef(false);
  const isFinished = status === "FINISHED";
  const { mutate } = useSWRConfig();

  const { data: config, isLoading, error } = useConfig();
  const [color] = useThemeStore((state) => [state.theme.pitch]);

  useEffect(() => {
    if (isFinished) return;
    socket.on("SCOREBOARD", (data: Scoreboard) => {
      mutate(["scoreboard", id], data);
    });

    return () => {
      socket.off("SCOREBOARD");
    };
  }, [id, isFinished, mutate]);

  const round = useWs("ANNOUNCE", {
    defaultValue: {
      count: "",
    },
  });

  useEffect(() => {
    if (isFinished || started.current) return;
    started.current = true;
    sendEvent("START_GAME", {});
  }, [isFinished]);

  useEffect(() => {
    if (isFinished) return;
    const whistle = document.getElementById("game-crowd") as HTMLAudioElement;
    whistle.oncanplay = () => whistle.play();
  }, [isFinished]);

  useEffect(() => {
    if (round.count === "GO") {
      const whistle = document.getElementById(
        "game-whistle",
      ) as HTMLAudioElement;
      whistle.oncanplay = () => whistle.play();
    }
  }, [round.count]);

  const colorMap = useLoader(TextureLoader, `/pitch-${color}.png`);
  if (isLoading || !config) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  return (
    <KeyRecorder
      aspectRatio={config.aspect}
      className="bg-black relative"
      handleKeyUp={(code) => {
        if (code == "ArrowDown" || code == "ArrowUp") {
          setDown(0);
        }
      }}
      handleKeyDown={(code) => {
        switch (code) {
          case "ArrowDown":
            setDown(2);
            break;
          case "ArrowUp":
            setDown(1);
            break;
          case "KeyD":
            sendEvent("DEBUG", {});
            break;
        }
      }}
    >
      <div className="w-full pointer-events-none h-[inherit] absolute font-bold z-10">
        <div className="text-8xl h-[inherit] flex items-center justify-center">
          <div>
            {round.count !== "" &&
              ["1", "2", "3"].includes(round.count) &&
              round.count}
            {round.count === "GO" && <Whisle />}
            {round.count === "FINISHED" && <GameOver />}
          </div>
        </div>
        {isFinished && (
          <div className="h-[inherit] absolute top-0 flex items-center justify-center w-full bg-slate-900/60">
            <h2 className="text-4xl sm:text-8xl">GameOver</h2>
            <p></p>
          </div>
        )}
      </div>

      <Canvas
        camera={{
          fov: config.fov,
          near: config.near,
        }}
      >
        <Camera config={config} isFinished={isFinished} />
        <ambientLight />
        <spotLight intensity={1} color="#fff" position={[0, 0, 3]} />

        <Paddle down={down} config={config} />
        <Ball config={config} />

        <Plane
          mmap={colorMap}
          position={[0, 0, -1]}
          scale={[config.worldWidth + 1, config.worldHeight + 0.9, 1]}
        />
        {isFinished && <OrbitControls makeDefault autoRotate />}
      </Canvas>
    </KeyRecorder>
  );
}
