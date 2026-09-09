// Offline asset source. Original control profiles/cages authored for Overhead.
// No downloaded models/textures. Run: node scripts/author-bar-assets.mjs
import * as T from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { mergeVertices, mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mkdir, writeFile } from 'node:fs/promises';

globalThis.FileReader = class {
  async readAsArrayBuffer(blob) { this.result = await blob.arrayBuffer(); this.onloadend?.(); }
};
const group = new T.Group();
const stats = {};
function add(name, geometry) {
  geometry.deleteAttribute('uv');
  geometry = mergeVertices(geometry, 0.00001);
  // Drop collapsed pole/end-cap faces and compact to referenced vertices only.
  const keep=[],a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();
  for(let i=0;i<geometry.index.count;i+=3){
    const ids=[geometry.index.getX(i),geometry.index.getX(i+1),geometry.index.getX(i+2)];
    a.fromBufferAttribute(geometry.attributes.position,ids[0]);b.fromBufferAttribute(geometry.attributes.position,ids[1]);c.fromBufferAttribute(geometry.attributes.position,ids[2]);
    if(b.sub(a).cross(c.sub(a)).lengthSq()>1e-14)keep.push(...ids);
  }
  geometry.setIndex(keep);geometry=mergeVertices(geometry,.00001);
  geometry.normalizeNormals();
  geometry.computeBoundingBox();
  const mesh = new T.Mesh(geometry, new T.MeshStandardMaterial({ color: '#ffffff' }));
  mesh.name = name; group.add(mesh);
  stats[name] = { vertices: geometry.attributes.position.count, triangles: geometry.index.count / 3, bounds: geometry.boundingBox };
}

// Closed, continuous cross-section: underside -> heel -> outer wall -> rolled rim
// -> inner wall -> rounded internal floor -> solid 0.21-unit base. No nested foot.
const glassProfile = [
 [0,0],[.35,0],[.435,0],[.46,.006],[.48,.020],[.493,.043],
 [.502,.075],[.506,.11],[.508,.17],[.509,.24],[.512,.42],
 [.517,.68],[.523,.94],[.529,1.20],[.532,1.315],
 [.532,1.334],[.529,1.345],[.523,1.352],[.515,1.354],
 [.507,1.352],[.501,1.345],[.499,1.334],[.499,1.315],
 [.496,1.20],[.490,.94],[.484,.68],[.478,.42],[.474,.30],
 [.471,.27],[.463,.245],[.449,.225],[.427,.212],[.395,.21],[0,.21]
];
const glass = new T.LatheGeometry(glassProfile.map(p=>new T.Vector2(...p)),64);
// Eight shallow sculpted heel panels terminate well below the clear bowl.
const gp=glass.attributes.position;
for(let i=0;i<gp.count;i++){
 const x=gp.getX(i),y=gp.getY(i),z=gp.getZ(i),r=Math.hypot(x,z);
 if(r>.47 && y<.42){const a=Math.atan2(x,z), cut=.0045*Math.pow(Math.sin(a*4),2)*Math.sin(Math.PI*Math.min(y/.42,1));gp.setXYZ(i,x*(1-cut/r),y,z*(1-cut/r));}
}
glass.computeVertexNormals();add('RocksGlass',glass);

// Distinct hand-positioned control cages, not a shared rounded-box primitive.
const cages=[
 [[-.23,-.23,-.20],[.22,-.22,-.21],[.25,-.19,.19],[-.21,-.24,.22],[-.22,.22,-.21],[.19,.24,-.18],[.23,.20,.21],[-.20,.23,.18],[.06,.26,-.03]],
 [[-.22,-.22,-.18],[.24,-.20,-.21],[.22,-.22,.21],[-.19,-.20,.22],[-.18,.25,-.19],[.23,.19,-.17],[.17,.23,.23],[-.23,.19,.17],[-.24,.03,.08]]
];
for(let k=0;k<2;k++){
 const points=[];
 // Rounded Minkowski hull: small curved bevel bands around the authored cage.
 for(const c of cages[k])for(let v=0;v<=6;v++)for(let u=0;u<12;u++){
  const a=u*Math.PI/6,b=v*Math.PI/6,r=.047;
  points.push(new T.Vector3(c[0]+r*Math.sin(b)*Math.cos(a),c[1]+r*Math.cos(b),c[2]+r*Math.sin(b)*Math.sin(a)));
 }
 const hull=new ConvexGeometry(points);hull.deleteAttribute('normal');
 const ice=mergeVertices(hull,.0001);ice.computeVertexNormals();add(`Ice${k+1}`,ice);
}

