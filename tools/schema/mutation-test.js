#!/usr/bin/env node
/*
 * mutation-test.js -- how good is the strict schema at catching typos?
 *
 *   node mutation-test.js [--repo <kgjs checkout>] [--schema-dir <dir>] [--verbose]
 *
 * For every documentation example that the strict schema accepts, every mapping key in it is
 * misspelled once (one key at a time, by appending "Q": `color` -> `colorQ`) and the mutated
 * document is validated again.  A mutant that is still accepted is a typo the schema would miss.
 * Keys inside free-form maps (calcs, colors, idioms, templateDefaults: the author chooses those
 * names) are counted separately, because no schema can know them.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

let repo = null, schemaDir = null, verbose = false;
for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--repo') repo = process.argv[++i];
    else if (process.argv[i] === '--schema-dir') schemaDir = process.argv[++i];
    else if (process.argv[i] === '--verbose') verbose = true;
    else { console.error('unknown argument ' + process.argv[i]); process.exit(2); }
}
repo = path.resolve(repo || process.env.KGJS_REPO || path.join(__dirname, '..', '..'));
schemaDir = path.resolve(schemaDir || path.join(__dirname, '..', '..', 'schema'));

const FREE_FORM = ['calcs', 'colors', 'idioms', 'templateDefaults', 'custom'];

const strict = new Ajv({allErrors: false, strict: true, allowUnionTypes: true, strictTypes: false, strictRequired: false})
    .compile(JSON.parse(fs.readFileSync(path.join(schemaDir, 'kg.strict.schema.json'), 'utf8')));
const examples = require('./validate-docs.js').collectParsedExamples(repo);

// list every (path-to-object, key) pair
function keysOf(node, trail, out) {
    if (Array.isArray(node)) node.forEach((v, i) => keysOf(v, trail.concat(i), out));
    else if (node && typeof node === 'object') {
        Object.keys(node).forEach(k => { out.push({trail, key: k}); keysOf(node[k], trail.concat(k), out); });
    }
    return out;
}

function mutate(doc, trail, key) {
    const copy = JSON.parse(JSON.stringify(doc));
    let node = copy;
    trail.forEach(seg => { node = node[seg]; });
    const rebuilt = {};
    Object.keys(node).forEach(k => { rebuilt[k === key ? key + 'Q' : k] = node[k]; });   // keep key order
    Object.keys(node).forEach(k => delete node[k]);
    Object.assign(node, rebuilt);
    return copy;
}

let total = 0, caught = 0, freeTotal = 0, freeCaught = 0, used = 0;
const survivors = new Map();
for (const ex of examples) {
    if (!strict(ex.data)) continue;          // only examples that are valid to begin with
    used++;
    for (const {trail, key} of keysOf(ex.data, [], [])) {
        const free = FREE_FORM.indexOf(trail[0]) > -1 || (trail.length === 0 && false);
        const ok = strict(mutate(ex.data, trail, key));
        if (free) { freeTotal++; if (!ok) freeCaught++; continue; }
        total++;
        if (!ok) caught++;
        else {
            // generalise the location: drop list indexes
            const where = trail.filter(s => typeof s !== 'number').slice(-3).join('/') + '/' + key;
            if (!survivors.has(where)) survivors.set(where, []);
            survivors.get(where).push(ex.id);
        }
    }
}

console.log('kgjs strict-schema mutation test  (' + new Date().toISOString() + ')');
console.log('  examples used (valid under the strict schema): ' + used + ' of ' + examples.length);
console.log('  single-key misspellings tried:                 ' + total);
console.log('  rejected by the strict schema:                 ' + caught + '  (' + (100 * caught / total).toFixed(1) + '%)');
console.log('  still accepted (typos the schema would miss):  ' + (total - caught));
console.log('  (not counted above: ' + freeTotal + ' keys inside free-form maps ' + FREE_FORM.join('/') + ', of which ' + freeCaught + ' were rejected)');
console.log('');
console.log('where misspellings survive (last path segments / key : number of examples):');
[...survivors.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, verbose ? 1000 : 40).forEach(([w, ids]) => {
    console.log('  ' + String(ids.length).padStart(4) + '  ' + w + (verbose ? '   e.g. ' + ids[0] : ''));
});
console.log('');
console.log('SUMMARY mutation: tried=' + total + ' rejected=' + caught + ' missed=' + (total - caught));
