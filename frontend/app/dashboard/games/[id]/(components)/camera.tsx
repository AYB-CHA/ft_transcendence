import { Config } from "@/types/game/config";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

interface CameraProps {
  config: Config;
  isFinished: boolean;
}

export function Camera({ config, isFinished }: CameraProps) {
  const { camera } = useThree();
  useEffect(() => {
    if (isFinished) {
      camera.position.set(0, -30, 2);
      camera.lookAt(0, 0, 0);
      camera.up.set(0, 0, 1);
    } else {
      camera.position.set(...config.cameraPosition);
    }
    camera.updateProjectionMatrix();
  }, [isFinished, camera, config]);
  return null;
}
