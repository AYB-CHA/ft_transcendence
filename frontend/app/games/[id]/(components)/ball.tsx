import {
  MeshStandardMaterialProps,
  ThreeElements,
  useFrame,
} from "@react-three/fiber";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { Config, useWs } from "../repo";
import { Sphere } from "./sphere";
import TWEEN, { Tween } from "@tweenjs/tween.js";

type BallProps = ThreeElements["mesh"] & {
  mmaterial?: MeshStandardMaterialProps;
  config: Config;
};

export function BallAnimation({ config, ball }: any) {
  const [position, setPosition] = useState<Vector3>(new Vector3(0, 0, 0));
  const tween = useRef<Tween<any> | null>(null);
  useEffect(() => {
    if (!ball || ball.dis === 0) return;
    console.log("BALL", ball);
    tween.current = new TWEEN.Tween(ball.pos)
      .to(ball.to, ball.time * 1000)
      .onUpdate((c: Vector3) => {
        setPosition(c.clone());
      })
      .start();
  }, [ball]);

  useFrame(() => {
    if (!tween.current) return;
    tween.current.update();
  });
  return <Sphere name={"BALL"} size={config.ballSize} position={position} />;
}

export function Ball({ config }: BallProps) {
  const ball = useWs("MOVE_BALL", {
    defaultValue: {
      pos: new Vector3(0, 0, 0),
      to: new Vector3(0, 0, 0),
      time: 0,
      dis: 0,
    },
    transform: (data) => ({
      pos: new Vector3(data.pos[0], data.pos[1], data.pos[2]),
      to: new Vector3(data.to[0], data.to[1], data.to[2]),
      time: data.time,
      dis: data.dis,
    }),
  });

  console.log("BALL", ball);

  return (
    <>
      <BallAnimation config={config} ball={ball} />
    </>
  );
}

Ball.displayName = "Ball";
