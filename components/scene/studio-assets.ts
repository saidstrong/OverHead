import * as THREE from 'three';

// Reflection cards, not visible emissive objects in the bar. Generated once.
export function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const room = new THREE.Scene();
  room.background = new THREE.Color('#030405');
  const diffusionCanvas = document.createElement('canvas');
  diffusionCanvas.width = 128;
  diffusionCanvas.height = 256;
  const ctx = diffusionCanvas.getContext('2d')!;
  const gradient = ctx.createLinearGradient(0, 0, 128, 0);
  gradient.addColorStop(0, '#000');
  gradient.addColorStop(0.25, '#bbb');
  gradient.addColorStop(0.5, '#fff');
  gradient.addColorStop(0.75, '#bbb');
  gradient.addColorStop(1, '#000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 256);
  ctx.globalCompositeOperation = 'multiply';
  const ends = ctx.createLinearGradient(0, 0, 0, 256);
  ends.addColorStop(0, '#000');
  ends.addColorStop(0.18, '#fff');
  ends.addColorStop(0.82, '#fff');
  ends.addColorStop(1, '#000');
  ctx.fillStyle = ends;
  ctx.fillRect(0, 0, 128, 256);
  const diffusion = new THREE.CanvasTexture(diffusionCanvas);
  diffusion.colorSpace = THREE.SRGBColorSpace;
  const cards: [number[], number[], string, number][] = [
    [[-4, 2, 4], [2.8, 7], '#fff0da', 5],
    [[4, 1, 2], [0.75, 6], '#d2e3ee', 3.8],
    [[0, 6, 1], [4, 2], '#fff7e9', 3],
    [[-1, 1, -5], [1.3, 4.5], '#c0d2d6', 2],
    [[2, 0, 6], [4, 6], '#eee5d8', 0.85],
  ];
  for (const [position, dimensions, color, intensity] of cards) {
    const material = new THREE.MeshBasicMaterial({
      map: diffusion,
      color: new THREE.Color(color).multiplyScalar(intensity),
      side: THREE.DoubleSide,
    });
    const card = new THREE.Mesh(
      new THREE.PlaneGeometry(dimensions[0], dimensions[1]),
      material,
    );
    card.position.fromArray(position);
    card.lookAt(0, 0.5, 0);
    room.add(card);
  }
  const generator = new THREE.PMREMGenerator(renderer);
  const target = generator.fromScene(room, 0.035);
  room.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose();
      (object.material as THREE.Material).dispose();
    }
  });
  generator.dispose();
  diffusion.dispose();
  return target;
}

export function surfaceTextures() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#999';
  ctx.fillRect(0, 0, 1024, 512);
  let seed = 8141;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  // Fine circumferential lathe marks. Large-scale material variation is deliberately absent.
  for (let y = 0; y < 512; y++) {
    const v = 128 + Math.floor(random() * 32);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(0, y, 1024, 1);
  }
  const brush = new THREE.CanvasTexture(canvas);
  brush.wrapS = brush.wrapT = THREE.RepeatWrapping;
  brush.repeat.set(1, 3);
  const stoneCanvas = document.createElement('canvas');
  stoneCanvas.width = stoneCanvas.height = 512;
  const stoneCtx = stoneCanvas.getContext('2d')!;
  stoneCtx.fillStyle = '#55524d';
  stoneCtx.fillRect(0, 0, 512, 512);
  // Dense sub-pixel mineral grain; no high-contrast marble/noise pattern.
  for (let i = 0; i < 18000; i++) {
    const v = 70 + Math.floor(random() * 20);
    stoneCtx.fillStyle = `rgba(${v},${v},${v},.10)`;
    stoneCtx.fillRect(random() * 512, random() * 512, 1, 1);
  }
  const stone = new THREE.CanvasTexture(stoneCanvas);
  stone.colorSpace = THREE.SRGBColorSpace;
  stone.wrapS = stone.wrapT = THREE.RepeatWrapping;
  stone.repeat.set(5, 4);
  const poresCanvas = document.createElement('canvas');
  poresCanvas.width = poresCanvas.height = 128;
  const poresCtx = poresCanvas.getContext('2d')!;
  poresCtx.fillStyle = '#a3a3a3';
  poresCtx.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 1900; i++) {
    poresCtx.fillStyle = random() > 0.5 ? '#898989' : '#b4b4b4';
    poresCtx.fillRect(random() * 128, random() * 128, 1, 1);
  }
  const pores = new THREE.CanvasTexture(poresCanvas);
  pores.wrapS = pores.wrapT = THREE.RepeatWrapping;
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 128;
  const shadowCtx = shadowCanvas.getContext('2d')!;
  const gradient = shadowCtx.createRadialGradient(64, 64, 13, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(0,0,0,.65)');
  gradient.addColorStop(0.55, 'rgba(0,0,0,.26)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  shadowCtx.fillStyle = gradient;
  shadowCtx.fillRect(0, 0, 128, 128);
  const contact = new THREE.CanvasTexture(shadowCanvas);
  return { brush, stone, pores, contact };
}

// Maintain clear face-on views but retain edge reflections, unlike uniform alpha.
export function fresnelAlpha(
  material: THREE.MeshPhysicalMaterial,
  faceAlpha: number,
) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      `
      float edgeOpacity = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 2.2);
      outgoingLight += vec3(.12,.15,.14) * edgeOpacity;
      diffuseColor.a *= mix(${faceAlpha.toFixed(3)}, 1.0, edgeOpacity);
      #include <opaque_fragment>
    `,
    );
  };
  material.customProgramCacheKey = () => `bar-fresnel-${faceAlpha}`;
  return material;
}
