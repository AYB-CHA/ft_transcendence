import { MeshStandardMaterialProps, ThreeElements } from "@react-three/fiber";
import React from "react";
type BoxProps = ThreeElements["mesh"] & {
  mmaterial?: MeshStandardMaterialProps;
  down?: number;
};

export const Box = React.forwardRef<THREE.Mesh, BoxProps>(
  ({ mmaterial, ...meshProps }, ref) => (
    <mesh {...meshProps} ref={ref}>
      <boxGeometry args={[1, 1, 2.5]} />
      <meshStandardMaterial {...mmaterial} />
    </mesh>
  ),
);

Box.displayName = "Box";
