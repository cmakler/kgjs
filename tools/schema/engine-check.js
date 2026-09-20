#!/usr/bin/env node
/*
 * engine-check.js -- an independent oracle for the schema: run kgjs's own authoring parser
 * (KG.View.parse -> KGAuthor.parse) on a graph definition inside Node and report whether it
 * throws, and which object types it says it does not know.
 *
 *   node engine-check.js [--repo <kgjs checkout>] --docs            every documentation example
 *   node engine-check.js [--repo <kgjs checkout>] file.yml [...]    specific files
 *   add --engine-js build/kg.js to test the build that is checked in instead of compiling the source
 *
 * Scope: ONLY the authoring layer runs (the code that turns YAML into the engine's internal
 * JSON).  The rendering layer (KG.Point, KG.Curve, ... which need a browser, d3, KaTeX and
 * mathjs) is NOT executed, so "parsed without exception" does not prove the graph renders.
 *
 * The engine is compiled from src/ts/kg.ts into a temporary folder; the checkout is not modified.
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');
const yaml = require('js-yaml');

function compileEngine(repo) {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kgjs-engine-'));
    const outFile = path.join(outDir, 'kg.js');
    const program = ts.createProgram([path.join(repo, 'src', 'ts', 'kg.ts')], {
        outFile, skipLibCheck: true, lib: ['lib.es2018.d.ts', 'lib.dom.d.ts'], target: ts.ScriptTarget.ES5, noEmitOnError: false
    });
    program.emit();       // type errors about d3/katex typings are expected and irrelevant here
    return outFile;
}

function loadEngine(jsFile) {
    const logs = [];
    const sandbox = {
        console: {log: (...a) => logs.push(a.map(x => typeof x === 'string' ? x : '').join(' ').trim()), warn() {}, error() {}},
        window: {location: {search: ''}, addEventListener() {}, parent: null},
        document: {addEventListener() {}, getElementsByClassName() { return []; }},
        URLSearchParams, Math, JSON, Object, Array, String, Number, Infinity, isNaN, parseFloat, parseInt, RegExp, Error, TypeError
    };
    sandbox.window.parent = sandbox.window;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(jsFile, 'utf8') + '\n;this.KG = KG; this.KGAuthor = KGAuthor;', sandbox, {filename: jsFile});
    // remove the temporary build made by compileEngine()
    if (path.basename(path.dirname(jsFile)).indexOf('kgjs-engine-') === 0) fs.rmSync(path.dirname(jsFile), {recursive: true, force: true});
    return {sandbox, logs};
}

function parseWithEngine(engine, data) {
    const {sandbox, logs} = engine;
    logs.length = 0;
    const div = {hasAttribute() { return false; }, getAttribute() { return null; }};
    // same round trip as loadGraphs() in src/ts/kg.ts
    const copy = JSON.parse(JSON.stringify(data).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&'));
    const result = {threw: null, unknownTypes: [], layers: 0, divs: 0};
    try {
        sandbox.__data = copy;
        sandbox.__div = div;
        const parsed = vm.runInContext('KG.View.prototype.parse.call({}, __data, __div)', sandbox);
        result.layers = parsed.layers.reduce((n, l) => n + l.length, 0);
        result.divs = parsed.divs.length;
    } catch (e) {
        result.threw = (e && e.constructor && e.constructor.name || 'Error') + ': ' + (e && e.message);
    }
    logs.forEach(l => {
        const m = /no\s+(\S+)\s+object type in KGAuthor/.exec(l) || /There's no object called\s+(\S+)/.exec(l);
        if (m) result.unknownTypes.push(m[1]);
    });
    return result;
}

module.exports = {compileEngine, loadEngine, parseWithEngine};

if (require.main === module) {
    const argv = process.argv.slice(2);
    let repo = null, docs = false, engineJs = null;
    const files = [];
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--repo') repo = argv[++i];
        else if (argv[i] === '--docs') docs = true;
        else if (argv[i] === '--engine-js') engineJs = argv[++i];      // use an existing build (e.g. build/kg.js) instead of compiling
        else files.push(argv[i]);
    }
    repo = path.resolve(repo || process.env.KGJS_REPO || path.join(__dirname, '..', '..'));
    const engine = loadEngine(engineJs ? path.resolve(engineJs) : compileEngine(repo));
    console.log('kgjs authoring-layer engine check  (' + new Date().toISOString() + ')');
    console.log('  repo   ' + repo);
    console.log('  engine ' + (engineJs ? path.resolve(engineJs) + ' (existing build)' : 'compiled from src/ts/kg.ts with TypeScript ' + ts.version));
    let items = files.map(f => ({id: f, data: /\.json$/.test(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : yaml.safeLoad(fs.readFileSync(f, 'utf8'))}));
    if (docs) {
        process.argv = [process.argv[0], process.argv[1], '--repo', repo];
        items = items.concat(require('./validate-docs.js').collectParsedExamples(repo));
    }
    let threw = 0, unknown = 0;
    for (const it of items) {
        const r = parseWithEngine(engine, it.data);
        if (r.threw) threw++;
        if (r.unknownTypes.length) unknown++;
        if (r.threw || r.unknownTypes.length) console.log('  ' + it.id + '\n      ' + (r.threw ? 'THREW ' + r.threw : '') + (r.unknownTypes.length ? ' UNKNOWN TYPES ' + r.unknownTypes.join(', ') : ''));
    }
    console.log('checked ' + items.length + ' definitions: ' + threw + ' threw an exception in the authoring layer, ' + unknown + ' used an object type the engine does not know');
}
