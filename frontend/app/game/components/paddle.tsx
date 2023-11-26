import { Box } from "./box";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Config, sendEvent, useWs } from "../repo";

type PaddleProps = {
  down?: number;
  config: Config;
};

export const Paddle = ({ down, config }: PaddleProps) => {
  const meshLeft = useRef<THREE.Mesh>(null!);

  const sizeX = config.worldWidth * config.paddleSizeX;
  const sizeY = config.worldHeight * config.paddleSizeY;
  const w2 = config.worldWidth / 2;

  const leftPaddle = useWs("MOVE_PADDLE_LEFT", {
    defaultValue: { y: 0 },
  });

  useEffect(() => {
    meshLeft.current.position.y = leftPaddle?.y || 0;
  }, [leftPaddle]);

  useFrame(() => {
    if (meshLeft.current && down) {
      sendEvent("MOVE_PADDLE_LEFT", {
        dir: down,
      });
    }
  });
  return (
    <>
      <Box
        mmaterial={{
          color: "orange",
        }}
        position={[w2 - 0.25, 0, 0]}
        scale={[sizeX, sizeY, 0.1]}
      />
      <Box
        ref={meshLeft}
        mmaterial={{
          color: "orange",
        }}
        scale={[sizeX, sizeY, 0.1]}
        position={[-w2 + 0.25, 0, 0]}
      />
    </>
  );
};
