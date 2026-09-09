"use client";
/* oxlint-disable react/react-compiler -- R3F owns a mutable Three scene. Mutations in useFrame and lifecycle effects are intentional, not React state mutations. */

import { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  studioEnvironment,
  surfaceTextures,
  fresnelAlpha,
} from "./studio-assets";
import { FocusPass } from "./focus-pass";

type Props = {
  onReady: (seek: (time: number, still?: boolean) => void) => void;
  onError: () => void;
};
const FLOOR = -1.65;
const smooth = (t: number, a: number, b: number) => {
  const p = THREE.MathUtils.clamp((t - a) / (b - a), 0, 1);
  return p * p * (3 - 2 * p);
};
const mix = THREE.MathUtils.lerp;

// Closed cross-sections give each lathed vessel a real lip, interior and base.
function vessel(points: number[][]) {
  return new THREE.LatheGeometry(
    points.map(([r, y]) => new THREE.Vector2(r, y)),
    80,
  );
}

function makeAssets(model: THREE.Group) {
  const authored = (name: string) =>
    (model.getObjectByName(name) as THREE.Mesh).geometry.clone();
  const lower = vessel([
    [0, 0],
    [0.36, 0],
    [0.4, 0.02],
    [0.422, 0.07],
    [0.428, 0.14],
    [0.568, 1.66],
    [0.568, 1.72],
    [0.559, 1.744],
    [0.541, 1.744],
    [0.53, 1.72],
    [0.535, 1.66],
    [0.51, 1.4],
    [0.453, 0.8],
    [0.405, 0.18],
    [0.39, 0.12],
    [0, 0.12],
  ]);
  const upper = vessel([
    [0, 0],
    [0.29, 0],
    [0.324, 0.025],
    [0.343, 0.08],
    [0.47, 1.31],
    [0.467, 1.34],
    [0.445, 1.34],
    [0.437, 1.3],
    [0.426, 1.12],
    [0.368, 0.64],
    [0.328, 0.25],
    [0.314, 0.1],
    [0, 0.1],
  ]);
  const glass = authored("RocksGlass");
  const peel = authored("PeelRind"),
    peelPith = authored("PeelPith"),
    peelEdge = authored("PeelEdge");
  const meniscus = vessel([
    [0.487, 0.012],
    [0.477, 0.002],
    [0.445, -0.004],
    [0.28, -0.006],
    [0, -0.006],
  ]);
  const liquidBody = new THREE.CylinderGeometry(0.487, 0.461, 1, 48, 8, false);
  // Three low-poly, hand-cut forms: a tall slab, a wide slab and a compact pebble.
  // Rounded edges and fixed corner offsets keep the silhouette away from a cube.
  const sculptedIce = (
    size: [number, number, number],
    offsets: [number, number, number][],
  ) => {
    const geometry = new RoundedBoxGeometry(...size, 3, 0.11).toNonIndexed();
    const position = geometry.getAttribute("position");
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i),
        y = position.getY(i),
        z = position.getZ(i);
      const index = (x > 0 ? 1 : 0) + (y > 0 ? 2 : 0) + (z > 0 ? 4 : 0);
      const [dx, dy, dz] = offsets[index];
      const edge = Math.min(
        1,
        Math.abs(x / size[0]) + Math.abs(y / size[1]) + Math.abs(z / size[2]),
      );
      position.setXYZ(i, x + dx * edge, y + dy * edge, z + dz * edge);
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  };
  const iceTall = sculptedIce(
    [0.56, 0.9, 0.46],
    [
      [-0.02, -0.03, -0.01],
      [0.04, -0.06, 0.01],
      [-0.06, 0.07, -0.05],
      [0.08, 0.02, 0.03],
      [-0.03, -0.02, 0.07],
      [0.05, -0.04, -0.06],
      [-0.08, 0.04, 0.06],
      [0.02, 0.09, -0.03],
    ],
  );
  const iceWide = sculptedIce(
    [0.78, 0.54, 0.62],
    [
      [-0.06, -0.02, -0.02],
      [0.03, -0.06, 0.05],
      [-0.02, 0.04, -0.07],
      [0.09, 0.07, 0.02],
      [-0.08, -0.04, 0.06],
      [0.06, 0.03, -0.05],
      [-0.04, 0.08, 0.09],
      [0.02, 0.01, -0.08],
    ],
  );
  const icePebble = sculptedIce(
    [0.5, 0.48, 0.52],
    [
      [-0.05, -0.03, 0.02],
      [0.06, -0.01, -0.04],
      [-0.01, 0.07, -0.06],
      [0.08, 0.04, 0.03],
      [-0.06, -0.06, 0.07],
      [0.03, -0.05, -0.08],
      [-0.08, 0.06, 0.04],
      [0.02, 0.09, -0.02],
    ],
  );
  const silhouette = (points: [number, number][]) => {
    const shape = new THREE.Shape();
    shape.moveTo(...points[0]);
    points.slice(1).forEach((point) => shape.lineTo(...point));
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  };
  const vocalistSilhouette = silhouette([
    [-0.15, 0],
    [0.06, 0],
    [0.15, 0.55],
    [0.12, 0.98],
    [0.27, 1.3],
    [0.2, 1.5],
    [0.24, 1.66],
    [0.15, 1.84],
    [0.02, 1.93],
    [-0.12, 1.86],
    [-0.18, 1.7],
    [-0.13, 1.52],
    [-0.25, 1.36],
    [-0.43, 1.2],
    [-0.39, 1.1],
    [-0.17, 1.16],
    [-0.08, 0.92],
    [-0.05, 0.5],
  ]);
  const guitaristSilhouette = silhouette([
    [-0.18, 0],
    [0.04, 0],
    [0.15, 0.48],
    [0.12, 0.84],
    [0.28, 1.12],
    [0.22, 1.48],
    [0.28, 1.68],
    [0.18, 1.87],
    [0.03, 1.94],
    [-0.12, 1.86],
    [-0.18, 1.68],
    [-0.1, 1.5],
    [-0.24, 1.16],
    [-0.31, 0.8],
    [-0.12, 0.48],
  ]);
  const guitarBody = new THREE.CircleGeometry(0.3, 7);
  guitarBody.rotateZ(-0.32);
  guitarBody.translate(-0.2, 0.86, 0.012);
  const guitarNeck = new THREE.PlaneGeometry(0.08, 0.82);
  guitarNeck.rotateZ(0.86);
  guitarNeck.translate(-0.5, 1.2, 0.013);
  const guitar = mergeGeometries([guitaristSilhouette, guitarBody, guitarNeck]);
  if (!guitar) throw new Error("Unable to merge the guitarist silhouette");
  const { brush, stone, pores, contact } = surfaceTextures();
  const steel = new THREE.MeshPhysicalMaterial({
    color: "#b7bab8",
    metalness: 1,
    roughness: 0.36,
    bumpMap: brush,
    bumpScale: 0.0014,
    envMapIntensity: 1.8,
  });
  const polished = new THREE.MeshStandardMaterial({
    color: "#d7d4ca",
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 1.5,
  });
  const etching = new THREE.MeshStandardMaterial({
    color: "#8b8d87",
    metalness: 0.95,
    roughness: 0.42,
  });
  // Deliberate smoked crystal, not optical simulation. The modeled wall/heel
  // supply the silhouette; edge-weighted alpha preserves a readable interior.
  const crystal = fresnelAlpha(
    new THREE.MeshPhysicalMaterial({
      color: "#61635a",
      roughness: 0.21,
      metalness: 0.12,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      clearcoat: 0.7,
      clearcoatRoughness: 0.16,
      envMapIntensity: 2.4,
    }),
    0.23,
  );
  const frozen = fresnelAlpha(
    new THREE.MeshPhysicalMaterial({
      color: "#8baeb7",
      roughness: 0.2,
      metalness: 0.22,
      transparent: true,
      opacity: 0.78,
      depthWrite: true,
      flatShading: true,
      clearcoat: 0.65,
      clearcoatRoughness: 0.13,
      envMapIntensity: 1.65,
    }),
    0.42,
  );
  const amber = new THREE.MeshPhysicalMaterial({
    color: "#bd5716",
    metalness: 0.12,
    roughness: 0.18,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    clearcoat: 0.75,
    envMapIntensity: 1.3,
  });
  const performer = new THREE.MeshStandardMaterial({
    color: "#16171a",
    roughness: 0.92,
    envMapIntensity: 0.08,
    side: THREE.DoubleSide,
  });
  const haze = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { gain: { value: 0 }, drift: { value: 0 } },
    vertexShader:
      "varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: `varying vec2 vUv;uniform float gain;void main(){
      float width=mix(.44,.12,vUv.y);
      float sway=sin(vUv.y*7.+drift)*.018;
      float beam=pow(max(0.,1.-abs(vUv.x-(.48+.16*vUv.y+sway))/width),2.);
      float edge=smoothstep(0.,.25,vUv.y)*(1.-smoothstep(.85,1.,vUv.y));
      gl_FragColor=vec4(.32,.115,.075,beam*edge*gain);
    }`,
  });
  const citrus = new THREE.MeshStandardMaterial({
    color: "#edaa26",
    roughness: 0.43,
    side: THREE.FrontSide,
  });
  const pith = new THREE.MeshStandardMaterial({
    color: "#e0cf8b",
    roughness: 0.72,
    side: THREE.DoubleSide,
  });
  return {
    lower,
    upper,
    glass,
    meniscus,
    liquidBody,
    iceTall,
    iceWide,
    icePebble,
    peel,
    peelPith,
    peelEdge,
    vocalistSilhouette,
    guitar,
    performer,
    haze,
    brush,
    stone,
    pores,
    contact,
    steel,
    polished,
    etching,
    crystal,
    frozen,
    amber,
    citrus,
    pith,
  };
}
type Assets = ReturnType<typeof makeAssets>;

function Ring({
  radius,
  y,
  material,
  tube = 0.008,
}: {
  radius: number;
  y: number;
  material: THREE.Material;
  tube?: number;
}) {
  return (
    <mesh
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, y, 0]}
      material={material}
    >
      <torusGeometry args={[radius, tube, 6, 80]} />
    </mesh>
  );
}

function Tin({ assets, upper = false }: { assets: Assets; upper?: boolean }) {
  return (
    <group>
      <mesh
        geometry={upper ? assets.upper : assets.lower}
        material={assets.steel}
        castShadow
        receiveShadow
      />
      <Ring
        radius={upper ? 0.334 : 0.422}
        y={0.072}
        material={assets.polished}
      />
      <Ring
        radius={upper ? 0.466 : 0.563}
        y={upper ? 1.325 : 1.725}
        material={assets.polished}
        tube={0.012}
      />
      {[0].map((offset) => (
        <Ring
          key={offset}
          radius={upper ? 0.37 + offset * 0.1 : 0.455 + offset * 0.1}
          y={0.42 + offset}
          material={assets.etching}
          tube={0.003}
        />
      ))}
    </group>
  );
}

function Curtains() {
  const geometry = useMemo(() => {
    const plane = new THREE.PlaneGeometry(11.8, 6, 160, 12),
      p = plane.getAttribute("position");
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        y = p.getY(i);
      p.setXYZ(
        i,
        x,
        y + Math.sin(x * 4) * 0.022,
        0.11 * Math.sin(x * 9) +
          0.037 * Math.sin(x * 18 + 0.4) +
          0.045 * Math.sin(x * 2 + y * 0.4),
      );
    }
    plane.computeVertexNormals();
    return plane;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} position={[0, 3, -1.62]} receiveShadow>
      <meshPhysicalMaterial
        color="#221619"
        roughness={0.94}
        sheen={0.65}
        sheenColor="#654343"
        sheenRoughness={0.8}
        envMapIntensity={0.2}
      />
    </mesh>
  );
}

function Stage({ assets }: { assets: Assets }) {
  // Only silhouettes carry the performance. No exposed kit hardware or grille texture.
  const hardware = { color: "#788079", metalness: 0.7, roughness: 0.35 };
  return (
    <group position={[-2.5, FLOOR - 6, -15]} scale={3.8}>
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[12, 0.2, 8]} />
        <meshStandardMaterial color="#17110f" roughness={0.82} />
      </mesh>
      <Curtains />
      <mesh position={[0.85, 1.75, -1.12]} material={assets.haze}>
        <planeGeometry args={[5, 3.5]} />
      </mesh>
      <mesh
        geometry={assets.vocalistSilhouette}
        material={assets.performer}
        position={[0.32, 0, 0.15]}
        rotation={[0, 0, -0.1]}
      />
      <mesh
        geometry={assets.guitar}
        material={assets.performer}
        position={[1.38, 0, -0.65]}
        rotation={[0, 0, 0.09]}
      />
      <group position={[0.03, 0, 0.42]}>
        <mesh position={[0, 1.14, 0]}>
          <cylinderGeometry args={[0.014, 0.02, 2.28, 10]} />
          <meshStandardMaterial {...hardware} />
        </mesh>
        <mesh position={[0, 0.025, 0]}>
          <cylinderGeometry args={[0.25, 0.28, 0.05, 20]} />
          <meshStandardMaterial color="#111312" roughness={0.7} />
        </mesh>
        <mesh position={[0.02, 2.3, 0]} rotation={[0, 0, -0.8]}>
          <capsuleGeometry args={[0.052, 0.21, 4, 12]} />
          <meshStandardMaterial {...hardware} />
        </mesh>
      </group>
      {/* A partial bass drum and one low tom imply the kit, mostly lost in shadow. */}
      <mesh position={[1.2, 0.55, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.58, 32]} />
        <meshStandardMaterial
          color="#151918"
          roughness={0.7}
          metalness={0.12}
        />
      </mesh>
      <mesh position={[1.55, 1.16, -0.35]} rotation={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.27, 0.25, 0.3, 24]} />
        <meshStandardMaterial color="#3b3026" roughness={0.72} />
      </mesh>
      <mesh position={[3.2, 1.125, -0.9]}>
        <boxGeometry args={[1, 2.25, 0.7]} />
        <meshStandardMaterial color="#101719" roughness={0.87} />
      </mesh>
      {[-2, 2].map((x) => (
        <group key={x} position={[x, 3.35, 0.2]} rotation={[0.45, 0, x * 0.13]}>
          <mesh>
            <cylinderGeometry args={[0.14, 0.16, 0.28, 16]} />
            <meshStandardMaterial
              color="#0b1011"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
          <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.12, 16]} />
            <meshBasicMaterial color={x < 0 ? "#e9b779" : "#6d8e99"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
function World({ onReady, onError }: Props) {
  const { gl, scene, camera, size, invalidate } = useThree();
  const model = useLoader(GLTFLoader, "/models/overhead/bar-assets.glb");
  const assets = useMemo(() => makeAssets(model.scene), [model.scene]);
  const lower = useRef<THREE.Group>(null!);
  const upper = useRef<THREE.Group>(null!);
  const drink = useRef<THREE.Group>(null!);
  const glassWall = useRef<THREE.Mesh>(null!);
  const liquid = useRef<THREE.Mesh>(null!);
  const surface = useRef<THREE.Mesh>(null!);
  const ice = useRef<THREE.Group>(null!);
  const garnish = useRef<THREE.Group>(null!);
  const stream = useRef<THREE.Mesh>(null!);
  const key = useRef<THREE.PointLight>(null!);
  const rim = useRef<THREE.PointLight>(null!);
  const spot = useRef<THREE.SpotLight>(null!);
  const spotTarget = useMemo(() => new THREE.Object3D(), []);
  const shakerContact = useRef<THREE.MeshBasicMaterial>(null!);
  const shakerContactPlane = useRef<THREE.Mesh>(null!);
  const stageWarm = useRef<THREE.PointLight>(null!);
  const stageCool = useRef<THREE.PointLight>(null!);
  const stageBack = useRef<THREE.SpotLight>(null!);
  const stageTarget = useMemo(() => {
    const target = new THREE.Object3D();
    target.position.set(1, -0.5, -14);
    return target;
  }, []);
  const time = useRef(0);
  const still = useRef(false);
  const focusDistance = useRef(10);
  const streamGeometry = useMemo(
    () => new THREE.CylinderGeometry(1, 1, 1, 10, 20, true),
    [],
  );
  const streamBasis = useMemo(
    () => new Float32Array(streamGeometry.getAttribute("position").array),
    [streamGeometry],
  );
  const vectors = useMemo(
    () => ({
      lip: new THREE.Vector3(),
      end: new THREE.Vector3(),
      mid: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      direction: new THREE.Vector3(),
      offset: new THREE.Vector3(),
    }),
    [],
  );

  useLayoutEffect(() => {
    const target = studioEnvironment(gl);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.65;
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [gl, scene]);

  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onError();
    };
    canvas.addEventListener("webglcontextlost", lost);
    onReady((value, staticView = false) => {
      time.current = value;
      still.current = staticView;
      invalidate();
    });
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, invalidate, onReady, onError]);

  useEffect(
    () => () => {
      Object.values(assets).forEach((asset) => asset.dispose());
      streamGeometry.dispose();
    },
    [assets, streamGeometry],
  );

  useFrame(() => {
    const t = time.current;
    const mobile = size.width < 600;
    gl.transmissionResolutionScale = mobile ? 0.35 : 0.5;
    const tiltIn = smooth(t, 1.1, 1.7),
      settle = smooth(t, 4.7, 5.2);
    const shakeEnvelope = smooth(t, 1.7, 2) * (1 - smooth(t, 4.4, 4.7));
    const rhythm = Math.sin((t - 1.7) * Math.PI * 4) * shakeEnvelope;
    const separation = smooth(t, 5.2, 6.2),
      pourSetup = smooth(t, 6.2, 7.2),
      reset = smooth(t, 10.7, 11.7);
    // Keep the served glass legible, then make one short, decisive rack to the stage.
    const focus = still.current ? 0.25 : smooth(t, 13.65, 15.35);
    const settleWeight =
      Math.sin(settle * Math.PI * 1.2) * (1 - settle) * 0.024;
    const assembledAngle =
      mix(0, mobile ? -0.43 : -0.95, tiltIn * (1 - settle)) +
      rhythm * 0.035 +
      settleWeight;
    // Rotate about the assembled shaker's centre, not its base. The lens stays still.
    const centreX = -2.1 + rhythm * 0.16;
    const centreY =
      FLOOR +
      1.415 +
      (mobile ? 0.15 : 0.35) * tiltIn * (1 - settle) +
      Math.sin((t - 1.7) * Math.PI * 4 + 0.18) * shakeEnvelope * 0.1;
    const baseX = centreX + Math.sin(assembledAngle) * 1.415;
    const baseY = centreY - Math.cos(assembledAngle) * 1.415;
    const pourAngle = -2.12;
    const angle = mix(mix(assembledAngle, pourAngle, pourSetup), 0, reset);
    // The active rim is the anchor: the stream always originates at this exact lip.
    const lipOffset = vectors.offset
      .set(0.55, 1.73, 0)
      .applyAxisAngle(vectors.up.set(0, 0, 1), angle);
    const targetX = 0.95 - lipOffset.x,
      targetY = 0.12 - lipOffset.y;
    lower.current.position.set(
      mix(mix(baseX, targetX, pourSetup), -5.4, reset),
      // Withdraw above the product frame before parking left; never cross the copy.
      mix(mix(baseY, targetY, pourSetup), FLOOR, reset) +
        Math.sin(reset * Math.PI) * 2.8,
      mix(mix(0, 0.3, pourSetup), -1.5, reset),
    );
    lower.current.rotation.set(0, 0, angle);
    const upperOffset = vectors.offset
      .set(0, 2.83, 0)
      .applyAxisAngle(vectors.up.set(0, 0, 1), assembledAngle);
    const park = smooth(t, 6.2, 7.2);
    upper.current.position.set(
      mix(baseX + upperOffset.x - separation * 0.08, -8.1, park),
      mix(
        mix(baseY + upperOffset.y + separation * 0.4, 3, park),
        FLOOR + 1.34,
        reset,
      ),
      mix(mix(-0.02, -3, park), -2, reset),
    );
    // Flip in local space, then rotate the assembled pair around the same axis.
    upper.current.rotation.set(Math.PI, 0, mix(assembledAngle, 0, park), "ZYX");
    const fill = smooth(t, 7.25, 10.6);
    const height = 0.04 + 0.86 * fill;
    drink.current.position.set(1.1, FLOOR, 0.3);
    liquid.current.scale.y = height;
    liquid.current.position.y = 0.22 + height / 2;
    // Match the authored inner wall at every fill height, including its rounded floor.
    const innerRadius = (y: number) =>
      y < 0.3
        ? mix(0.423, 0.471, smooth(y, 0.21, 0.3))
        : mix(0.471, 0.495, THREE.MathUtils.clamp((y - 0.3) / 1.015, 0, 1));
    const lp = assets.liquidBody.attributes.position;
    for (let i = 0; i < lp.count; i++) {
      const y = lp.getY(i),
        angle = Math.atan2(lp.getZ(i), lp.getX(i));
      const radius = innerRadius(0.22 + (y + 0.5) * height) - 0.003;
      if (Math.hypot(lp.getX(i), lp.getZ(i)) > 0.1)
        lp.setXYZ(i, Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    }
    lp.needsUpdate = true;
    liquid.current.visible = fill > 0.001;
    surface.current.position.y = 0.22 + height;
    const surfaceRadius = (innerRadius(0.22 + height) - 0.003) / 0.487;
    surface.current.visible = fill > 0.001;
    const ripple = Math.sin(t * 11) * 0.008 * fill * (1 - smooth(t, 10.5, 11));
    surface.current.scale.set(
      surfaceRadius * (1 + ripple),
      1,
      surfaceRadius * (1 + ripple),
    );
    ice.current.position.y = fill * 0.21;
    ice.current.rotation.y =
      Math.sin(t * 1.5) * 0.035 * fill * (1 - smooth(t, 10.5, 11));
    garnish.current.position.set(0.4, 1.16, 0.04);
    garnish.current.rotation.set(0.15, 0.25, -0.65);
    // The receiving glass is prepared from the start. Nothing materializes at serving.
    const streamAmount = smooth(t, 7.2, 7.45) * (1 - smooth(t, 10.4, 10.7));
    stream.current.visible = streamAmount > 0.001;
    lower.current.updateWorldMatrix(true, false);
    vectors.lip.set(0.55, 1.73, 0).applyMatrix4(lower.current.matrixWorld);
    vectors.end.set(1.1, FLOOR + 0.22 + height, 0.3);
    if (stream.current.visible) {
      const positions = streamGeometry.getAttribute("position");
      for (let i = 0; i < positions.count; i++) {
        const s = 0.5 - streamBasis[i * 3 + 1];
        const fall = s * 0.3 + s * s * 0.7;
        const radius =
          0.022 *
          streamAmount *
          (1 - 0.3 * s) *
          (1 + 0.035 * Math.sin(t * 5 + s * 17));
        positions.setXYZ(
          i,
          mix(vectors.lip.x, vectors.end.x, s) +
            0.06 * Math.sin(Math.PI * s) * (1 - s) +
            streamBasis[i * 3] * radius,
          mix(vectors.lip.y, vectors.end.y, fall),
          mix(vectors.lip.z, vectors.end.z, s) +
            streamBasis[i * 3 + 2] * radius,
        );
      }
      positions.needsUpdate = true;
      streamGeometry.computeVertexNormals();
    }
    key.current.intensity = mix(38, 5, focus);
    rim.current.intensity = mix(22, 3, focus);
    spot.current.intensity = mix(58, 6, focus);
    spotTarget.position.set(
      mix(-2.1, 1.1, pourSetup),
      FLOOR,
      mix(0, 0.3, pourSetup),
    );
    shakerContact.current.opacity =
      (1 - tiltIn * (1 - settle)) * (1 - pourSetup);
    shakerContactPlane.current.position.set(-2.1, FLOOR + 0.004, 0);
    assets.steel.envMapIntensity = mix(2.5, 0.7, focus);
    assets.polished.envMapIntensity = mix(1.5, 0.8, focus);
    const stagePulse = 0.94 + Math.sin(t * 1.6) * 0.06;
    stageWarm.current.intensity = mix(2, 70, focus) * stagePulse;
    stageCool.current.intensity =
      mix(2, 28, focus) * (1.03 - (stagePulse - 0.94));
    stageBack.current.intensity = mix(0.2, 180, focus) * stagePulse;
    assets.haze.uniforms.gain.value = mix(0.018, 0.12, focus);
    assets.haze.uniforms.drift.value = t * 0.18;
    const cam = camera as THREE.PerspectiveCamera;
    const followPour = smooth(t, 6.15, 7.25);
    const serving = smooth(t, 10.9, 12.1);
    const cameraFocus = still.current ? 0 : focus;
    // Three intentional framings within one physical scene, interpolated by scroll.
    cam.fov = mix(
      mix(mobile ? 36 : 34, mobile ? 42 : 40, followPour),
      34,
      serving,
    );
    cam.fov = mix(cam.fov, mobile ? 34 : 31, cameraFocus);
    cam.position.set(
      mix(
        mix(
          mix(mobile ? -2.1 : -2.95, mobile ? 0.55 : -0.6, followPour),
          mobile ? 1.1 : 0.25,
          serving,
        ),
        mobile ? -0.1 : -0.8,
        cameraFocus,
      ),
      mix(
        mix(mix(mobile ? 0.9 : 1.05, 0.65, followPour), -0.05, serving),
        0.7,
        cameraFocus,
      ),
      mix(
        mix(
          mix(mobile ? 6.3 : 6.25, mobile ? 6.5 : 5.95, followPour),
          mobile ? 4.9 : 3.95,
          serving,
        ),
        4,
        cameraFocus,
      ),
    );
    vectors.mid.set(
      mix(
        mix(
          mix(mobile ? -2.1 : -2.95, mobile ? 0.55 : -0.6, followPour),
          mobile ? 1.1 : 0.25,
          serving,
        ),
        mobile ? 0.9 : 1.6,
        cameraFocus,
      ),
      mix(
        mix(
          mix(-0.45 + 0.4 * separation, mobile ? -0.15 : 0, followPour),
          -1.1,
          serving,
        ),
        -3,
        cameraFocus,
      ),
      mix(mix(0, 0.3, followPour), -15, cameraFocus),
    );
    cam.lookAt(vectors.mid);
    if (still.current) {
      // A quiet, compact tableau retains both tins, the served glass and the room.
      lower.current.position.set(-0.7, FLOOR, -1.5);
      lower.current.rotation.set(0, 0, 0);
      upper.current.position.set(-0.7, FLOOR + 2.83, -1.5);
      upper.current.rotation.set(Math.PI, 0, 0);
      shakerContactPlane.current.position.set(-0.7, FLOOR + 0.004, -1.5);
      shakerContact.current.opacity = 1;
      cam.position.set(
        mobile ? 0.38 : -0.2,
        mobile ? 0.8 : 0.6,
        mobile ? 7.9 : 6.5,
      );
      cam.fov = mobile ? 38 : 34;
      cam.lookAt(mobile ? 0.38 : -0.7, mobile ? -0.65 : -0.5, 0);
    }
    cam.updateProjectionMatrix();
    cam.getWorldDirection(vectors.direction);
    vectors.mid.set(
      mix(mix(-2.1, 1.1, followPour), mobile ? 0.9 : 1.6, cameraFocus),
      mix(mix(0, -0.95, serving), -3, cameraFocus),
      mix(0.3, -15, cameraFocus),
    );
    focusDistance.current = vectors.mid
      .sub(cam.position)
      .dot(vectors.direction);
    // Inspectable without retaining a global renderer; useful for demand-render QA.
    gl.domElement.dataset.renderFrame = String(gl.info.render.frame);
    gl.domElement.dataset.sceneTime = t.toFixed(2);
    gl.domElement.dataset.drawCalls = String(gl.info.render.calls);
    gl.domElement.dataset.triangles = String(gl.info.render.triangles);
  });

  return (
    <>
      <color attach="background" args={["#080b0c"]} />
      <fog attach="fog" args={["#080b0c", 13, 38]} />
      <ambientLight intensity={0.025} />
      <pointLight
        ref={key}
        position={[-3, 3.5, 3]}
        color="#ffe2b5"
        intensity={28}
        distance={18}
      />
      <pointLight
        ref={rim}
        position={[4, 3, 1]}
        color="#c0d6e0"
        intensity={12}
        distance={8}
      />
      <spotLight
        ref={spot}
        target={spotTarget}
        position={[-2, 6, 3]}
        angle={0.52}
        penumbra={1}
        intensity={45}
        color="#f4debc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <primitive object={spotTarget} />
      <pointLight
        ref={stageWarm}
        position={[-4, 3.5, -12]}
        color="#e1b57d"
        intensity={1}
        distance={28}
      />
      <pointLight
        ref={stageCool}
        position={[7, 1.5, -17]}
        color="#759ea6"
        intensity={1}
        distance={24}
      />
      <Stage assets={assets} />
      <primitive object={stageTarget} />
      <spotLight
        ref={stageBack}
        target={stageTarget}
        position={[-1, 5, -19.5]}
        color="#ba7861"
        intensity={1}
        angle={0.7}
        penumbra={1}
        distance={22}
      />
      <mesh position={[0, FLOOR - 0.16, 2.9]} receiveShadow>
        <boxGeometry args={[18, 0.32, 12.2]} />
        <meshStandardMaterial
          color="#7a7365"
          map={assets.stone}
          roughness={0.47}
          metalness={0.12}
          envMapIntensity={0.3}
          bumpMap={assets.stone}
          bumpScale={0.008}
        />
      </mesh>
      <mesh
        ref={shakerContactPlane}
        position={[-2.1, FLOOR + 0.004, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial
          ref={shakerContact}
          map={assets.contact}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <group ref={lower}>
        <Tin assets={assets} />
      </group>
      <group ref={upper}>
        <Tin assets={assets} upper />
      </group>
      <group ref={drink}>
        <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshBasicMaterial
            map={assets.contact}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh
          ref={glassWall}
          renderOrder={4}
          geometry={assets.glass}
          material={assets.crystal}
          receiveShadow
        />
        <mesh
          ref={liquid}
          renderOrder={1}
          material={assets.amber}
          geometry={assets.liquidBody}
        />
        <mesh ref={surface} geometry={assets.meniscus} renderOrder={2}>
          <meshPhysicalMaterial
            color="#e5a04d"
            roughness={0.16}
            metalness={0.12}
            transparent
            opacity={0.65}
            depthWrite={false}
            clearcoat={1}
            envMapIntensity={3}
          />
        </mesh>
        <group ref={ice}>
          <mesh
            geometry={assets.iceTall}
            material={assets.frozen}
            position={[-0.14, 0.66, 0.04]}
            rotation={[0.17, 0.5, -0.24]}
            renderOrder={3}
          />
          <mesh
            geometry={assets.iceWide}
            material={assets.frozen}
            position={[0.11, 0.98, -0.09]}
            rotation={[-0.17, -0.34, 0.18]}
            renderOrder={3}
          />
          <mesh
            geometry={assets.icePebble}
            material={assets.frozen}
            position={[0.22, 0.48, 0.17]}
            rotation={[0.28, -0.6, 0.36]}
            renderOrder={3}
          />
        </group>
        <group ref={garnish}>
          <mesh geometry={assets.peel} material={assets.citrus} castShadow />
          <mesh geometry={assets.peelPith} material={assets.pith} />
          <mesh geometry={assets.peelEdge} material={assets.pith} />
        </group>
      </group>
      <mesh ref={stream} geometry={streamGeometry} frustumCulled={false}>
        <meshPhysicalMaterial
          color="#d38632"
          roughness={0.17}
          transparent
          opacity={0.86}
          metalness={0}
          envMapIntensity={1.8}
          clearcoat={1}
          depthWrite
        />
      </mesh>
      <FocusPass distance={focusDistance} glass={drink} />
    </>
  );
}

const BarCanvas = memo(function BarCanvas(props: Props) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      shadows={{ type: THREE.PCFShadowMap }}
      camera={{ position: [0, 2.1, 10], fov: 34, near: 0.1, far: 45 }}
      gl={{ antialias: true, alpha: false, powerPreference: "low-power" }}
      fallback={null}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.transmissionResolutionScale = 0.5;
      }}
    >
      <World {...props} />
    </Canvas>
  );
});
export default BarCanvas;
