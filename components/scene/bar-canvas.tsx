'use client';
/* oxlint-disable react/react-compiler -- R3F owns a mutable Three scene. Mutations in useFrame and lifecycle effects are intentional, not React state mutations. */

import { memo, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { studioEnvironment, surfaceTextures } from './studio-assets';
import { cocktailRegistration } from './hybrid-assets';
import type { RefObject } from 'react';

type Props = {
  onReady: (seek: (time: number, still?: boolean) => void) => void;
  onError: () => void;
  composite: RefObject<HTMLDivElement | null>;
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

function makeAssets() {
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
  const { brush, stone, contact } = surfaceTextures();
  const steel = new THREE.MeshPhysicalMaterial({
    color: '#b7bab8',
    metalness: 1,
    roughness: 0.36,
    bumpMap: brush,
    bumpScale: 0.0014,
    envMapIntensity: 1.8,
  });
  const polished = new THREE.MeshStandardMaterial({
    color: '#d7d4ca',
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 1.5,
  });
  const etching = new THREE.MeshStandardMaterial({
    color: '#8b8d87',
    metalness: 0.95,
    roughness: 0.42,
  });
  return { lower, upper, brush, stone, contact, steel, polished, etching };
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

function World({ onReady, onError, composite }: Props) {
  const { gl, scene, camera, size, invalidate } = useThree();
  const assets = useMemo(makeAssets, []);
  const lower = useRef<THREE.Group>(null!);
  const upper = useRef<THREE.Group>(null!);
  const drink = useRef<THREE.Group>(null!);
  const stream = useRef<THREE.Mesh>(null!);
  const key = useRef<THREE.PointLight>(null!);
  const rim = useRef<THREE.PointLight>(null!);
  const spot = useRef<THREE.SpotLight>(null!);
  const spotTarget = useMemo(() => new THREE.Object3D(), []);
  const shakerContact = useRef<THREE.MeshBasicMaterial>(null!);
  const shakerContactPlane = useRef<THREE.Mesh>(null!);
  const time = useRef(0);
  const still = useRef(false);
  const focusDistance = useRef(10);
  const streamGeometry = useMemo(
    () => new THREE.CylinderGeometry(1, 1, 1, 10, 20, true),
    [],
  );
  const streamBasis = useMemo(
    () => new Float32Array(streamGeometry.getAttribute('position').array),
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
    canvas.addEventListener('webglcontextlost', lost);
    onReady((value, staticView = false) => {
      time.current = value;
      still.current = staticView;
      invalidate();
    });
    return () => canvas.removeEventListener('webglcontextlost', lost);
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
    upper.current.rotation.set(Math.PI, 0, mix(assembledAngle, 0, park), 'ZYX');
    const fill = smooth(t, 7.25, 10.6);
    const height = 0.04 + 0.86 * fill;
    drink.current.position.set(1.1, FLOOR, 0.3);
    // The receiving glass is prepared from the start. Nothing materializes at serving.
    const streamAmount = smooth(t, 7.2, 7.45) * (1 - smooth(t, 10.4, 10.7));
    stream.current.visible = streamAmount > 0.001;
    lower.current.updateWorldMatrix(true, false);
    vectors.lip.set(0.55, 1.73, 0).applyMatrix4(lower.current.matrixWorld);
    vectors.end.set(1.1, FLOOR + 0.22 + height, 0.3);
    if (stream.current.visible) {
      const positions = streamGeometry.getAttribute('position');
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
    // Same camera and world anchor as the removed glass. No second motion clock.
    const layer = composite.current;
    if (layer) {
      camera.updateMatrixWorld();
      vectors.mid.set(1.1, FLOOR, 0.3).project(camera);
      const baseX = (vectors.mid.x * 0.5 + 0.5) * size.width;
      const baseY = (-vectors.mid.y * 0.5 + 0.5) * size.height;
      vectors.offset.set(1.1, FLOOR + 1.354, 0.3).project(camera);
      const rimY = (-vectors.offset.y * 0.5 + 0.5) * size.height;
      // Register both approved plates to the same unchanged world-space glass.
      const plateHeight = Math.max(
        1,
        (baseY - rimY) / (cocktailRegistration.base - cocktailRegistration.rim),
      );
      const plateWidth = plateHeight * cocktailRegistration.aspect;
      const takeover = smooth(t, 9.9, 10.7);
      vectors.end.project(camera);
      const surfaceY = (-vectors.end.y * 0.5 + 0.5) * size.height;
      const crop = THREE.MathUtils.clamp(
        ((surfaceY - (baseY - plateHeight * cocktailRegistration.base)) /
          plateHeight) *
          100,
        0,
        100,
      );
      const stageFocus = still.current ? 0.4 : smooth(focus, 0, 0.58);
      const drinkFocus = still.current ? 0 : smooth(focus, 0.25, 1);
      layer.style.setProperty('--plate-x', `${baseX - plateWidth * 0.5}px`);
      layer.style.setProperty(
        '--plate-y',
        `${baseY - plateHeight * cocktailRegistration.base}px`,
      );
      layer.style.setProperty('--plate-width', `${plateWidth}px`);
      layer.style.setProperty('--plate-height', `${plateHeight}px`);
      layer.style.setProperty('--fill-clip', `${mix(crop, 0, takeover)}%`);
      layer.style.setProperty('--prepared-opacity', String(1 - takeover));
      layer.style.setProperty(
        '--served-opacity',
        String(smooth(fill, 0, 0.08)),
      );
      layer.style.setProperty(
        '--drink-blur',
        `${drinkFocus * (mobile ? 3 : 6)}px`,
      );
      layer.style.setProperty(
        '--drink-contrast',
        String(mix(1.04, 0.8, drinkFocus)),
      );
      layer.style.setProperty(
        '--stage-blur',
        `${(1 - stageFocus) * (mobile ? 4 : 8)}px`,
      );
      layer.style.setProperty(
        '--stage-brightness',
        String(mix(0.28, 0.95, stageFocus)),
      );
      layer.style.setProperty(
        '--stage-scale',
        String(mix(1.08, 1.02, cameraFocus)),
      );
      layer.style.setProperty('--stage-y', `${mix(-2, 0, cameraFocus)}%`);
      layer.dataset.projected = 'true';
      layer.dataset.fill = fill.toFixed(4);
      layer.dataset.takeover = takeover.toFixed(4);
      layer.dataset.focus = focus.toFixed(4);
      layer.dataset.surfaceY = surfaceY.toFixed(2);
      layer.dataset.rimY = rimY.toFixed(2);
    }
    // Inspectable without retaining a global renderer; useful for demand-render QA.
    gl.domElement.dataset.renderFrame = String(gl.info.render.frame);
    gl.domElement.dataset.sceneTime = t.toFixed(2);
    gl.domElement.dataset.drawCalls = String(gl.info.render.calls);
    gl.domElement.dataset.triangles = String(gl.info.render.triangles);
  });

  // One ordinary scene render; no postprocessing or hidden extra scene passes.
  useFrame(() => {
    gl.render(scene, camera);
    gl.domElement.dataset.renderFrame = String(gl.info.render.frame);
    gl.domElement.dataset.drawCalls = String(gl.info.render.calls);
    gl.domElement.dataset.triangles = String(gl.info.render.triangles);
  }, 1);

  return (
    <>
      <fog attach="fog" args={['#080b0c', 13, 38]} />
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
      <group ref={drink} />
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
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      fallback={null}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <World {...props} />
    </Canvas>
  );
});
export default BarCanvas;
