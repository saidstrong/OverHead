"use client";
/* oxlint-disable react/react-compiler -- This component owns imperative GPU resources, not React state. */
import { useEffect, useLayoutEffect, useMemo } from "react";
import type { RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Quarter-resolution separable lens blur, then a depth-aware mix. No animation loop.
export function FocusPass({
  distance,
  glass,
}: {
  distance: RefObject<number>;
  glass: RefObject<THREE.Group>;
}) {
  const { gl, size } = useThree();
  const resources = useMemo(() => {
    const target = new THREE.WebGLRenderTarget(32, 32, {
      type: THREE.HalfFloatType,
      samples: 2,
    });
    target.depthTexture = new THREE.DepthTexture(32, 32, THREE.UnsignedIntType);
    const blurA = new THREE.WebGLRenderTarget(16, 16, {
      type: THREE.HalfFloatType,
      depthBuffer: false,
    });
    const blurB = blurA.clone();
    const vertexShader =
      "varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}";
    const blurMaterial = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      uniforms: {
        source: { value: target.texture },
        step: { value: new THREE.Vector2() },
      },
      vertexShader,
      fragmentShader: `
      varying vec2 vUv;uniform sampler2D source;uniform vec2 step;
      void main(){vec3 c=texture2D(source,vUv).rgb*.227027;
        c+=(texture2D(source,vUv+step*1.384615).rgb+texture2D(source,vUv-step*1.384615).rgb)*.316216;
        c+=(texture2D(source,vUv+step*3.230769).rgb+texture2D(source,vUv-step*3.230769).rgb)*.070270;
        gl_FragColor=vec4(c,1.);}`,
    });
    const material = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      uniforms: {
        color: { value: target.texture },
        blurred: { value: blurB.texture },
        depth: { value: target.depthTexture },
        focus: { value: 10 },
        near: { value: 0.1 },
        far: { value: 45 },
        foot: { value: new THREE.Vector3() },
      },
      vertexShader,
      fragmentShader: `
        uniform sampler2D color,blurred,depth;
        uniform float focus,near,far; uniform vec3 foot; varying vec2 vUv;
        void main(){
          float d=texture2D(depth,vUv).x;
          float z=near*far/(far-d*(far-near));
          // A narrow rack band keeps the served glass readable until the stage takes focus.
          float bridge=smoothstep(6.,10.,focus)*(1.-smoothstep(14.,17.,focus));
          float coc=smoothstep(mix(.65,1.05,bridge),mix(2.25,4.5,bridge),abs(z-focus));
          vec3 c=mix(texture2D(color,vUv).rgb,texture2D(blurred,vUv).rgb,coc);
          // A restrained, blurred screen-space foot reflection; no mirror scene render.
          float dy=foot.y-vUv.y;
          float contact=step(0.,dy)*(1.-smoothstep(0.,.14,dy));
          contact*=1.-smoothstep(.75,1.1,abs(vUv.x-foot.x)/max(.001,foot.z));
          vec3 reflected=texture2D(blurred,vec2(vUv.x,clamp(foot.y+dy*.8,0.,1.))).rgb;
          c+=reflected*.10*contact;
          gl_FragColor=vec4(c,1.);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    const screen = new THREE.Scene();
    screen.add(quad);
    const camera = new THREE.Camera();
    return {
      target,
      blurA,
      blurB,
      blurMaterial,
      material,
      quad,
      screen,
      camera,
      footPoint: new THREE.Vector3(),
      edgePoint: new THREE.Vector3(),
    };
  }, []);
  useLayoutEffect(() => {
    const ratio = gl.getPixelRatio(),
      w = Math.max(4, Math.round(size.width * ratio)),
      h = Math.max(4, Math.round(size.height * ratio));
    resources.target.setSize(w, h);
    resources.blurA.setSize(Math.ceil(w / 4), Math.ceil(h / 4));
    resources.blurB.setSize(Math.ceil(w / 4), Math.ceil(h / 4));
  }, [gl, size.width, size.height, resources]);
  useEffect(
    () => () => {
      resources.target.dispose();
      resources.target.depthTexture?.dispose();
      resources.blurA.dispose();
      resources.blurB.dispose();
      resources.blurMaterial.dispose();
      resources.material.dispose();
      resources.quad.geometry.dispose();
    },
    [resources],
  );
  useFrame(({ scene, camera }) => {
    if (size.width < 1 || size.height < 1) return;
    const previous = gl.getRenderTarget();
    const autoClear = gl.autoClear;
    try {
      gl.setRenderTarget(resources.target);
      // All authored objects render once. No nested transmission or screen-space refraction.
      gl.render(scene, camera);
      let calls = gl.info.render.calls,
        triangles = gl.info.render.triangles;
      const account = () => {
        calls += gl.info.render.calls;
        triangles += gl.info.render.triangles;
      };
      // Transparent glass does not overwrite the depth buffer. Keeping authored opaque
      // depth prevents the hard proxy silhouette that previously haloed glass edges.
      resources.material.uniforms.focus.value = distance.current;
      resources.footPoint.copy(glass.current.position).project(camera);
      resources.edgePoint.copy(glass.current.position);
      resources.edgePoint.x += 0.54;
      resources.edgePoint.project(camera);
      resources.material.uniforms.foot.value.set(
        resources.footPoint.x * 0.5 + 0.5,
        resources.footPoint.y * 0.5 + 0.5,
        Math.abs(resources.edgePoint.x - resources.footPoint.x) * 0.5,
      );
      const perspective = camera as THREE.PerspectiveCamera;
      resources.material.uniforms.near.value = perspective.near;
      resources.material.uniforms.far.value = perspective.far;
      resources.quad.material = resources.blurMaterial;
      resources.blurMaterial.uniforms.source.value = resources.target.texture;
      resources.blurMaterial.uniforms.step.value.set(
        1 / resources.blurA.width,
        0,
      );
      gl.setRenderTarget(resources.blurA);
      gl.render(resources.screen, resources.camera);
      account();
      resources.blurMaterial.uniforms.source.value = resources.blurA.texture;
      resources.blurMaterial.uniforms.step.value.set(
        0,
        1 / resources.blurA.height,
      );
      gl.setRenderTarget(resources.blurB);
      gl.render(resources.screen, resources.camera);
      account();
      resources.quad.material = resources.material;
      gl.setRenderTarget(previous);
      gl.render(resources.screen, resources.camera);
      account();
      gl.domElement.dataset.drawCalls = String(calls);
      gl.domElement.dataset.triangles = String(triangles);
    } finally {
      gl.autoClear = autoClear;
      gl.setRenderTarget(previous);
    }
  }, 1);
  return null;
}
