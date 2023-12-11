import { MeshStandardMaterialProps, ThreeElements } from "@react-three/fiber";
import React from "react";
type PlaneProps = ThreeElements["mesh"] & {
  mmaterial?: MeshStandardMaterialProps;
  mmap: any;
};

export const Plane = React.forwardRef<THREE.Mesh, PlaneProps>(
  ({ mmaterial, mmap, ...meshProps }, ref) => (
    <mesh {...meshProps} ref={ref}>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial {...mmaterial} map={mmap} />
    </mesh>
  ),
);

Plane.displayName = "Plane";
