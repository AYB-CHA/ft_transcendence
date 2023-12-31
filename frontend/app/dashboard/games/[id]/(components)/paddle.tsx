import { Box } from "./box";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { sendEvent, useWs } from "../../repo";
import { useThemeStore } from "@/app/store/theme";
import { Config } from "@/types/game/config";

type PaddleProps = {
  down?: number;
  config: Config;
};

export const Paddle = ({ down, config }: PaddleProps) => {
  const meshLeft = useRef<THREE.Mesh>(null!);
  const meshRight = useRef<THREE.Mesh>(null!);

  const [color] = useThemeStore((state) => [state.theme.paddle]);

  const sizeX = config.worldWidth * config.paddleSizeX;
  const sizeY = config.worldHeight * config.paddleSizeY;
  const w2 = config.worldWidth / 2;

  const leftPaddle = useWs("MOVE_PADDLE_INITIATOR", {
    defaultValue: { y: 0 },
  });

  const rightPaddle = useWs("MOVE_PADDLE_PARTICIPANT", {
    defaultValue: { y: 0 },
  });

  useEffect(() => {
    meshLeft.current.position.y = leftPaddle?.y || 0;
  }, [leftPaddle]);

  useEffect(() => {
    meshRight.current.position.y = rightPaddle?.y || 0;
  }, [rightPaddle]);

  useFrame(() => {
    if (meshLeft.current && down) {
      sendEvent("MOVE_PADDLE", {
        dir: down,
      });
    }
  });
  return (
    <>
      <Box
        ref={meshRight}
        mmaterial={{
          color: color,
        }}
        position={[w2 - 0.25, 0, 0]}
        scale={[sizeX, sizeY, 0.1]}
      />
      <Box
        ref={meshLeft}
        mmaterial={{
          color: color,
        }}
        scale={[sizeX, sizeY, 0.1]}
        position={[-w2 + 0.25, 0, 0]}
      />
    </>
  );
};
