import { MeshStandardMaterialProps, ThreeElements } from "@react-three/fiber";
import React from "react";
type PlaneProps = ThreeElements["mesh"] & {
  mmaterial?: MeshStandardMaterialProps;
};

export const Plane = React.forwardRef<THREE.Mesh, PlaneProps>(
  ({ mmaterial, ...meshProps }, ref) => (
    <mesh {...meshProps} ref={ref}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial {...mmaterial} />
    </mesh>
  ),
);

Plane.displayName = "Plane";
