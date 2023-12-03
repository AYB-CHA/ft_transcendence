import { useThree } from "@react-three/fiber";

export function Floor() {
  const { viewport } = useThree();
  console.log(viewport);
  return null;
}
