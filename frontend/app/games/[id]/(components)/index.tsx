"use client";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Ball } from "./ball";
import { Paddle } from "./paddle";
import { KeyRecorder } from "./recorder";
import { useWidth } from "@/hooks/width";
import { sendEvent, useConfig, useWs } from "../repo";
import { Plane } from "./plane";

export function Game() {
  const [down, setDown] = useState(0);
  const started = useRef(false);
  const width = useWidth();

  const { data: config, isLoading, error } = useConfig();

  const scoreboard = useWs("SCOREBOARD", {
    defaultValue: {
      left: 0,
      right: 0,
    },
  });
  const round = useWs("START_ROUND", {
    defaultValue: {
      count: -1,
    },
  });

  /* useEffect(() => {
    let interval: NodeJS.Timeout;
    socket.on("startRound", () => {
      setCount(0);
      interval = setInterval(() => {
        if (count === 4) {
          clearInterval(interval);
          return;
        }
        setCount(count + 1);
      }, 1000);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      clearInterval(interval);
    };
  }, []); */

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    sendEvent("START_GAME", {});
  }, []);

  if (isLoading || !config) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }

  return (
    <KeyRecorder
      style={{
        width: width,
        height: width * config.aspect,
      }}
      className="bg-black"
      handleKeyUp={(code) => {
        if (code == "ArrowDown" || code == "ArrowUp") {
          setDown(0);
        }
      }}
      handleKeyDown={(code) => {
        if (code == "ArrowDown") {
          setDown(2);
        }
        if (code == "ArrowUp") {
          setDown(1);
        }
        if (code == "KeyD") {
          sendEvent("DEBUG", {});
        }
      }}
    >
      <div className="w-full absolute font-bold z-10">
        <div className="flex justify-center">
          <span className="bg-white px-5">{scoreboard.left}</span>
          <span className="bg-black">-</span>
          <span className="bg-white px-5">{scoreboard.right}</span>
        </div>
        <div className="text-8xl flex items-center justify-center">
          {round.count}
        </div>
      </div>

      <Canvas
        camera={{
          fov: config.fov,
          near: config.near,
          position: config.cameraPosition,
        }}
      >
        <ambientLight />
        <pointLight
          intensity={1}
          color="#fff"
          position={config.cameraPosition}
        />

        <Paddle down={down} config={config} />
        <Ball config={config} />

        <Plane
          mmaterial={{
            color: "green",
          }}
          position={[0, 0, -1]}
          scale={[config.worldWidth + 2, config.worldHeight + 2, 1]}
        />
      </Canvas>
    </KeyRecorder>
  );
}
