import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const bytes=await readFile('public/models/overhead/bar-assets.glb');
const {scene}=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
let triangles=0;const meshNames=[];
scene.traverse(o=>{if(!o.isMesh)return;meshNames.push(o.name);const g=o.geometry,p=g.attributes.position,n=g.attributes.normal;
 for(const value of p.array)assert(Number.isFinite(value));
 for(let i=0;i<n.count;i++){const length=Math.hypot(n.getX(i),n.getY(i),n.getZ(i));assert(Math.abs(length-1)<.002,`${o.name} normal ${length}`);}
 for(const index of g.index.array)assert(index<p.count);triangles+=g.index.count/3;
});
const bounds=scene.getObjectByName('RocksGlass').geometry.boundingBox;
assert(Math.abs(bounds.min.y)<.00001);assert(Math.abs(bounds.max.y-1.354)<.0001);
const iceChecks=[];
for(const [name,position,rotation,scale] of [['Ice1',[-.07,.49,.04],[.08,.4,-.08],.9],['Ice2',[.06,.99,-.02],[.08,-.25,.06],.82]]){
 const matrix=new T.Matrix4().compose(new T.Vector3(...position),new T.Quaternion().setFromEuler(new T.Euler(...rotation)),new T.Vector3(scale,scale,scale));
 const p=scene.getObjectByName(name).geometry.attributes.position;let radius=0,minY=10;
 for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(matrix);radius=Math.max(radius,Math.hypot(v.x,v.z));minY=Math.min(minY,v.y);}
 assert(radius<.47);assert(minY>.21);iceChecks.push({name,maxRadius:radius,minY});
}
const current=await readFile('components/scene/bar-canvas.tsx','utf8');
const before=await readFile('output/playwright/authored-assets/before/bar-canvas.tsx.txt','utf8');
const camera=s=>s.slice(s.indexOf('    const cam = camera'),s.indexOf('    // Inspectable')).replace(/\s/g,'');
assert.equal(camera(current),camera(before),'approved camera block changed');
console.log(JSON.stringify({bytes:bytes.length,gzipEstimate:gzipSync(bytes).length,meshNames,triangles,iceChecks,cameraUnchanged:true},null,2));
