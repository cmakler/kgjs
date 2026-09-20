#!/usr/bin/env node
/*
 * crosscheck.js -- an independent second opinion on the class -> definition-interface map.
 *
 *   node crosscheck.js [--repo <kgjs checkout>] [--schema-dir <dir>]
 *
 * generate.js builds that map with the TypeScript compiler API (a real parser, files found by
 * following /// <reference> comments from src/ts/kg.ts).  This script does NOT use TypeScript at
 * all: it lists every *.ts file under src/ts/KGAuthor from the file system and looks for
 *     export class X extends Y          and          constructor(def: XDefinition
 * with regular expressions.  The two results (schema/class-map.json vs. this scan) are then
 * compared class by class.  Agreement of two unrelated methods is evidence that neither one
 * silently skipped files, classes or constructor types.
 */
'use strict';

const fs = require('fs');
const path = require('path');

let repo = null, schemaDir = null;
for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--repo') repo = process.argv[++i];
    else if (process.argv[i] === '--schema-dir') schemaDir = process.argv[++i];
    else { console.error('unknown argument ' + process.argv[i]); process.exit(2); }
}
repo = path.resolve(repo || process.env.KGJS_REPO || path.join(__dirname, '..', '..'));
schemaDir = path.resolve(schemaDir || path.join(__dirname, '..', '..', 'schema'));

function walk(dir, out) {
    for (const n of fs.readdirSync(dir)) {
        const f = path.join(dir, n);
        if (fs.statSync(f).isDirectory()) walk(f, out);
        else if (/\.ts$/.test(n)) out.push(f);
    }
    return out;
}

function stripComments(text) {
    // good enough for this code base: no comment markers inside string literals on class/constructor lines
    return text.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' ')).replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');
}

const authorFiles = walk(path.join(repo, 'src', 'ts', 'KGAuthor'), []).sort();
const allFiles = walk(path.join(repo, 'src', 'ts'), []).sort();

// every interface name, per namespace
const interfaces = {KG: new Set(), KGAuthor: new Set()};
const aliases = {};           // import X = KG.Y  (inside KGAuthor files)
for (const f of allFiles) {
    const text = stripComments(fs.readFileSync(f, 'utf8'));
    const ns = /module\s+KGAuthor\b/.test(text) ? 'KGAuthor' : (/module\s+KG\b/.test(text) ? 'KG' : null);
    if (!ns) continue;
    let m;
    const re = /export\s+interface\s+(\w+)/g;
    while ((m = re.exec(text)) !== null) interfaces[ns].add(m[1]);
    const ia = /import\s+(\w+)\s*=\s*KG\.(\w+)\s*;/g;
    while ((m = ia.exec(text)) !== null) if (ns === 'KGAuthor') aliases[m[1]] = m[2];
}

const scanned = {};
for (const f of authorFiles) {
    const text = stripComments(fs.readFileSync(f, 'utf8'));
    const re = /export\s+class\s+(\w+)(?:\s+extends\s+([\w.]+))?[^{]*\{/g;
    const starts = [];
    let m;
    while ((m = re.exec(text)) !== null) starts.push({name: m[1], parent: m[2] || null, index: m.index, bodyStart: re.lastIndex});
    starts.forEach((c, i) => {
        // the class text runs until the next top-level declaration
        const rest = text.slice(c.bodyStart);
        const next = rest.search(/\n\s*export\s+(class|interface|function)\b/);
        const body = next < 0 ? rest : rest.slice(0, next);
        const ctor = /constructor\s*\(\s*\w+\s*(\?)?\s*(?::\s*([\w.]+))?/.exec(body);
        let iface = null, how = 'none';
        if (ctor && ctor[2]) {
            let t = ctor[2];
            if (/^KG\./.test(t)) { if (interfaces.KG.has(t.slice(3))) { iface = t; how = 'constructor-parameter'; } }
            else if (aliases[t] && interfaces.KG.has(aliases[t])) { iface = 'KG.' + aliases[t]; how = 'constructor-parameter'; }
            else if (interfaces.KGAuthor.has(t)) { iface = t; how = 'constructor-parameter'; }
        }
        if (!iface && interfaces.KGAuthor.has(c.name + 'Definition')) { iface = c.name + 'Definition'; how = 'name-convention'; }
        scanned[c.name] = {file: path.relative(repo, f).split(path.sep).join('/'), parent: c.parent ? c.parent.replace(/^KGAuthor\./, '') : null, definitionInterface: iface, resolvedBy: how};
        void i;
    });
}

const map = JSON.parse(fs.readFileSync(path.join(schemaDir, 'class-map.json'), 'utf8'));
const generated = map.classes;

console.log('kgjs class-map cross-check  (' + new Date().toISOString() + ')');
console.log('  repo             ' + repo);
console.log('  generator commit ' + map.commit);
console.log('  *.ts files under src/ts/KGAuthor (file system): ' + authorFiles.length);
console.log('  classes found by regex scan:     ' + Object.keys(scanned).length);
console.log('  classes in class-map.json:       ' + Object.keys(generated).length + '   (TypeScript compiler API)');
console.log('');

const disagreements = [];
const names = new Set(Object.keys(scanned).concat(Object.keys(generated)));
for (const n of [...names].sort()) {
    const a = scanned[n], b = generated[n];
    if (!a) { disagreements.push(n + ': only the compiler-API generator found this class (' + b.file + ')'); continue; }
    if (!b) { disagreements.push(n + ': only the regex scan found this class (' + a.file + ') -- is the file reachable from src/ts/kg.ts?'); continue; }
    if ((a.parent || null) !== (b.parent || null)) disagreements.push(n + ': parent class differs: regex=' + a.parent + ' generator=' + b.parent);
    if ((a.definitionInterface || null) !== (b.definitionInterface || null)) disagreements.push(n + ': definition interface differs: regex=' + a.definitionInterface + ' generator=' + b.definitionInterface);
    else if (a.resolvedBy !== b.resolvedBy) disagreements.push(n + ': same interface but found differently: regex=' + a.resolvedBy + ' generator=' + b.resolvedBy);
    if (a.file !== b.file.replace(/:\d+$/, '')) disagreements.push(n + ': file differs: regex=' + a.file + ' generator=' + b.file);
}

const byHow = {};
Object.values(scanned).forEach(c => { byHow[c.resolvedBy] = (byHow[c.resolvedBy] || 0) + 1; });
console.log('  regex scan, definition interface found by: ' + Object.keys(byHow).sort().map(k => k + '=' + byHow[k]).join(', '));
const byHowG = {};
Object.values(generated).forEach(c => { byHowG[c.resolvedBy] = (byHowG[c.resolvedBy] || 0) + 1; });
console.log('  generator,  definition interface found by: ' + Object.keys(byHowG).sort().map(k => k + '=' + byHowG[k]).join(', '));
console.log('');
console.log('disagreements: ' + disagreements.length);
disagreements.forEach(d => console.log('  ' + d));
console.log('');
console.log('SUMMARY crosscheck: ' + Object.keys(scanned).length + ' classes compared, ' + disagreements.length + ' disagreements');
process.exit(disagreements.length ? 1 : 0);
