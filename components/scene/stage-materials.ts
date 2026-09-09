import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Small, deterministic material maps. No external asset requests or frame-time work.
export function stageMaterials() {
  let seed = 7123;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const canvas = (size: number) => {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    return c;
  };
  const headCanvas = canvas(256),
    h = headCanvas.getContext('2d')!;
  const shade = h.createRadialGradient(119, 113, 12, 128, 128, 127);
  shade.addColorStop(0, '#9c9b92');
  shade.addColorStop(0.72, '#aaa99f');
  shade.addColorStop(0.94, '#777970');
  shade.addColorStop(1, '#373e3a');
  h.fillStyle = shade;
  h.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 10000; i++) {
    h.fillStyle = random() > 0.5 ? '#ffffff0a' : '#0000000a';
    h.fillRect(random() * 256, random() * 256, 1, 1);
  }
  h.strokeStyle = '#484c4540';
  h.lineWidth = 1;
  h.beginPath();
  h.arc(128, 128, 117, 0, Math.PI * 2);
  h.stroke();
  const headMap = new THREE.CanvasTexture(headCanvas);
  headMap.colorSpace = THREE.SRGBColorSpace;
  const bronzeCanvas = canvas(256),
    b = bronzeCanvas.getContext('2d')!;
  b.fillStyle = '#c8c8c8';
  b.fillRect(0, 0, 256, 256);
  // Lathe UVs: horizontal lines follow the cymbal's circular machining marks.
  for (let y = 0; y < 256; y++) {
    const v = 165 + Math.floor(random() * 55);
    b.fillStyle = `rgb(${v},${v},${v})`;
    b.fillRect(0, y, 256, 1);
  }
  const bronzeMap = new THREE.CanvasTexture(bronzeCanvas);
  const grilleCanvas = canvas(128),
    g = grilleCanvas.getContext('2d')!;
  g.fillStyle = '#222725';
  g.fillRect(0, 0, 128, 128);
  for (let y = 0; y < 128; y += 5)
    for (let x = 0; x < 128; x += 5) {
      g.fillStyle = '#0d1211';
      g.beginPath();
      g.arc(x + (y % 10 ? 2 : 0), y, 1.5, 0, Math.PI * 2);
      g.fill();
    }
  const grilleMap = new THREE.CanvasTexture(grilleCanvas);
  grilleMap.colorSpace = THREE.SRGBColorSpace;
  const head = new THREE.MeshStandardMaterial({
    map: headMap,
    roughness: 0.74,
    metalness: 0,
  });
  const shell = new THREE.MeshPhysicalMaterial({
    color: '#371b12',
    roughness: 0.28,
    metalness: 0,
    clearcoat: 0.65,
    clearcoatRoughness: 0.22,
  });
  const bronze = new THREE.MeshPhysicalMaterial({
    color: '#9a7944',
    metalness: 1,
    roughness: 0.44,
    roughnessMap: bronzeMap,
    bumpMap: bronzeMap,
    bumpScale: 0.001,
    side: THREE.DoubleSide,
    envMapIntensity: 1.7,
  });
  const grille = new THREE.MeshStandardMaterial({
    map: grilleMap,
    roughness: 0.85,
    metalness: 0.3,
  });
  const cymbal = new THREE.LatheGeometry(
    [
      [0.46, 0],
      [0.455, 0.002],
      [0.32, 0.01],
      [0.17, 0.026],
      [0.12, 0.053],
      [0.085, 0.09],
      [0.035, 0.098],
      [0, 0.098],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
    64,
  );
  const cabinet = new RoundedBoxGeometry(0.52, 0.75, 0.45, 2, 0.025);
  return {
    headMap,
    bronzeMap,
    grilleMap,
    head,
    shell,
    bronze,
    grille,
    cymbal,
    cabinet,
  };
}
export type StageMaterials = ReturnType<typeof stageMaterials>;
