import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import ts from 'typescript';
const read = (p) => readFileSync(p, 'utf8');
const imported = async (source) =>
  import(
    'data:text/javascript;base64,' +
      Buffer.from(
        ts.transpile(source, { module: ts.ModuleKind.ESNext }),
      ).toString('base64')
  );
const { menuCategories, signatureDrinks } = await imported(
  read('content/overhead-menu.ts'),
);
const { events, visit } = await imported(read('content/site-content.ts'));
const old = await imported(
  execFileSync('git', ['show', 'fef25b7:content/site-content.ts'], {
    encoding: 'utf8',
  }),
);
const items = menuCategories.flatMap((c) => c.groups.flatMap((g) => g.items));
assert.equal(items.length, 62);
assert.equal(signatureDrinks.length, 4);
assert.equal(menuCategories.length, 7);
assert.deepEqual(
  menuCategories.map((c) => c.groups.flatMap((g) => g.items).length),
  [4, 10, 4, 24, 5, 6, 9],
);
assert(
  items.every(
    (i) => i.name && i.category && Number.isInteger(i.price) && i.price > 0,
  ),
);
assert(!items.some((i) => /RELOC/i.test(i.name)));
assert.deepEqual(
  visit.hours.map((h) => [h.opens, h.closes]),
  ['00:00', '00:00', '00:00', '02:00', '05:00', '05:00', '02:00'].map((end) => [
    '18:00',
    end,
  ]),
);
const facts = (e) => [
  e.id,
  e.title,
  e.isoDate,
  e.time,
  e.age,
  e.ticketUrl,
  e.status,
  e.verification,
  e.price.replace(/\D/g, ''),
];
assert.deepEqual(events.map(facts), old.events.map(facts));
assert.equal(
  execFileSync('git', ['hash-object', 'public/overhead-mark.png'], {
    encoding: 'utf8',
  }).trim(),
  execFileSync('git', ['rev-parse', 'fef25b7:public/overhead-mark.png'], {
    encoding: 'utf8',
  }).trim(),
);
for (const p of [
  'components/scene/bar-canvas.tsx',
  'components/scene/hybrid-assets.ts',
  'components/scene/hybrid-layers.css',
  'public/media/overhead',
]) {
  assert.equal(
    execFileSync('git', ['diff', 'fef25b7', '--', p], { encoding: 'utf8' }),
    '',
    p + ' changed',
  );
}
assert(!/CocktailVisual/.test(read('components/sections/hero-section.tsx')));
console.log(
  'PASS: 62 supplied menu entries, 7 categories, 7 daily hours; event facts/links and original logo preserved; hybrid renderer/assets untouched; no hero shaker.',
);
