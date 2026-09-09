'use client';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { StageMaterials } from './stage-materials';

// Static hardware is baked into one draw, rather than one mesh per lug or stand.
function hardware() {
  const parts: THREE.BufferGeometry[] = [];
  const direction = new THREE.Vector3(),
    mid = new THREE.Vector3(),
    up = new THREE.Vector3(0, 1, 0);
  const rotation = new THREE.Quaternion(),
    matrix = new THREE.Matrix4();
  const tube = (a: number[], b: number[], radius = 0.012) => {
    const start = new THREE.Vector3(...a),
      end = new THREE.Vector3(...b);
    direction.copy(end).sub(start);
    mid.copy(start).add(end).multiplyScalar(0.5);
    rotation.setFromUnitVectors(up, direction.clone().normalize());
    matrix.compose(mid, rotation, new THREE.Vector3(1, 1, 1));
    parts.push(
      new THREE.CylinderGeometry(
        radius,
        radius,
        direction.length(),
        8,
      ).applyMatrix4(matrix),
    );
  };
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5,
      x = 1.2 + Math.cos(a) * 0.535,
      y = 0.55 + Math.sin(a) * 0.535;
    tube([x, y, -0.38], [x, y, 0.05], 0.016);
  }
  tube([1.2, 0.2, -0.2], [1.2, 1.23, -0.2], 0.017);
  tube([0.79, 1.12, -0.2], [1.61, 1.12, -0.2], 0.018);
  for (const x of [0.73, 1.67])
    tube([x, 0.35, -0.08], [x + (x < 1 ? -0.12 : 0.12), 0.02, 0.25], 0.018);
  for (const [x, y, z] of [
    [0.23, 0.89, 0.3],
    [2.03, 0.7, -0.45],
  ]) {
    tube([x, 0.04, z], [x, y, z], 0.015);
    for (let i = 0; i < 3; i++) {
      const a = i * 2.094;
      tube(
        [x, 0.29, z],
        [x + Math.cos(a) * 0.25, 0.025, z + Math.sin(a) * 0.25],
        0.011,
      );
    }
  }
  for (const x of [-0.05, 2.2]) {
    const z = x < 1 ? -0.4 : -0.05;
    for (let i = 0; i < 3; i++) {
      const a = i * 2.094;
      tube(
        [x, 0.22, z],
        [x + Math.cos(a) * 0.29, 0.015, z + Math.sin(a) * 0.29],
        0.012,
      );
    }
  }
  tube([1.2, 0, -0.95], [1.2, 0.56, -0.95], 0.025);
  const geometry = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  return geometry;
}

export function StageDetails({ materials }: { materials: StageMaterials }) {
  const geometry = useMemo(() => hardware(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <group>
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color="#9c9f9b"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
      <mesh
        position={[1.2, 0.006, -0.25]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[3.4, 2.5]} />
        <meshStandardMaterial color="#291915" roughness={1} />
      </mesh>
      <mesh position={[1.2, 0.58, -0.95]}>
        <cylinderGeometry args={[0.24, 0.24, 0.1, 24]} />
        <meshStandardMaterial color="#111110" roughness={0.9} />
      </mesh>
      {[
        [0.23, 0.92, 0.3, 0.25, 0.14],
        [2.03, 0.82, -0.45, 0.32, 0.42],
      ].map(([x, y, z, r, h]) => (
        <group key={x} position={[x, y, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[r, r, h, 32]} />
            <meshStandardMaterial
              color={x < 1 ? '#8a8b81' : '#48261b'}
              metalness={x < 1 ? 0.75 : 0.25}
              roughness={0.33}
            />
          </mesh>
          <mesh
            position={[0, h / 2 + 0.002, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={materials.head}
          >
            <circleGeometry args={[r - 0.018, 32]} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[0, (side * h) / 2, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <torusGeometry args={[r, 0.009, 6, 32]} />
              <meshStandardMaterial
                color="#9c9f9b"
                metalness={0.9}
                roughness={0.25}
              />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 3.91, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 8.4, 12]} />
        <meshStandardMaterial
          color="#101112"
          roughness={0.65}
          metalness={0.5}
        />
      </mesh>
      {[-2, 2].map((x) => (
        <mesh key={x} position={[x, 3.63, 0.2]}>
          <cylinderGeometry args={[0.009, 0.009, 0.55, 6]} />
          <meshStandardMaterial color="#141416" />
        </mesh>
      ))}
      {[-5.3, 5.3].map((x) => (
        <mesh key={x} position={[x, 2, 0]} receiveShadow>
          <boxGeometry args={[0.6, 4.5, 3.2]} />
          <meshStandardMaterial color="#171512" roughness={0.87} />
        </mesh>
      ))}
      <mesh position={[0, -0.06, 1.94]}>
        <boxGeometry args={[10.6, 0.12, 0.07]} />
        <meshStandardMaterial color="#493327" roughness={0.55} />
      </mesh>
    </group>
  );
}
