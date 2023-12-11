import { MeshStandardMaterialProps, ThreeElements } from "@react-three/fiber";
import React from "react";
type SphereProps = ThreeElements["mesh"] & {
  mmaterial?: MeshStandardMaterialProps;
  size?: number;
};

export const Sphere = React.forwardRef<THREE.Mesh, SphereProps>(
  ({ mmaterial, size, ...meshProps }, ref) => (
    <mesh {...meshProps} ref={ref}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial {...mmaterial} />
    </mesh>
  ),
);

Sphere.displayName = "Sphere";
