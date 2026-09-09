import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import ts from 'typescript';
const read = p => readFileSync(p,'utf8').replace(/\r/g,'');
const baseline = p => execFileSync('git',['show',`0d31c0e:${p}`],{encoding:'utf8'}).replace(/\r/g,'');
const tokens = text => {
 const scan=ts.createScanner(ts.ScriptTarget.Latest,true,ts.LanguageVariant.Standard,text), result=[];
 for(let kind=scan.scan();kind!==ts.SyntaxKind.EndOfFileToken;kind=scan.scan())result.push([kind,kind===ts.SyntaxKind.StringLiteral?scan.getTokenValue():scan.getTokenText()]);
 return JSON.stringify(result);
};
const path='components/scene/bar-canvas.tsx', a=baseline(path), b=read(path);
const section=(text,start,end)=>{const i=text.indexOf(start),j=text.indexOf(end,i);assert(i>=0&&j>i,`Missing section ${start}`);return text.slice(i,j);};
const same=(name,left,right)=>assert.equal(tokens(left),tokens(right),`${name} changed`);
same('tin geometry',section(a,'  const lower = vessel','  const glass = authored'),section(b,'  const lower = vessel','  const { brush'));
same('shaker/separation/tilt timing',section(a,'    const tiltIn =','    const fill ='),section(b,'    const tiltIn =','    const fill ='));
same('stream path and timing',section(a,'    const streamAmount =','    key.current.intensity'),section(b,'    const streamAmount =','    key.current.intensity'));
same('fill timing',section(a,'    const fill =','    liquid.current.scale'),section(b,'    const fill =','    // The receiving'));
same('camera/static framing',section(a,'    const cam =','    // Inspectable'),section(b,'    const cam =','    // Same camera'));
const control='components/scene/bar-experience.tsx';
// Owner-requested full-bleed/textless shell: remove only caption/progress bookkeeping
// and the old card's 24px top inset. All seek/tween/cleanup logic stays protected.
const textlessController = section(baseline(control),'  useEffect(() => {\n    const element','\n  return (')
  .replace('    let lastChapter = -1;\n', '')
  .replace(/      if \(progress.current\)[\s\S]*?        setChapter\(next\);\n      \}\n/, '')
  .replace("start: 'top top+=24'", "start: 'top top'");
same('GSAP controller except removed UI and top inset',textlessController,section(read(control),'  useEffect(() => {\n    const element','\n  return ('));
same('accepted hybrid renderer',execFileSync('git',['show','fef25b7:components/scene/bar-canvas.tsx'],{encoding:'utf8'}),b);
assert(!/GLTFLoader|FocusPass|<Stage|assets\.(glass|frozen|peel)/.test(b));
assert(b.includes('frameloop="demand"'));
console.log('PASS: checkpoint tin geometry, choreography, fill/stream timing, camera/static framing and GSAP controller preserved; retired runtime assets absent.');
