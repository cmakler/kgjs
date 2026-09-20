#!/usr/bin/env node
/*
 * render-check.js -- OPTIONAL full-engine check: build a real KG.View (authoring layer AND
 * rendering layer, with the d3 / mathjs / KaTeX that kgjs bundles) for a graph definition inside
 * jsdom, and report whether the engine throws.
 *
 *   npm install --no-save jsdom@24.1.3        (not a dependency of the other tools)
 *   node render-check.js [--repo <kgjs checkout>] [--bundle <bundled kg.X.Y.Z.js>] --docs
 *   node render-check.js [--repo <kgjs checkout>] [--bundle <...>] file.yml [...]
 *
 * Without --bundle the engine is <repo>/build/lib/kg-lib.js followed by <repo>/build/kg.js, each
 * evaluated as its own script (as two <script> tags would).  With --bundle a single pre-bundled
 * file such as docs/js/kg.0.3.3.js (the one the documentation pages load) is used instead.
 *
 * Limits: jsdom is not a browser.  It has no layout (every element is 0px wide) and no WebGL, so
 * this only finds exceptions thrown by the engine's own JavaScript; it says nothing about how a
 * graph looks.  3D (Mathbox) examples are not exercised meaningfully.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

let JSDOM, VirtualConsole;
try {
    ({JSDOM, VirtualConsole} = require('jsdom'));
} catch (e) {
    console.error('render-check.js needs jsdom:  npm install --no-save jsdom@24.1.3');
    process.exit(2);
}

function makeRenderer(scripts) {
    const sources = scripts.map(f => fs.readFileSync(f, 'utf8'));
    return function render(data) {
        const vc = new VirtualConsole();          // swallow the engine's console.log chatter
        const dom = new JSDOM('<!doctype html><html><body><div id="g" class="kg-container" style="width:600px"></div></body></html>',
            {runScripts: 'outside-only', virtualConsole: vc, pretendToBeVisual: true});
        const w = dom.window;
        try {
            sources.forEach((src, i) => w.eval(src + (i === sources.length - 1 ? '\n;window.KG = KG;' : '')));
        } catch (e) {
            return {threw: 'ENGINE DID NOT LOAD: ' + e.message};
        }
        // same clean-up as loadGraphs() in src/ts/kg.ts
        w.__data = JSON.parse(JSON.stringify(data).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&'));
        try {
            w.eval('window.__view = new KG.View(document.getElementById("g"), window.__data)');
        } catch (e) {
            const frame = ((e && e.stack) || '').split('\n').find(l => /at new |at [A-Za-z]+\.[a-zA-Z]+ /.test(l)) || '';
            return {threw: ((e && e.constructor && e.constructor.name) || 'Error') + ': ' + (e && e.message), where: frame.trim().replace(/\(eval at.*$/, '').trim()};
        } finally {
            w.close();
        }
        return {threw: null};
    };
}

function main() {
    const argv = process.argv.slice(2);
    let repo = null, bundle = null, docs = false;
    const files = [];
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--repo') repo = argv[++i];
        else if (argv[i] === '--bundle') bundle = argv[++i];
        else if (argv[i] === '--docs') docs = true;
        else files.push(argv[i]);
    }
    repo = path.resolve(repo || process.env.KGJS_REPO || path.join(__dirname, '..', '..'));
    const scripts = bundle ? [path.resolve(bundle)] : [path.join(repo, 'build', 'lib', 'kg-lib.js'), path.join(repo, 'build', 'kg.js')];
    const render = makeRenderer(scripts);

    console.log('kgjs full-engine render check under jsdom  (' + new Date().toISOString() + ')');
    console.log('  repo    ' + repo);
    console.log('  engine  ' + scripts.map(s => path.relative(repo, s)).join(' + '));
    console.log('  jsdom   ' + require('jsdom/package.json').version);
    let items = files.map(f => ({id: f, data: /\.json$/.test(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : yaml.safeLoad(fs.readFileSync(f, 'utf8'))}));
    if (docs) items = items.concat(require('./validate-docs.js').collectParsedExamples(repo));
    let threw = 0;
    for (const it of items) {
        const r = render(it.data);
        if (r.threw) {
            threw++;
            console.log('  THROWS  ' + it.id + '\n          ' + r.threw + (r.where ? '   [' + r.where + ']' : ''));
        }
    }
    console.log('SUMMARY render-check: ' + items.length + ' definitions, ' + (items.length - threw) + ' built a KG.View without an exception, ' + threw + ' threw');
}

module.exports = {makeRenderer};
if (require.main === module) main();
