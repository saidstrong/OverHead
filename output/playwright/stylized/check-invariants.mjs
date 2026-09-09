import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const read = (path) => readFileSync(path, 'utf8').replace(/\r/g, '');
const compact = (text) => text.replace(/\s/g, '');
const before = (name) => read(`output/playwright/stylized/before/${name}.txt`);
const current = (name) => read(`components/scene/${name}`);
const track = (text) => {
  const start = text.indexOf('  useFrame(');
  return compact(text.slice(start, text.indexOf('\n  return (', start)));
};
assert.equal(track(current('bar-canvas.tsx')), track(before('bar-canvas.tsx')));
const controller = (text) => compact(text.slice(0, text.lastIndexOf('\n  return (')));
assert.equal(controller(current('bar-experience.tsx')), controller(before('bar-experience.tsx')));
assert.ok(current('bar-canvas.tsx').includes('frameloop="demand"'));
assert.ok(!current('focus-pass.tsx').includes('wallScene'));
assert.ok(!current('studio-assets.ts').includes('refractiveWall'));
console.log(JSON.stringify({ motionTrackUnchanged: true, scrollControllerUnchanged: true,
  demandRendering: true, nestedOpticalPassesRemoved: true }, null, 2));