// Closed ribbon swept over a designed S-curve, with separate rind and pith skins.
const curve=new T.CatmullRomCurve3([
 new T.Vector3(-.03,-.035,.08),new T.Vector3(-.14,.025,.07),
 new T.Vector3(-.16,.16,0),new T.Vector3(-.04,.30,-.08),
 new T.Vector3(.12,.31,-.02),new T.Vector3(.14,.19,.08),new T.Vector3(.035,.14,.12)
]);
const frames=curve.computeFrenetFrames(48,false);
for(const inside of [false,true]){
 const pos=[],idx=[];
 for(let i=0;i<=48;i++){
  const t=i/48,c=curve.getPointAt(t),n=frames.normals[i],b=frames.binormals[i];
  const width=.043*Math.pow(Math.sin(Math.PI*(.035+.93*t)),.35);
  for(const s of [-1,1]){const p=c.clone().addScaledVector(n,s*width).addScaledVector(b,inside?-.004:.004);pos.push(...p.toArray());}
  if(i<48){const j=i*2;idx.push(...(inside?[j,j+2,j+1,j+1,j+2,j+3]:[j,j+1,j+2,j+1,j+3,j+2]));}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();add(inside?'PeelPith':'PeelRind',g);
}
// Edge strip bridges rind and pith: actual ribbon thickness, not two coplanar faces.
const edgePos=[],edgeIdx=[];
for(const s of [-1,1])for(let i=0;i<=48;i++){
 const t=i/48,c=curve.getPointAt(t),width=.043*Math.pow(Math.sin(Math.PI*(.035+.93*t)),.35);
 for(const d of [-.004,.004])edgePos.push(...c.clone().addScaledVector(frames.normals[i],s*width).addScaledVector(frames.binormals[i],d).toArray());
 if(i<48){const j=(s===-1?0:98)+i*2;edgeIdx.push(j,j+1,j+2,j+1,j+3,j+2);}
}
const edges=new T.BufferGeometry();edges.setAttribute('position',new T.Float32BufferAttribute(edgePos,3));edges.setIndex(edgeIdx);edges.computeVertexNormals();add('PeelEdge',edges);

// Fixed-pose, intentionally faceless performance figure. One merged mesh per figure.
function figure(seated=false){
 const outline=seated?
 [[-.27,.82],[-.36,1.16],[-.27,1.49],[-.16,1.64],[.13,1.64],[.30,1.46],[.46,1.20],[.40,1.14],[.19,1.34],[.20,.84]]:
 [[-.22,0],[-.23,.51],[-.18,1.10],[-.30,1.55],[-.30,1.83],[-.18,2.03],[.16,2.03],[.27,1.89],[.30,1.73],[.11,1.58],[.05,1.67],[.16,1.85],[.11,1.89],[.13,1.18],[.24,.54],[.23,0],[.10,0],[.02,.73],[-.04,.73],[-.08,0]];
 const shape=new T.Shape();
 shape.moveTo((outline[0][0]+outline.at(-1)[0])/2,(outline[0][1]+outline.at(-1)[1])/2);
 for(let i=0;i<outline.length;i++){const p=outline[i],n=outline[(i+1)%outline.length];shape.quadraticCurveTo(p[0],p[1],(p[0]+n[0])/2,(p[1]+n[1])/2);}
 const body=new T.ExtrudeGeometry(shape,{depth:.19,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.025,bevelThickness:.025,curveSegments:6});body.translate(0,0,-.095);
 const head=new T.SphereGeometry(1,12,8);head.scale(.14,.19,.13);head.translate(seated?-.02:0,seated?1.85:2.26,0);
 const neck=new T.CylinderGeometry(.065,.08,.14,8);neck.translate(0,seated?1.67:2.06,0);
 const pieces=[body,head,neck].map(g=>{const n=g.index?g.toNonIndexed():g;n.deleteAttribute('uv');return n;});
 return mergeGeometries(pieces);
}
add('Vocalist',figure());add('Drummer',figure(true));
const binary=await new GLTFExporter().parseAsync(group,{binary:true,onlyVisible:true});
await mkdir('public/models/overhead',{recursive:true});
await writeFile('public/models/overhead/bar-assets.glb',Buffer.from(binary));
await writeFile('public/models/overhead/asset-stats.json',JSON.stringify({bytes:binary.byteLength,meshes:stats},null,2));
console.log(JSON.stringify({bytes:binary.byteLength,meshes:Object.fromEntries(Object.entries(stats).map(([k,v])=>[k,{vertices:v.vertices,triangles:v.triangles}]))}));
