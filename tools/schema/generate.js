#!/usr/bin/env node
/*
 * generate.js -- builds a JSON Schema (draft-07) for the kgjs YAML/JSON authoring
 * format directly from the TypeScript sources, using the TypeScript compiler API.
 *
 *   node generate.js [--repo <path to kgjs checkout>] [--out <dir>]
 *
 * Nothing about individual objects (Point, Line, OneGraph, ...) is written by hand.
 * For every class the information comes from three places in the source code:
 *
 *   A. DECLARED  - the `*Definition` interface that types the class's constructor
 *                  argument (or, when the constructor is untyped, the interface
 *                  called `<ClassName>Definition`), following `extends` chains and
 *                  the class's own `extends` chain.
 *   B. READ      - properties the constructor chain actually reads from `def`
 *                  (`def.x`, `def['x']`, `def.hasOwnProperty('x')`,
 *                  `KG.setDefaults(def, {x: ...})`), including helper functions
 *                  that `def` is passed to.  Many kgjs constructors are untyped
 *                  (`constructor(def)`), so this is the only source for them.
 *   C. VIEW      - the authoring object is handed to the rendering layer
 *                  (`this.type = 'Point'` -> `new KG.Point(def)`), so the properties
 *                  of the matching `KG.*Definition` interface and of the KG
 *                  constructor chain (`setProperties(def,'updatables',[...])`)
 *                  are authorable too.
 *
 * Rules the generator applies (all derived from the source, none from the documentation):
 *
 *   TYPES      string -> string|number|boolean (YAML turns `y: 5` into a number; the engine only
 *              interpolates these values into expression strings); number -> number|string and
 *              boolean -> boolean|string|number (any of them may be an expression such as
 *              "params.x"); any -> anything; T[] -> array; {a?: T} -> object; an interface ->
 *              the definition of the class whose constructor takes it; an engine class
 *              (model: Model, xScale: Scale) -> skipped, it is not data.
 *   FLOWS      `new Graph(def.graph)` / `{type: "Axis", def: def.xAxis}` make `graph` / `xAxis`
 *              refer to everything known about Graph / Axis.
 *   REQUIRED   a property is required only if (1) the authoring constructor dereferences it
 *              unconditionally (`def.controls.forEach(...)`: leaving it out throws), or (2) the
 *              interface marks it non-optional AND the constructor chain reads it AND the engine
 *              neither tests for its presence, nor defaults it, nor assigns it itself, or (3) it is
 *              handed unconditionally to `new X(value)`.
 *   NULL       a property whose presence is tested with hasOwnProperty and which is never
 *              dereferenced (or is read as `def.x || {}`) may be left blank in YAML (null).
 *   CLOSED     the strict variant adds additionalProperties:false to every class definition, to
 *              inline object types, and to objects known only from code when the value never
 *              leaves the analysed code (so the keys read are all the keys there are).
 *
 * The only hand-written knowledge is the short list of DISPATCH SITES below: the places where the
 * engine turns a key such as `Point:` into `new KGAuthor[key](def)`.  The generator checks that
 * every `new KGAuthor[...]` / `new KG[...]` expression in the source is one it knows about, and
 * warns otherwise.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const ts = require('typescript');

// ----------------------------------------------------------------------------
// 0. Command line
// ----------------------------------------------------------------------------

function parseArgs(argv) {
    const args = {repo: null, out: null, declaredOnly: false, naiveRequired: false};
    for (let i = 2; i < argv.length; i++) {
        if (argv[i] === '--repo') args.repo = argv[++i];
        else if (argv[i] === '--out') args.out = argv[++i];
        // diagnostic variant: drop every property that is known ONLY because the code reads it (no
        // interface declares it).  Validating the docs against it lists what the interfaces are missing.
        else if (argv[i] === '--declared-only') args.declaredOnly = true;
        // diagnostic variant: make every non-optional interface member `required`, as a plain
        // interface-to-schema converter would.  Shows how unreliable those markers are in kgjs.
        else if (argv[i] === '--naive-required') args.naiveRequired = true;
        else if (argv[i] === '--help' || argv[i] === '-h') {
            console.log('usage: node generate.js [--repo <kgjs checkout>] [--out <dir>] [--declared-only] [--naive-required]');
            process.exit(0);
        } else {
            console.error('unknown argument: ' + argv[i]);
            process.exit(2);
        }
    }
    // default: this script lives in <repo>/tools/schema/
    args.repo = path.resolve(args.repo || process.env.KGJS_REPO || path.join(__dirname, '..', '..'));
    args.out = path.resolve(args.out || path.join(__dirname, '..', '..', 'schema'));
    return args;
}

const ARGS = parseArgs(process.argv);
const SRC_ROOT = path.join(ARGS.repo, 'src', 'ts');
const ENTRY = path.join(SRC_ROOT, 'kg.ts');

if (!fs.existsSync(ENTRY)) {
    console.error('Cannot find ' + ENTRY + '\nPass the kgjs checkout with --repo <path>.');
    process.exit(2);
}

function gitCommit(repo) {
    try {
        return childProcess.execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD'], {encoding: 'utf8'}).trim();
    } catch (e) {
        return 'unknown';
    }
}

const warnings = [];
function warn(msg) {
    warnings.push(msg);
}

// ----------------------------------------------------------------------------
// 1. Load every source file reachable from src/ts/kg.ts through
//    `/// <reference path="..."/>` comments (this is how kgjs is compiled: one
//    outFile, no imports).
// ----------------------------------------------------------------------------

function loadSources(entry) {
    const files = new Map(); // absolute path -> ts.SourceFile
    const queue = [entry];
    while (queue.length) {
        const file = queue.shift();
        if (files.has(file)) continue;
        if (!fs.existsSync(file)) continue;               // e.g. node_modules/@types/d3
        if (!file.startsWith(SRC_ROOT)) continue;         // stay inside src/ts
        const text = fs.readFileSync(file, 'utf8');
        const sf = ts.createSourceFile(file, text, ts.ScriptTarget.ES2018, /*setParentNodes*/ true);
        files.set(file, sf);
        for (const ref of sf.referencedFiles) {
            queue.push(path.resolve(path.dirname(file), ref.fileName));
        }
    }
    return files;
}

const SOURCES = loadSources(ENTRY);

function rel(file) {
    return path.relative(ARGS.repo, file).split(path.sep).join('/');
}

function lineOf(node) {
    const sf = node.getSourceFile();
    return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
}

function where(node) {
    return rel(node.getSourceFile().fileName) + ':' + lineOf(node);
}

// ----------------------------------------------------------------------------
// 2. Index declarations: interfaces, classes, functions and import aliases of the
//    two namespaces (`module KG` = rendering layer, `module KGAuthor` = authoring
//    layer).
// ----------------------------------------------------------------------------

const INTERFACES = new Map(); // 'KGAuthor.PointDefinition' -> {ns, name, decls: [InterfaceDeclaration]}
const CLASSES = new Map();    // 'KGAuthor.Point' -> {ns, name, node, parent (qualified or null), exported}
const FUNCTIONS = new Map();  // 'KGAuthor.setFillColor' -> FunctionDeclaration
const ALIASES = new Map();    // 'KGAuthor.UnivariateFunctionDefinition' -> 'KG.UnivariateFunctionDefinition'

function isExported(node) {
    return !!(node.modifiers && node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword));
}

function indexModule(mod) {
    const ns = mod.name.text;
    if (!mod.body || !ts.isModuleBlock(mod.body)) return;
    for (const st of mod.body.statements) {
        if (ts.isInterfaceDeclaration(st)) {
            const q = ns + '.' + st.name.text;
            if (!INTERFACES.has(q)) INTERFACES.set(q, {ns, name: st.name.text, decls: []});
            INTERFACES.get(q).decls.push(st);
        } else if (ts.isClassDeclaration(st) && st.name) {
            const q = ns + '.' + st.name.text;
            if (CLASSES.has(q)) warn('class declared twice: ' + q);
            CLASSES.set(q, {ns, name: st.name.text, node: st, parent: null, exported: isExported(st)});
        } else if (ts.isFunctionDeclaration(st) && st.name) {
            FUNCTIONS.set(ns + '.' + st.name.text, st);
        } else if (ts.isImportEqualsDeclaration(st) && ts.isEntityName(st.moduleReference)) {
            ALIASES.set(ns + '.' + st.name.text, st.moduleReference.getText());
        }
    }
}

for (const sf of SOURCES.values()) {
    for (const st of sf.statements) {
        if (ts.isModuleDeclaration(st) && (st.name.text === 'KG' || st.name.text === 'KGAuthor')) indexModule(st);
    }
}

// Resolve a (possibly qualified) name written inside namespace `ns`.
function resolveName(text, ns, table) {
    if (text.indexOf('.') > -1) {
        return table.has(text) ? text : null;
    }
    if (ALIASES.has(ns + '.' + text)) {
        const target = ALIASES.get(ns + '.' + text);
        return table.has(target) ? target : null;
    }
    if (table.has(ns + '.' + text)) return ns + '.' + text;
    return null;
}

// class -> parent class
for (const c of CLASSES.values()) {
    const h = (c.node.heritageClauses || []).find(h => h.token === ts.SyntaxKind.ExtendsKeyword);
    if (h && h.types.length) {
        c.parent = resolveName(h.types[0].expression.getText(), c.ns, CLASSES);
        if (!c.parent) warn('cannot resolve parent class of ' + c.ns + '.' + c.name + ': ' + h.types[0].expression.getText());
    }
}

function classChain(q) {            // most-derived first
    const chain = [];
    const seen = new Set();
    while (q && !seen.has(q)) {
        seen.add(q);
        chain.push(q);
        q = CLASSES.get(q).parent;
    }
    return chain;
}

function descendsFrom(q, ancestor) {
    return classChain(q).indexOf(ancestor) > -1;
}

function getConstructor(q) {
    return CLASSES.get(q).node.members.find(m => ts.isConstructorDeclaration(m) && m.body) || null;
}

function getMethod(q, name) {       // look the method up along the class chain
    for (const k of classChain(q)) {
        const m = CLASSES.get(k).node.members.find(m => ts.isMethodDeclaration(m) && m.name.getText() === name && m.body);
        if (m) return {owner: k, node: m};
    }
    return null;
}

// ----------------------------------------------------------------------------
// 3. class -> definition interface
//      (1) the type annotation of the constructor's first parameter, else
//      (2) the interface called `<ClassName>Definition` in the same namespace.
//    A few KG classes take the definition as a later parameter (KG.View); we look
//    at every parameter and take the first one typed with an interface.
// ----------------------------------------------------------------------------

function ownInterface(q) {
    const c = CLASSES.get(q);
    const ctor = getConstructor(q);
    if (ctor) {
        for (const p of ctor.parameters) {
            if (p.type && ts.isTypeReferenceNode(p.type)) {
                const i = resolveName(p.type.typeName.getText(), c.ns, INTERFACES);
                if (i) return {iface: i, how: 'constructor-parameter'};
            }
        }
    }
    const byName = c.ns + '.' + c.name + 'Definition';
    if (INTERFACES.has(byName)) return {iface: byName, how: 'name-convention'};
    return {iface: null, how: 'none'};
}

function interfaceChain(q) {        // the interface and everything it extends
    const out = [];
    const seen = new Set();
    (function visit(name) {
        if (!name || seen.has(name)) return;
        seen.add(name);
        out.push(name);
        const info = INTERFACES.get(name);
        for (const d of info.decls) {
            for (const h of d.heritageClauses || []) {
                for (const t of h.types) {
                    const parent = resolveName(t.expression.getText(), info.ns, INTERFACES);
                    if (parent) visit(parent);
                    else warn('cannot resolve interface ' + t.expression.getText() + ' extended by ' + name);
                }
            }
        }
    })(q);
    return out;
}

// interface -> the class whose constructor takes it (used so that a property typed
// `LabelDefinition` gets everything we know about class Label, not just the interface)
const IFACE_TO_CLASS = new Map();
{
    const candidates = new Map();
    for (const q of CLASSES.keys()) {
        const o = ownInterface(q);
        if (!o.iface) continue;
        if (!candidates.has(o.iface)) candidates.set(o.iface, []);
        candidates.get(o.iface).push(q);
    }
    for (const [iface, list] of candidates) {
        const info = INTERFACES.get(iface);
        const wanted = info.name.replace(/Definition$/, '');
        // prefer the class with the matching name; otherwise only accept a unique owner
        const exact = list.find(q => CLASSES.get(q).name === wanted && CLASSES.get(q).ns === info.ns);
        if (exact) IFACE_TO_CLASS.set(iface, exact);
        else if (list.length === 1) IFACE_TO_CLASS.set(iface, list[0]);
    }
}

// ----------------------------------------------------------------------------
// 4. Comments -> descriptions
// ----------------------------------------------------------------------------

function cleanComment(text) {
    return text
        .replace(/^\/\*+/, '').replace(/\*+\/$/, '')
        .split('\n').map(l => l.replace(/^\s*(\/\/+|\*)\s?/, '').trim()).join(' ')
        .replace(/\s+/g, ' ').trim();
}

function commentsOf(node) {
    const sf = node.getSourceFile();
    const text = sf.text;
    const parts = [];
    const leading = ts.getLeadingCommentRanges(text, node.getFullStart()) || [];
    for (const r of leading) {
        // only comments that start on a line after the previous member (not a trailing comment of it)
        const before = text.slice(0, r.pos);
        const lastNl = before.lastIndexOf('\n');
        if (before.slice(lastNl + 1).trim() !== '') continue;
        parts.push(cleanComment(text.slice(r.pos, r.end)));
    }
    const trailing = ts.getTrailingCommentRanges(text, node.getEnd()) || [];
    for (const r of trailing) parts.push(cleanComment(text.slice(r.pos, r.end)));
    return parts.filter(Boolean).join(' ');
}

// ----------------------------------------------------------------------------
// 5. Def-flow analysis: which properties does a function read from its `def`
//    parameter?
// ----------------------------------------------------------------------------

const NOT_PROPERTIES = new Set(['length', 'toString', 'prototype', 'constructor']);
const ARRAY_CALLBACK_METHODS = new Set(['forEach', 'map', 'filter', 'some', 'every']);

function pathKey(p) {
    return JSON.stringify(p);
}

function newResult() {
    return {
        reads: new Map(),        // pathKey -> {path, sites: [..], default, hasDefault, typeHints:Set, updatable, constant}
        writes: new Set(),       // pathKey
        flows: [],               // {path, merged, target: {kind, name}, unconditional, site}
        thisFields: new Map(),   // field name -> def paths, from `this.pts = def.pts`
        typeAssignments: [],     // string literals assigned to this.type
        guarded: false           // `def = def || {}`
    };
}

function addRead(result, p, site, extra) {
    if (!p.length) {
        // the def itself (or a value passed into a helper as a plain argument) is tested: `if (good == 2)`
        if (extra && extra.guarded) result.rootGuarded = true;
        return;
    }
    if (p[0] === '[]') return;          // `def[someVariable]`: a computed key, not a property name
    if (p.some(seg => NOT_PROPERTIES.has(seg))) return;
    const k = pathKey(p);
    if (!result.reads.has(k)) result.reads.set(k, {path: p, sites: [], typeHints: new Set(), hasDefault: false});
    const r = result.reads.get(k);
    if (site && r.sites.indexOf(site) < 0 && r.sites.length < 3) r.sites.push(site);
    if (extra) {
        if (extra.hasDefault && !r.hasDefault) { r.hasDefault = true; r.default = extra.default; r.defaultIsLiteral = extra.defaultIsLiteral; }
        if (extra.typeHint) r.typeHints.add(extra.typeHint);
        if (extra.updatable) r.updatable = true;
        if (extra.constant) r.constant = true;
        if (extra.guarded) r.guarded = true;
        if (extra.presenceTested) r.presenceTested = true;
        if (extra.dereferenced) r.dereferenced = true;
        if (extra.nullTolerant) r.nullTolerant = true;
        if (extra.mustExist) r.mustExist = true;
        if (extra.escapes) r.escapes = true;
    }
}

function mergeResult(into, from, prefixes, callIsUnconditional) {
    // `from` was computed relative to a root that corresponds to every path in `prefixes`
    for (const prefix of prefixes) {
        for (const r of from.reads.values()) {
            const p = prefix.concat(r.path);
            r.sites.forEach(s => addRead(into, p, s));
            addRead(into, p, null, {hasDefault: r.hasDefault, default: r.default, defaultIsLiteral: r.defaultIsLiteral, updatable: r.updatable, constant: r.constant,
                guarded: r.guarded, presenceTested: r.presenceTested, dereferenced: r.dereferenced, nullTolerant: r.nullTolerant,
                mustExist: r.mustExist && !!callIsUnconditional, escapes: r.escapes});
            r.typeHints.forEach(h => addRead(into, p, null, {typeHint: h}));
        }
        if (from.rootGuarded) addRead(into, prefix, null, {guarded: true});
        for (const w of from.writes) into.writes.add(pathKey(prefix.concat(JSON.parse(w))));
        for (const f of from.flows) into.flows.push(Object.assign({}, f, {path: prefix.concat(f.path), merged: f.merged}));
    }
}

function literalValue(node) {
    if (!node) return undefined;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(node.operand)) return -Number(node.operand.text);
    return undefined;
}

function calleeName(call) {
    const e = call.expression;
    if (ts.isIdentifier(e)) return e.text;
    if (ts.isPropertyAccessExpression(e)) return e.name.text;
    return null;
}

function calleeQualifier(call) {
    const e = call.expression;
    if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression)) return e.expression.text;
    return null;
}

// selector functions: `def = extractTypeAndDef(def); if (def.type == 'CobbDouglas') return new CobbDouglasFunction(def.def) ...`
const SELECTORS = new Map(); // 'KGAuthor.getUtilityFunction' -> {site, options: [{keys: ['CobbDouglas'], cls: 'KGAuthor.CobbDouglasFunction'}]}
for (const [q, fn] of FUNCTIONS) {
    if (!fn.body || !fn.parameters.length) continue;
    const ns = q.split('.')[0];
    const param = fn.parameters[0].name.getText();
    let usesExtract = false;
    const options = [];
    (function visit(node) {
        if (ts.isCallExpression(node) && calleeName(node) === 'extractTypeAndDef' && node.arguments.length && node.arguments[0].getText() === param) usesExtract = true;
        if (ts.isIfStatement(node)) {
            const keys = [];
            (function cond(e) {
                if (ts.isParenthesizedExpression(e)) return cond(e.expression);
                if (ts.isBinaryExpression(e)) {
                    const op = e.operatorToken.kind;
                    if (op === ts.SyntaxKind.BarBarToken) { cond(e.left); cond(e.right); return; }
                    if ((op === ts.SyntaxKind.EqualsEqualsToken || op === ts.SyntaxKind.EqualsEqualsEqualsToken) &&
                        e.left.getText() === param + '.type' && literalValue(e.right) !== undefined) keys.push(literalValue(e.right));
                }
            })(node.expression);
            let cls = null;
            (function findNew(n) {
                if (ts.isNewExpression(n) && n.arguments && n.arguments.length && n.arguments[0].getText() === param + '.def') {
                    cls = resolveName(n.expression.getText().replace(/^KGAuthor\./, ''), ns, CLASSES);
                }
                if (!ts.isIfStatement(n) || n === node) ts.forEachChild(n, c => { if (c !== node.elseStatement) findNew(c); });
            })(node.thenStatement);
            if (keys.length && cls) options.push({keys, cls});
        }
        ts.forEachChild(node, visit);
    })(fn.body);
    if (usesExtract && options.length) SELECTORS.set(q, {site: where(fn), options});
}

// methods of KGAuthor classes by name: used when def is handed to a method of another object,
// e.g. `utilityFunction.levelCurve(def, graph)`; we cannot know the receiver's class without the
// type checker, so every KGAuthor method with that name is followed (an over-approximation).
const METHODS_BY_NAME = new Map();
for (const [q, c] of CLASSES) {
    if (c.ns !== 'KGAuthor') continue;
    for (const m of c.node.members) {
        if (!ts.isMethodDeclaration(m) || !m.body) continue;
        const n = m.name.getText();
        if (!METHODS_BY_NAME.has(n)) METHODS_BY_NAME.set(n, []);
        METHODS_BY_NAME.get(n).push({owner: q, node: m});
    }
}

// method name -> every KGAuthor class on which that method can be called
const RECEIVERS_BY_METHOD = new Map();
for (const name of METHODS_BY_NAME.keys()) {
    RECEIVERS_BY_METHOD.set(name, [...CLASSES.keys()].filter(q => q.startsWith('KGAuthor.') && getMethod(q, name)));
}

const ANALYSIS_CACHE = new Map();

/*
 * analyze(fnNode, rootSpec, ctx)
 *   fnNode   constructor / method / function declaration
 *   rootSpec {paramIndex} -> that parameter is the def;  {thisDef: true} -> `this.def` is the def
 *   env      Map(parameter name -> string literal) for helpers such as parseFn(def, 'fn', 'univariateFunction')
 *   ctx      {ns, classQ (for method lookup), depth}
 */
function analyze(fnNode, rootSpec, env, ctx) {
    const cacheKey = fnNode.pos + '@' + fnNode.getSourceFile().fileName + '|' + JSON.stringify(rootSpec) + '|' + JSON.stringify([...env]) + '|' + (ctx.classQ || '') + '|' + (ctx.thisDefIsRoot ? 1 : 0);
    if (ANALYSIS_CACHE.has(cacheKey)) return ANALYSIS_CACHE.get(cacheKey);
    const result = newResult();
    ANALYSIS_CACHE.set(cacheKey, result);        // (also guards against recursion)
    if (!fnNode.body || ctx.depth > 5) return result;

    const aliases = new Map();     // identifier -> [paths]
    const thisAliases = new Set();
    env = new Map(env);

    if (rootSpec.paramIndex !== undefined) {
        const p = fnNode.parameters[rootSpec.paramIndex];
        if (!p || !ts.isIdentifier(p.name)) return result;
        aliases.set(p.name.text, [[]]);
    }

    function isThis(e) {
        return e.kind === ts.SyntaxKind.ThisKeyword || (ts.isIdentifier(e) && thisAliases.has(e.text));
    }

    function keyOfElementAccess(node) {
        const a = node.argumentExpression;
        const lit = literalValue(a);
        if (typeof lit === 'string') return lit;
        if (ts.isIdentifier(a) && env.has(a.text)) return env.get(a.text);
        return '[]';
    }

    function unionPaths(a, b) {
        if (!a) return b;
        if (!b) return a;
        const out = a.slice();
        const seen = new Set(a.map(pathKey));
        for (const p of b) if (!seen.has(pathKey(p))) out.push(p);
        return out;
    }

    // Which def-paths does this expression denote (or null)?
    function resolve(e) {
        if (!e) return null;
        if (ts.isParenthesizedExpression(e) || ts.isAsExpression(e) || ts.isTypeAssertionExpression(e) || ts.isNonNullExpression(e)) return resolve(e.expression);
        if (ts.isIdentifier(e)) return aliases.get(e.text) || null;
        if (ts.isPropertyAccessExpression(e)) {
            if (e.name.text === 'def' && isThis(e.expression) && (rootSpec.thisDef || rootSpec.paramIndex !== undefined && ctx.thisDefIsRoot)) return [[]];
            if (NOT_PROPERTIES.has(e.name.text)) return null;
            // UpdateListener copies def.constants / def.updatables onto the object itself, so in a
            // rendering-layer method `this.sliders` is `def.sliders`
            if (ctx.thisProps && isThis(e.expression) && ctx.thisProps.has(e.name.text)) return [[e.name.text]];
            if (ctx.thisFields && isThis(e.expression) && ctx.thisFields.has(e.name.text)) return ctx.thisFields.get(e.name.text);
            const base = resolve(e.expression);
            return base ? base.map(p => p.concat(e.name.text)) : null;
        }
        if (ts.isElementAccessExpression(e)) {
            const base = resolve(e.expression);
            return base ? base.map(p => p.concat(keyOfElementAccess(e))) : null;
        }
        if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.BarBarToken) return unionPaths(resolve(e.left), resolve(e.right));
        if (ts.isCallExpression(e)) {
            const name = calleeName(e);
            if (name === 'copyJSON' && e.arguments.length) return resolve(e.arguments[0]);
            if (name === 'parse' && calleeQualifier(e) === 'JSON' && e.arguments.length && ts.isCallExpression(e.arguments[0]) &&
                calleeName(e.arguments[0]) === 'stringify') return resolve(e.arguments[0].arguments[0]);
            if (name === 'setDefaults' && e.arguments.length >= 2) return unionPaths(resolve(e.arguments[0]), resolve(e.arguments[1]));
            const fq = helperFunction(e);
            if (fq && isIdentityLike(fq) && e.arguments.length) return resolve(e.arguments[0]);
        }
        return null;
    }

    function helperFunction(call) {
        const e = call.expression;
        if (ts.isIdentifier(e)) return resolveName(e.text, ctx.ns, FUNCTIONS);
        if (ts.isPropertyAccessExpression(e) && ts.isIdentifier(e.expression) && (e.expression.text === 'KG' || e.expression.text === 'KGAuthor')) {
            return resolveName(e.expression.text + '.' + e.name.text, ctx.ns, FUNCTIONS);
        }
        return null;
    }

    function isUnconditional(node) {
        for (let n = node.parent; n && n !== fnNode.body; n = n.parent) {
            if (ts.isIfStatement(n) || ts.isConditionalExpression(n) || ts.isFunctionLike(n) || ts.isIterationStatement(n, false) ||
                ts.isTryStatement(n) || ts.isSwitchStatement(n)) return false;
            if (ts.isBinaryExpression(n) && (n.operatorToken.kind === ts.SyntaxKind.BarBarToken || n.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken)) return false;
        }
        return true;
    }

    // Is this read a test for presence?  `def.x || fallback`, `if (def.x)`, `def.x ? a : b`, `!def.x`
    function isGuardedRead(node) {
        let child = node;
        for (let n = node.parent; n && n !== fnNode.body; child = n, n = n.parent) {
            if (ts.isParenthesizedExpression(n)) continue;
            if (ts.isPrefixUnaryExpression(n) && n.operator === ts.SyntaxKind.ExclamationToken) return true;
            if (ts.isBinaryExpression(n)) {
                const op = n.operatorToken.kind;
                if ((op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.AmpersandAmpersandToken) && n.left === child) return true;
                if (op === ts.SyntaxKind.BarBarToken || op === ts.SyntaxKind.AmpersandAmpersandToken) continue;
                // `if (def.orient == 'bottom') ... else ...` : the engine branches on the value
                if (op === ts.SyntaxKind.EqualsEqualsToken || op === ts.SyntaxKind.EqualsEqualsEqualsToken ||
                    op === ts.SyntaxKind.ExclamationEqualsToken || op === ts.SyntaxKind.ExclamationEqualsEqualsToken) continue;
                return false;
            }
            if (ts.isIfStatement(n)) return n.expression === child;
            if (ts.isConditionalExpression(n)) return n.condition === child;
            return false;
        }
        return false;
    }

    function targetClass(text) {
        return resolveName(text.replace(/^KGAuthor\./, ''), ctx.ns, CLASSES);
    }

    function recordFlow(paths, target, node) {
        if (!paths) return;
        const merged = paths.length > 1 || paths.some(p => p.length === 0);
        for (const p of paths) {
            result.flows.push({path: p, merged, target, unconditional: isUnconditional(node), site: where(node)});
        }
    }

    function visit(node) {
        // --- variable declarations create aliases ---------------------------------
        if (ts.isVariableDeclaration(node) && node.initializer && ts.isIdentifier(node.name)) {
            if (node.initializer.kind === ts.SyntaxKind.ThisKeyword) thisAliases.add(node.name.text);
            const ps = resolve(node.initializer);
            if (ps) aliases.set(node.name.text, ps);
        }

        // --- assignments -------------------------------------------------------------
        if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
            const lhs = node.left;
            if (ts.isIdentifier(lhs)) {
                // `key = key || 'coordinates'` : default value of a string parameter
                if (ts.isBinaryExpression(node.right) && node.right.operatorToken.kind === ts.SyntaxKind.BarBarToken &&
                    node.right.left.getText() === lhs.text && typeof literalValue(node.right.right) === 'string') {
                    if (!env.has(lhs.text)) env.set(lhs.text, literalValue(node.right.right));
                }
                // `def = def || {}` : the constructor tolerates a missing definition
                if (aliases.has(lhs.text) && aliases.get(lhs.text).some(p => p.length === 0) && ts.isBinaryExpression(node.right) &&
                    node.right.operatorToken.kind === ts.SyntaxKind.BarBarToken && ts.isObjectLiteralExpression(node.right.right)) result.guarded = true;
                const ps = resolve(node.right);
                if (ps) aliases.set(lhs.text, ps);
                visit(node.right);
                return;
            }
            if (ts.isPropertyAccessExpression(lhs) || ts.isElementAccessExpression(lhs)) {
                if (ts.isPropertyAccessExpression(lhs) && lhs.name.text === 'type' && isThis(lhs.expression) && typeof literalValue(node.right) === 'string') {
                    result.typeAssignments.push(literalValue(node.right));
                }
                // `c.pts = def.pts || []` : the field mirrors a def property; methods read it later
                if (ts.isPropertyAccessExpression(lhs) && isThis(lhs.expression)) {
                    const rps = resolve(node.right);
                    if (rps && rps.every(p => p.length)) result.thisFields.set(lhs.name.text, rps);
                }
                const ps = resolve(lhs);
                if (ps) ps.forEach(p => { if (p.length) result.writes.add(pathKey(p)); });
                visit(lhs.expression);             // the base is still read
                if (ts.isElementAccessExpression(lhs)) visit(lhs.argumentExpression);
                visit(node.right);
                return;
            }
        }

        // --- delete def.x : not a read ---------------------------------------------
        if (ts.isDeleteExpression(node)) {
            const t = node.expression;
            if (ts.isPropertyAccessExpression(t) || ts.isElementAccessExpression(t)) { visit(t.expression); return; }
        }

        // --- typeof def.x === 'string' ----------------------------------------------
        if (ts.isBinaryExpression(node) && ts.isTypeOfExpression(node.left) && typeof literalValue(node.right) === 'string') {
            const ps = resolve(node.left.expression);
            const hint = literalValue(node.right);
            if (ps && ['string', 'number', 'boolean'].indexOf(hint) > -1) ps.forEach(p => addRead(result, p, where(node), {typeHint: hint}));
        }

        // --- a def value that is handed on as a whole (argument, return value, stored somewhere):
        //     its keys may be used by code we do not follow, so we must not claim to know them all
        if ((ts.isIdentifier(node) && aliases.has(node.text)) || ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
            const par = node.parent;
            const isBase = par && (ts.isPropertyAccessExpression(par) || ts.isElementAccessExpression(par)) && par.expression === node;
            const isDecl = par && ((ts.isVariableDeclaration(par) || ts.isParameter(par)) && par.name === node);
            const isAliasInit = par && ts.isVariableDeclaration(par) && par.initializer === node;
            const isAssignTarget = par && ts.isBinaryExpression(par) && par.operatorToken.kind === ts.SyntaxKind.EqualsToken && par.left === node;
            const isAliasAssign = par && ts.isBinaryExpression(par) && par.operatorToken.kind === ts.SyntaxKind.EqualsToken && par.right === node && ts.isIdentifier(par.left);
            const isTest = par && (ts.isIfStatement(par) || ts.isConditionalExpression(par) || ts.isPrefixUnaryExpression(par) || ts.isTypeOfExpression(par) ||
                (ts.isBinaryExpression(par) && par.operatorToken.kind !== ts.SyntaxKind.EqualsToken));
            const isDelete = par && ts.isDeleteExpression(par);
            const isCalleeHere = par && ts.isCallExpression(par) && par.expression === node;
            if (!isCalleeHere && !isBase && !isDecl && !isAliasInit && !isAssignTarget && !isAliasAssign && !isTest && !isDelete) {
                const ps = resolve(node);
                if (ps) ps.forEach(p => addRead(result, p, null, {escapes: true}));
            }
        }

        // --- a bare identifier that stands for a def path, used as a condition -----------
        if (ts.isIdentifier(node) && aliases.has(node.text) && node.parent && !ts.isPropertyAccessExpression(node.parent) &&
            !ts.isElementAccessExpression(node.parent) && !ts.isVariableDeclaration(node.parent) && !ts.isParameter(node.parent) && isGuardedRead(node)) {
            aliases.get(node.text).forEach(p => addRead(result, p, null, {guarded: true}));
        }

        // --- property reads ----------------------------------------------------------
        if (ts.isPropertyAccessExpression(node) || ts.isElementAccessExpression(node)) {
            const isCallee = node.parent && ts.isCallExpression(node.parent) && node.parent.expression === node;
            if (!isCallee) {
                const ps = resolve(node);
                const orEmpty = node.parent && ts.isBinaryExpression(node.parent) && node.parent.left === node &&
                    node.parent.operatorToken.kind === ts.SyntaxKind.BarBarToken && ts.isObjectLiteralExpression(node.parent.right);
                if (ps) ps.forEach(p => addRead(result, p, where(node), {guarded: isGuardedRead(node), nullTolerant: orEmpty}));
            }
            // def.x.y or def.x.forEach(...): def.x is dereferenced, so it cannot be null
            const baseps = resolve(node.expression);
            // ... and if that happens unconditionally, leaving def.x out makes the constructor throw
            if (baseps) baseps.forEach(p => addRead(result, p, null, {dereferenced: true, mustExist: isUnconditional(node)}));
        }

        // --- calls --------------------------------------------------------------------
        if (ts.isCallExpression(node)) {
            const name = calleeName(node);
            const callee = node.expression;

            // def.hasOwnProperty('x')
            if (name === 'hasOwnProperty' && ts.isPropertyAccessExpression(callee) && node.arguments.length === 1) {
                const base = resolve(callee.expression);
                const lit = literalValue(node.arguments[0]);
                const key = typeof lit === 'string' ? lit : (ts.isIdentifier(node.arguments[0]) && env.has(node.arguments[0].text) ? env.get(node.arguments[0].text) : null);
                if (base && key) base.forEach(p => addRead(result, p.concat(key), where(node), {guarded: true, presenceTested: true}));
            }

            // KG.setDefaults(def, {x: 1, ...})
            if (name === 'setDefaults' && node.arguments.length >= 2) {
                const base = resolve(node.arguments[0]);
                const obj = node.arguments[1];
                if (base && ts.isObjectLiteralExpression(obj)) {
                    (function defaults(prefixes, o) {
                        for (const prop of o.properties) {
                            if (!ts.isPropertyAssignment(prop) && !ts.isShorthandPropertyAssignment(prop)) continue;
                            const key = prop.name.getText().replace(/^['"]|['"]$/g, '');
                            const v = ts.isPropertyAssignment(prop) ? literalValue(prop.initializer) : undefined;
                            prefixes.forEach(p => addRead(result, p.concat(key), where(prop), {hasDefault: true, default: v, defaultIsLiteral: v !== undefined}));
                            if (ts.isPropertyAssignment(prop) && ts.isObjectLiteralExpression(prop.initializer)) {
                                defaults(prefixes.map(p => p.concat(key)), prop.initializer);
                            }
                        }
                    })(base, obj);
                }
            }

            // setProperties(def, 'updatables', ['x', 'y'])
            if (name === 'setProperties' && node.arguments.length === 3 && ts.isArrayLiteralExpression(node.arguments[2])) {
                const base = resolve(node.arguments[0]);
                const kind = literalValue(node.arguments[1]);
                // setProperties creates/extends def.updatables, def.constants, def.colorAttributes itself
                if (base && typeof kind === 'string') base.forEach(p => result.writes.add(pathKey(p.concat(kind))));
                if (base) {
                    for (const el of node.arguments[2].elements) {
                        const key = literalValue(el);
                        if (typeof key !== 'string') continue;
                        base.forEach(p => addRead(result, p.concat(key), where(el), {updatable: kind === 'updatables', constant: kind === 'constants'}));
                    }
                }
            }

            // def.nodes.forEach(function (nodeDef) { ... })
            if (ts.isPropertyAccessExpression(callee) && ARRAY_CALLBACK_METHODS.has(callee.name.text) && node.arguments.length) {
                const base = resolve(callee.expression);
                const cb = node.arguments[0];
                if (base && ts.isFunctionLike(cb) && cb.parameters.length && ts.isIdentifier(cb.parameters[0].name)) {
                    aliases.set(cb.parameters[0].name.text, base.map(p => p.concat('[]')));
                }
            }

            // this.extractCoordinates('a', 'x1', 'y1') : a method of the same object that reads this.def.
            // ctx.classQ is the concrete class being described, so an overriding method is found first
            // (CobbDouglasFunction: levelCurve -> this.levelSet(def) -> CobbDouglasFunction.levelSet).
            if (ts.isPropertyAccessExpression(callee) && isThis(callee.expression) && ctx.classQ) {
                const m = getMethod(ctx.classQ, callee.name.text);
                if (m) {
                    const menv = new Map();
                    m.node.parameters.forEach((p, i) => {
                        const lit = literalValue(node.arguments[i]);
                        if (typeof lit === 'string' && ts.isIdentifier(p.name)) menv.set(p.name.text, lit);
                    });
                    const sctx = {ns: ctx.ns, classQ: ctx.classQ, depth: ctx.depth + 1, thisProps: ctx.thisProps, thisFields: ctx.thisFields, thisDefIsRoot: ctx.thisDefIsRoot};
                    if (ctx.thisDefIsRoot || rootSpec.thisDef) {
                        mergeResult(result, analyze(m.node, {thisDef: true}, menv, sctx), [[]], isUnconditional(node));
                    }
                    // ... and def values handed over as arguments: this.helper(def.good)
                    node.arguments.forEach((arg, i) => {
                        const ps = resolve(arg);
                        if (!ps || !m.node.parameters[i]) return;
                        mergeResult(result, analyze(m.node, {paramIndex: i}, menv, Object.assign({}, sctx, {thisDefIsRoot: false})), ps, isUnconditional(node));
                    });
                }
            }

            // other.method(def, ...) : we do not know the receiver's class without the type checker, so
            // every KGAuthor class that has (or inherits) a method of that name is followed
            // (`utilityFunction.levelCurve(def, graph)` -> CobbDouglasFunction, CESFunction, ...).
            if (ts.isPropertyAccessExpression(callee) && !isThis(callee.expression) && !helperFunction(node) && METHODS_BY_NAME.has(name) &&
                ctx.ns === 'KGAuthor' && name !== 'parse' && name !== 'parseSelf' && name !== 'addSecondGraph') {
                node.arguments.forEach((arg, i) => {
                    const ps = resolve(arg);
                    if (!ps) return;
                    for (const receiver of RECEIVERS_BY_METHOD.get(name)) {
                        const m = getMethod(receiver, name);
                        if (!m || !m.node.parameters[i]) continue;
                        const sub = analyze(m.node, {paramIndex: i}, new Map(), {ns: 'KGAuthor', classQ: receiver, depth: ctx.depth + 1});
                        mergeResult(result, sub, ps, false);
                    }
                });
            }

            // helper(def, ...) : follow def into KGAuthor/KG helper functions
            const fq = helperFunction(node);
            if (fq && ['copyJSON', 'setDefaults', 'setProperties'].indexOf(name) < 0) {
                node.arguments.forEach((arg, i) => {
                    const ps = resolve(arg);
                    if (!ps) return;
                    if (SELECTORS.has(fq)) { recordFlow(ps, {kind: 'selector', name: fq}, node); return; }
                    const fn = FUNCTIONS.get(fq);
                    const henv = new Map();
                    fn.parameters.forEach((p, j) => {
                        const lit = literalValue(node.arguments[j]);
                        if (typeof lit === 'string' && ts.isIdentifier(p.name)) henv.set(p.name.text, lit);
                    });
                    const sub = analyze(fn, {paramIndex: i}, henv, {ns: fq.split('.')[0], classQ: null, depth: ctx.depth + 1});
                    mergeResult(result, sub, ps, isUnconditional(node));
                });
            }
        }

        // --- new Graph(graphDef) -------------------------------------------------------
        if (ts.isNewExpression(node) && node.arguments && node.arguments.length && !ts.isElementAccessExpression(node.expression)) {
            const cls = targetClass(node.expression.getText());
            if (cls) recordFlow(resolve(node.arguments[0]), {kind: 'class', name: cls}, node);
        }

        // --- {type: "Controls", def: def['leftControls']} --------------------------------
        if (ts.isObjectLiteralExpression(node)) {
            let typeLit = null, defExpr = null;
            for (const prop of node.properties) {
                if (!ts.isPropertyAssignment(prop)) continue;
                const key = prop.name.getText().replace(/^['"]|['"]$/g, '');
                if (key === 'type' && typeof literalValue(prop.initializer) === 'string') typeLit = literalValue(prop.initializer);
                if (key === 'def') defExpr = prop.initializer;
            }
            if (typeLit && defExpr) {
                const cls = CLASSES.has('KGAuthor.' + typeLit) ? 'KGAuthor.' + typeLit : (CLASSES.has('KG.' + typeLit) ? 'KG.' + typeLit : null);
                if (cls) recordFlow(resolve(defExpr), {kind: 'class', name: cls}, node);
            }
        }

        ts.forEachChild(node, visit);
    }

    visit(fnNode.body);
    return result;
}

const IDENTITY_CACHE = new Map();
function isIdentityLike(fq) {
    // a helper such as setFillColor(def) that returns (a defaulted copy of) its first argument
    if (IDENTITY_CACHE.has(fq)) return IDENTITY_CACHE.get(fq);
    IDENTITY_CACHE.set(fq, false);
    const fn = FUNCTIONS.get(fq);
    let identity = false;
    if (fn && fn.body && fn.parameters.length && ts.isIdentifier(fn.parameters[0].name)) {
        const p = fn.parameters[0].name.text;
        const returns = [];
        (function visit(n) {
            if (ts.isReturnStatement(n) && n.expression) returns.push(n.expression);
            if (!ts.isFunctionLike(n) || n === fn) ts.forEachChild(n, visit);
        })(fn.body);
        identity = returns.length > 0 && returns.every(function ok(e) {
            if (ts.isIdentifier(e)) return e.text === p;
            if (ts.isCallExpression(e) && calleeName(e) === 'setDefaults' && e.arguments.length) return ok(e.arguments[0]);
            return false;
        });
    }
    IDENTITY_CACHE.set(fq, identity);
    return identity;
}

// Analysis of one class: its own constructor only (the chain is combined later).
function analyzeClass(q, concreteQ) {
    const c = CLASSES.get(q);
    const ctor = getConstructor(q);
    if (!ctor) return newResult();
    // which parameter is the def?  the one typed with the interface, else the first
    let idx = 0;
    ctor.parameters.forEach((p, i) => {
        if (p.type && ts.isTypeReferenceNode(p.type) && resolveName(p.type.typeName.getText(), c.ns, INTERFACES) && idx === 0) idx = i;
    });
    return analyze(ctor, {paramIndex: idx}, new Map(), {ns: c.ns, classQ: concreteQ || q, depth: 0, thisDefIsRoot: true});
}

// Other methods of a class (draw, redraw, parseSelf, ...) sometimes read `this.def.x` as well.
function analyzeMethods(q, concreteQ) {
    const c = CLASSES.get(q);
    const out = newResult();
    const chain = classChain(concreteQ || q);
    let thisProps = null;
    if (c.ns === 'KG') {
        thisProps = new Set();
        chain.forEach(k => analyzeClass(k).reads.forEach(r => { if (r.path.length === 1 && (r.updatable || r.constant)) thisProps.add(r.path[0]); }));
    }
    const thisFields = new Map();
    chain.slice().reverse().forEach(k => analyzeClass(k).thisFields.forEach((v, name) => thisFields.set(name, v)));
    for (const m of c.node.members) {
        if (!ts.isMethodDeclaration(m) || !m.body) continue;
        mergeResult(out, analyze(m, {thisDef: true}, new Map(), {ns: c.ns, classQ: concreteQ || q, depth: 1, thisProps, thisFields, thisDefIsRoot: true}), [[]], false);
    }
    return out;
}

// ----------------------------------------------------------------------------
// 6. TypeScript type -> JSON Schema
// ----------------------------------------------------------------------------

const CLOSED = '__closed';       // marks object schemas that get additionalProperties:false in the strict variant
const PRUNED = [];
const REQUESTED = [];            // definitions that still have to be built: {name, build}
const DEFINITIONS = {};
const SKIPPED_MEMBERS = [];      // interface members that cannot be expressed in JSON (class instances, functions)

function ref(name) {
    return {$ref: '#/definitions/' + name};
}

// Variants of a class definition:
//   KGAuthor.Label            everything the class requires
//   KGAuthor.Label.partial    nothing required (the value is merged with its parent's definition first)
//   KGAuthor.Tree.omit-position   `position` not required (the layout that embeds the tree supplies it)
function requestClass(q, partial, omit) {
    omit = (omit || []).slice().sort();
    const name = q + (partial ? '.partial' : omit.length ? '.omit-' + omit.join('-') : '');
    if (!(name in DEFINITIONS)) {
        DEFINITIONS[name] = null;
        REQUESTED.push({name, q, partial, omit, kind: 'class'});
    }
    return ref(name);
}

function requestInterface(q) {
    if (IFACE_TO_CLASS.has(q)) return requestClass(IFACE_TO_CLASS.get(q), false);
    const name = 'interface.' + q;
    if (!(name in DEFINITIONS)) {
        DEFINITIONS[name] = null;
        REQUESTED.push({name, q, kind: 'interface'});
    }
    return ref(name);
}

function requestSelector(fq) {
    const name = 'selector.' + fq;
    if (!(name in DEFINITIONS)) {
        DEFINITIONS[name] = null;
        REQUESTED.push({name, q: fq, kind: 'selector'});
    }
    return ref(name);
}

// number / boolean values may always be replaced by an expression string such as
// "params.x" or "calcs.foo > 3": see UpdateListener.updateDef (src/ts/model/updateListener.ts)
// and the string arithmetic in KGAuthor/parsers/parsingFunctions.ts (addDefs, multiplyDefs...).

function typeToSchema(t, ns, ctxLabel) {
    if (!t) return {};
    switch (t.kind) {
        case ts.SyntaxKind.AnyKeyword:
        case ts.SyntaxKind.UnknownKeyword:
            return {};
        case ts.SyntaxKind.StringKeyword:
            // YAML turns `y: 5` or `show: true` into a number / boolean even where the interface says
            // `string` (the engine only ever interpolates these values into expression strings).
            return {type: ['string', 'number', 'boolean']};
        case ts.SyntaxKind.NumberKeyword:
            return {type: ['number', 'string']};
        case ts.SyntaxKind.BooleanKeyword:
            return {type: ['boolean', 'string', 'number']};
        case ts.SyntaxKind.NullKeyword:
            return {type: 'null'};
        case ts.SyntaxKind.ObjectKeyword:
            return {type: 'object'};
    }
    if (ts.isParenthesizedTypeNode(t)) return typeToSchema(t.type, ns, ctxLabel);
    if (ts.isArrayTypeNode(t)) {
        const items = typeToSchema(t.elementType, ns, ctxLabel);
        return items === null ? null : (Object.keys(items).length ? {type: 'array', items} : {type: 'array'});
    }
    if (ts.isLiteralTypeNode(t)) {
        const v = literalValue(t.literal);
        return v === undefined ? {} : {enum: [v]};
    }
    if (ts.isUnionTypeNode(t)) {
        const parts = t.types.map(x => typeToSchema(x, ns, ctxLabel)).filter(x => x !== null);
        return mergeSchemas(parts);
    }
    if (ts.isTypeLiteralNode(t)) {
        const s = {type: 'object', properties: {}};
        s[CLOSED] = true;
        const required = [];
        for (const m of t.members) {
            if (!ts.isPropertySignature(m)) continue;
            const ms = typeToSchema(m.type, ns, ctxLabel);
            if (ms === null) continue;
            s.properties[m.name.getText()] = ms;
            if (!m.questionToken) required.push(m.name.getText());
        }
        if (!Object.keys(s.properties).length) return {type: 'object'};   // `{}` in TS: any object
        if (required.length) s.required = required;
        return s;
    }
    if (ts.isTypeReferenceNode(t)) {
        const text = t.typeName.getText();
        if (text === 'Array' && t.typeArguments && t.typeArguments.length === 1) {
            const items = typeToSchema(t.typeArguments[0], ns, ctxLabel);
            return items === null ? null : {type: 'array', items};
        }
        const iface = resolveName(text, ns, INTERFACES);
        if (iface === 'KG.TypeAndDef') return ref('typeAndDef');
        if (iface) return requestInterface(iface);
        if (resolveName(text, ns, CLASSES)) return null;     // an engine object (Model, Scale, ...): not authorable
        warn('unresolved type "' + text + '" in ' + ctxLabel + ' -> treated as any');
        return {};
    }
    if (ts.isFunctionTypeNode(t)) return null;
    warn('unsupported type syntax "' + t.getText() + '" in ' + ctxLabel + ' -> treated as any');
    return {};
}

function isAny(s) {
    return s && typeof s === 'object' && Object.keys(s).filter(k => k !== 'description' && k !== '$comment' && k !== 'default').length === 0;
}

function mergeSchemas(list) {
    const uniq = [];
    const seen = new Set();
    for (const s of list) {
        if (s === null || s === undefined) continue;
        const k = JSON.stringify(s);
        if (!seen.has(k)) { seen.add(k); uniq.push(s); }
    }
    if (!uniq.length) return {};
    if (uniq.some(isAny)) return {};
    if (uniq.length === 1) return uniq[0];
    // collapse plain {type: ...} schemas into one
    const plain = uniq.filter(s => Object.keys(s).length === 1 && s.type !== undefined);
    const rest = uniq.filter(s => !(Object.keys(s).length === 1 && s.type !== undefined));
    const out = rest.slice();
    if (plain.length) {
        const types = [];
        plain.forEach(s => [].concat(s.type).forEach(x => { if (types.indexOf(x) < 0) types.push(x); }));
        out.unshift({type: types.length === 1 ? types[0] : types});
    }
    return out.length === 1 ? out[0] : {anyOf: out};
}

// ----------------------------------------------------------------------------
// 7. Dispatch sites (the only hand-written knowledge; each is checked against the source)
// ----------------------------------------------------------------------------

const DISPATCH_SITES = [
    {file: 'src/ts/KGAuthor/parsers/parsingFunctions.ts', within: 'parse', expr: 'KGAuthor[obj.type]', meaning: 'top-level `objects`, `layout`, `explanation`, `schema` ({type, def} form only)'},
    {file: 'src/ts/KGAuthor/positionedObjects/graph.ts', within: 'Graph', expr: 'KGAuthor[obj.type]', meaning: 'items of a graph\'s `objects`'},
    {file: 'src/ts/KGAuthor/positionedObjects/graph.ts', within: 'Graph', expr: 'KGAuthor[lookup.markerType]', meaning: 'internal (arrow markers); not authorable'},
    {file: 'src/ts/KGAuthor/graphObjects/graphObject.ts', within: 'GraphObject', expr: 'KGAuthor[shapeType]', meaning: 'items of `clipPaths` (single-key form only)'},
    {file: 'src/ts/KGAuthor/graphObjects/rectangle.ts', within: 'Overlap', expr: 'KGAuthor[shapeType]', meaning: 'items of Overlap `shapes` (single-key form only)'},
    {file: 'src/ts/KGAuthor/positionedObjects/mathboxContainer.ts', within: 'MathboxContainer', expr: 'KGAuthor[obj.type]', meaning: 'items of a mathbox\'s `objects` ("Mathbox" prefix optional)'},
    {file: 'src/ts/view/view.ts', within: 'View', expr: 'KG[td.type]', meaning: 'internal: renders parsed objects'},
    {file: 'src/ts/view/divObjects/mathbox.ts', within: 'Mathbox', expr: 'KG[td.type]', meaning: 'internal: renders parsed mathbox objects'},
    {file: 'src/ts/view/divObjects/positionedDiv.ts', within: 'PositionedDiv', expr: 'KG[child.type]', meaning: 'items of DivContainer `children` ({type, def} form, rendering-layer classes)'}
];

function checkDispatchSites() {
    const found = [];
    for (const sf of SOURCES.values()) {
        (function visit(n) {
            if (ts.isNewExpression(n) && ts.isElementAccessExpression(n.expression) && ts.isIdentifier(n.expression.expression) &&
                (n.expression.expression.text === 'KG' || n.expression.expression.text === 'KGAuthor')) {
                let owner = n.parent;
                while (owner && !(ts.isClassDeclaration(owner) || (ts.isFunctionDeclaration(owner) && ts.isModuleBlock(owner.parent)))) owner = owner.parent;
                found.push({file: rel(sf.fileName), line: lineOf(n), within: owner && owner.name ? owner.name.text : '?', expr: n.expression.getText()});
            }
            ts.forEachChild(n, visit);
        })(sf);
    }
    const known = DISPATCH_SITES.map(d => d.file + '|' + d.within + '|' + d.expr);
    const seenKnown = new Set();
    const unknown = [];
    for (const f of found) {
        const k = f.file + '|' + f.within + '|' + f.expr;
        if (known.indexOf(k) > -1) seenKnown.add(k); else unknown.push(f);
    }
    const missing = known.filter(k => !seenKnown.has(k));
    unknown.forEach(f => warn('UNKNOWN DISPATCH SITE ' + f.file + ':' + f.line + ' ' + f.expr + ' (in ' + f.within + '): the schema may not cover this context'));
    missing.forEach(k => warn('dispatch site no longer present in source: ' + k));
    return {found, unknown, missing};
}

// ----------------------------------------------------------------------------
// 8. Build the definition of a class
// ----------------------------------------------------------------------------

const CLASS_INFO = new Map();    // q -> collected info, for reports

function viewTypeOf(q) {
    // the rendering-layer class this authoring class turns into: `this.type = 'Point'`
    for (const k of classChain(q)) {
        const a = analyzeClass(k).typeAssignments;
        if (a.length) return {type: a[a.length - 1], setBy: k};
    }
    return null;
}

function collectClass(q) {
    if (CLASS_INFO.has(q)) return CLASS_INFO.get(q);
    const c = CLASSES.get(q);
    const info = {
        q, ns: c.ns, name: c.name, site: where(c.node),
        chain: classChain(q),
        own: ownInterface(q),
        interfaces: [],            // every interface contributing declared properties
        view: null,
        props: new Map(),          // name -> {schemas: [], description, sources: [], default, updatable, children: tree}
        tree: {props: new Map(), items: null},   // nested code reads
        flows: [],
        writes: new Set(),
        defaults: new Set(),
        tsRequired: new Set(),
        guarded: false,
        engineOnly: new Set(),     // members typed with an engine class (model: Model, xScale: Scale): not data
        mustExist: new Set(),      // dereferenced unconditionally by the authoring constructor chain
        authorDefaults: new Set()
    };
    CLASS_INFO.set(q, info);

    function prop(name) {
        if (!info.props.has(name)) info.props.set(name, {schemas: [], description: '', sources: [], hasDefault: false});
        return info.props.get(name);
    }

    function addDeclared(ifaceQ, authorLayer) {
        for (const iq of interfaceChain(ifaceQ)) {
            if (info.interfaces.indexOf(iq) > -1) continue;        // already contributed by a more derived class
            info.interfaces.push(iq);
            const ii = INTERFACES.get(iq);
            for (const d of ii.decls) {
                for (const m of d.members) {
                    if (!ts.isPropertySignature(m)) continue;
                    const name = m.name.getText().replace(/^['"]|['"]$/g, '');
                    const s = typeToSchema(m.type, ii.ns, iq + '.' + name);
                    if (s === null) {
                        SKIPPED_MEMBERS.push({member: iq + '.' + name, type: m.type.getText(), site: where(m)});
                        info.engineOnly.add(name);
                        continue;
                    }
                    const p = prop(name);
                    p.schemas.push(s);
                    p.sources.push(iq);
                    const doc = commentsOf(m);
                    if (doc && !p.description) p.description = doc;
                    if (!m.questionToken && authorLayer) info.tsRequired.add(name);
                }
            }
        }
    }

    function addReads(result, label, layer) {
        for (const r of result.reads.values()) {
            const top = prop(r.path[0]);
            if (r.path.length === 1) {
                const src = 'read by ' + label + (r.sites.length ? ' (' + r.sites[0] + ')' : '');
                if (top.sources.indexOf(src) < 0) top.sources.push(src);
                if (r.mustExist && layer !== 'view') info.mustExist.add(r.path[0]);
                if (r.hasDefault && layer !== 'view') info.authorDefaults.add(r.path[0]);
                if (r.hasDefault) {
                    info.defaults.add(r.path[0]);
                    if (!top.hasDefault && r.defaultIsLiteral) { top.hasDefault = true; top.default = r.default; }
                }
                if (r.updatable) top.updatable = true;
                if (r.sites.length) top.read = true;
                if (r.guarded) top.guarded = true;
                r.typeHints.forEach(h => { top.typeHints = top.typeHints || new Set(); top.typeHints.add(h); });
            }
            // nested reads: remember them in a tree
            let node = info.tree;
            for (const seg of r.path) {
                if (seg === '[]') { node.items = node.items || {props: new Map(), items: null}; node = node.items; }
                else {
                    if (!node.props.has(seg)) node.props.set(seg, {props: new Map(), items: null, sites: [], typeHints: new Set()});
                    node = node.props.get(seg);
                }
            }
            if (node.sites) r.sites.forEach(s => { if (node.sites.indexOf(s) < 0) node.sites.push(s); });
            if (node.typeHints) r.typeHints.forEach(h => node.typeHints.add(h));
            if (r.presenceTested) node.presenceTested = true;
            if (r.nullTolerant) node.nullTolerant = true;
            if (r.escapes) node.escapes = true;
            if (r.dereferenced) node.dereferenced = true;
            if (r.hasDefault) node.hasDefault = true;
            if (r.guarded) node.guarded = true;
        }
        result.writes.forEach(w => info.writes.add(w));
        result.flows.forEach(f => info.flows.push(f));
        if (result.guarded) info.guarded = true;
    }

    // A + B: authoring layer, most-derived class first
    const isAuthor = c.ns === 'KGAuthor';
    for (const k of info.chain) {
        const o = ownInterface(k);
        if (o.iface) addDeclared(o.iface, true);
        addReads(analyzeClass(k, q), k + ' constructor', isAuthor ? 'author' : 'own');
        addReads(analyzeMethods(k, q), k + ' methods', 'view');
    }

    // C: rendering layer
    if (isAuthor) {
        const v = viewTypeOf(q);
        if (v) {
            const vq = 'KG.' + v.type;
            info.view = {type: v.type, setBy: v.setBy, cls: CLASSES.has(vq) ? vq : null};
            if (CLASSES.has(vq)) {
                for (const k of classChain(vq)) {
                    const o = ownInterface(k);
                    if (o.iface) addDeclared(o.iface, false);
                    addReads(analyzeClass(k, vq), k + ' constructor', 'view');
                    addReads(analyzeMethods(k, vq), k + ' methods', 'view');
                }
            } else {
                warn(q + ' sets type "' + v.type + '" but there is no class KG.' + v.type);
            }
        }
    }

    // A pure generator (no rendering type of its own) that hands a copy of its whole def to
    // another class accepts that class's properties too (Grid -> Segment, Points -> Point).
    if (isAuthor && !info.view) {
        info.inheritsDefOf = [];
        for (const f of info.flows) {
            if (f.path.length === 0 && f.target.kind === 'class' && f.target.name !== q && info.inheritsDefOf.indexOf(f.target.name) < 0 &&
                classChain(f.target.name).indexOf(q) < 0) info.inheritsDefOf.push(f.target.name);
        }
    }
    return info;
}

// Extra properties a class learns from its use-sites: `def.label.r` read in Line's constructor,
// where `label` flows into `new Label(...)`, makes `r` a property of Label.
const RELAXED_REQUIRED = [];   // TS says "required" but the engine copes without it
const LEARNED = new Map();   // class q -> Map(prop -> {sites})

function learnFromUseSites() {
    let changed = false;
    for (const info of CLASS_INFO.values()) {
        for (const f of info.flows) {
            if (f.target.kind !== 'class' || !f.path.length) continue;
            let node = info.tree;
            for (const seg of f.path) {
                node = seg === '[]' ? node && node.items : node && node.props.get(seg);
                if (!node) break;
            }
            if (!node) continue;
            for (const [name, child] of node.props) {
                if (!LEARNED.has(f.target.name)) LEARNED.set(f.target.name, new Map());
                const m = LEARNED.get(f.target.name);
                if (!m.has(name)) { m.set(name, {sites: [], typeHints: new Set()}); changed = true; }
                child.sites.forEach(s => { if (m.get(name).sites.indexOf(s) < 0) m.get(name).sites.push(s); });
            }
        }
    }
    return changed;
}

function compactSources(sources) {
    const declared = [], reads = [];
    sources.forEach(s => {
        const t = s.replace(/KGAuthor\./g, '').replace(/src\/ts\//g, '');
        if (/^read /.test(t)) { if (reads.length < 2) reads.push(t.replace(/^read by (\S+) (constructor|methods)/, 'read via $1')); }
        else if (declared.indexOf(t) < 0) declared.push(t);
    });
    return (declared.length ? ['declared in ' + declared.join(', ')] : []).concat(reads).join('; ');
}

function flowsByProp(info) {
    // top-level property -> [{target, merged, unconditional}], and array-item flows
    const map = new Map();
    for (const f of info.flows) {
        if (!f.path.length) continue;
        const isItem = f.path.length === 2 && f.path[1] === '[]';
        if (f.path.length !== 1 && !isItem) continue;
        const key = f.path[0] + (isItem ? '[]' : '');
        if (!map.has(key)) map.set(key, []);
        if (!map.get(key).some(x => x.target.kind === f.target.kind && x.target.name === f.target.name && x.merged === f.merged)) map.get(key).push(f);
    }
    return map;
}

// Names that the use-site itself supplies for the object it builds:
//   KG.setDefaults(def.xAxis, {min: 0, max: 10})   (PositionedObject -> Axis)
//   def.indifferenceCurve.level = ...               (EconBundle -> EconIndifferenceCurve)
function suppliedAtUseSite(info, f) {
    const out = new Set();
    let node = info.tree;
    for (const seg of f.path) node = seg === '[]' ? node && node.items : node && node.props.get(seg);
    if (node) for (const [name, child] of node.props) if (child.hasDefault || child.guarded) out.add(name);
    const prefix = JSON.stringify(f.path).slice(0, -1);
    for (const w of info.writes) {
        const wp = JSON.parse(w);
        if (wp.length === f.path.length + 1 && w.startsWith(prefix)) out.add(wp[wp.length - 1]);
    }
    return out;
}

function targetSchema(f, info) {
    if (f.target.kind === 'selector') return requestSelector(f.target.name);
    let omit = [];
    if (!f.merged && info) {
        // if the use-site supplies something the target would otherwise require, do not require it here
        const supplied = suppliedAtUseSite(info, f);
        omit = requiredOf(f.target.name).filter(n => supplied.has(n));
    }
    return requestClass(f.target.name, f.merged, omit);
}

function makeNullable(schema) {
    if (isAny(schema)) return schema;
    const s = JSON.parse(JSON.stringify(schema));
    if (s.type !== undefined && !s.$ref && !s.anyOf) {
        const t = [].concat(s.type);
        if (t.indexOf('null') < 0) t.push('null');
        s.type = t;
        return s;
    }
    const meta = {};
    ['description', 'default', '$comment'].forEach(k => { if (s[k] !== undefined) { meta[k] = s[k]; delete s[k]; } });
    return Object.assign({anyOf: (s.anyOf && Object.keys(s).length === 1 ? s.anyOf : [s]).concat([{type: 'null'}])}, meta);
}

// Combine a declared schema with what the code reads below it:
//  - keys read from an inline object type (`droplines: {vertical?: string}`) that the type does not list are added
//  - a key whose *presence* is tested with hasOwnProperty and which is never dereferenced may be left
//    blank in YAML (`vertical:` parses to null; see docs/graph-objects/point.md "Droplines")
function applyTree(schema, node) {
    if (!node) return schema;
    let s = JSON.parse(JSON.stringify(schema));
    if (s.properties && !s.$ref) {
        for (const [k, child] of node.props) {
            if (Object.prototype.hasOwnProperty.call(s.properties, k)) s.properties[k] = applyTree(s.properties[k], child);
            else s.properties[k] = applyTree({$comment: 'read at ' + (child.sites[0] || '?')}, child);
        }
    }
    if (s.type === 'array' && s.items && node.items) s.items = applyTree(s.items, node.items);
    if ((node.presenceTested && !node.dereferenced) || node.nullTolerant) s = makeNullable(s);
    return s;
}

function treeToSchema(node) {
    // schema for a value known only from the code that reads it: `def.position.x` -> {x: any}
    if (node.items && !node.props.size) {
        const items = treeToSchema(node.items);
        return Object.keys(items).length ? {type: 'array', items} : {type: 'array'};
    }
    if (!node.props.size) return {};
    const s = {type: 'object', properties: {}};
    for (const [k, child] of node.props) {
        let cs = treeToSchema(child);
        if ((child.presenceTested && !child.dereferenced) || child.nullTolerant) cs = makeNullable(cs);
        if (child.sites && child.sites.length) cs = Object.assign({}, cs, {$comment: 'read at ' + child.sites[0].replace(/src\/ts\//, '')});
        s.properties[k] = cs;
    }
    // If the value never leaves the code we analysed (it is not passed on as a whole), the keys
    // read here are all the keys there are, and the strict schema may reject anything else.
    if (!node.escapes) s[CLOSED] = true;
    return s;
}

// required = declared non-optional in the authoring-layer interface AND actually read by the
// constructor chain AND the engine neither tests for its presence, nor defaults it, nor assigns it;
// plus values handed unconditionally to `new X(value)` (every AuthoringObject constructor
// dereferences its def, so `new X(undefined)` throws).
const REQUIRED_CACHE = new Map();
function requiredOf(q) {
    if (REQUIRED_CACHE.has(q)) return REQUIRED_CACHE.get(q);
    REQUIRED_CACHE.set(q, []);                       // in-progress guard (Node.children -> Node)
    const info = collectClass(q);
    const required = new Set();
    if (ARGS.naiveRequired) {
        const all = [...info.tsRequired].filter(n => !info.engineOnly.has(n)).sort();
        REQUIRED_CACHE.set(q, all);
        return all;
    }
    // (1) the authoring constructor dereferences it unconditionally (`def.controls.forEach(...)`):
    //     leaving it out throws a TypeError, whatever the interface says
    info.mustExist.forEach(n => {
        if (!info.authorDefaults.has(n) && !info.writes.has(JSON.stringify([n])) && !info.engineOnly.has(n)) required.add(n);
    });
    // (2) the interface says so, and the code does not contradict it
    info.tsRequired.forEach(n => {
        if (required.has(n)) return;
        const p = info.props.get(n);
        const verdict = !p.read ? 'never read by the constructor chain' : p.guarded ? 'the engine tests for its presence' :
            info.defaults.has(n) ? 'the engine supplies a default' : info.writes.has(JSON.stringify([n])) ? 'the engine assigns it itself' : null;
        if (verdict) RELAXED_REQUIRED.push({cls: q, property: n, why: verdict}); else required.add(n);
    });
    for (const f of info.flows) {
        if (f.path.length === 1 && f.target.kind === 'class' && f.unconditional && !f.merged && !collectClass(f.target.name).guarded &&
            !info.defaults.has(f.path[0]) && !info.writes.has(JSON.stringify([f.path[0]])) && !(info.props.get(f.path[0]) || {}).guarded) required.add(f.path[0]);
    }
    const list = [...required].sort();
    REQUIRED_CACHE.set(q, list);
    return list;
}

function buildClassDefinition(q, partial, omit) {
    const info = collectClass(q);
    const c = CLASSES.get(q);
    const out = {type: 'object', properties: {}};
    out[CLOSED] = true;
    const flows = flowsByProp(info);

    const names = new Set([...info.props.keys()].filter(n => !info.engineOnly.has(n) || info.props.get(n).schemas.length));
    const learned = LEARNED.get(q) || new Map();
    learned.forEach((v, k) => { if (!info.engineOnly.has(k)) names.add(k); });
    // properties that belong to a dispatch site always exist (DivContainer.children is only read in KG.PositionedDiv.draw)
    const chainForOverrides = info.chain.concat(info.view && info.view.cls ? classChain(info.view.cls) : []);
    Object.keys(OVERRIDES).forEach(k => {
        const i = k.lastIndexOf('.');
        if (chainForOverrides.indexOf(k.slice(0, i)) > -1) names.add(k.slice(i + 1));
    });
    const inherited = new Map();
    for (const other of info.inheritsDefOf || []) {
        const built = buildClassDefinition(other, true);
        for (const k of Object.keys(built.properties)) if (!names.has(k) && !inherited.has(k)) inherited.set(k, {schema: built.properties[k], from: other});
    }

    for (const name of [...names].sort()) {
        const p = info.props.get(name) || {schemas: [], sources: [], description: ''};
        if (ARGS.declaredOnly && !p.schemas.length && !flows.get(name) && !flows.get(name + '[]') &&
            !Object.keys(OVERRIDES).some(k => k.endsWith('.' + name))) continue;
        let schema;
        const direct = flows.get(name);
        const items = flows.get(name + '[]');
        const override = OVERRIDES[q + '.' + name] || info.chain.map(k => OVERRIDES[k + '.' + name]).find(Boolean) ||
            (info.view && info.view.cls ? classChain(info.view.cls).map(k => OVERRIDES[k + '.' + name]).find(Boolean) : null);
        if (override) {
            schema = override();
        } else if (direct) {
            // the value is handed to `new SomeClass(value)`: use everything we know about SomeClass
            const declaredOther = p.schemas.filter(s => !s.$ref && !isAny(s));
            schema = mergeSchemas(direct.map(f => targetSchema(f, info)).concat(declaredOther));
        } else if (items) {
            schema = {type: 'array', items: mergeSchemas(items.map(f => targetSchema(f, info)))};
        } else if (p.schemas.length) {
            schema = mergeSchemas(p.schemas);
            // `sliders: any[]` says nothing about the items; the code that consumes them does
            const node = info.tree.props.get(name);
            const bare = isAny(schema) || (Object.keys(schema).length === 1 && (schema.type === 'array' || schema.type === 'object'));
            if (node && bare && (node.props.size || (node.items && (node.items.props.size || node.items.items)))) {
                const fromCode = treeToSchema(node);
                if (!schema.type || schema.type === fromCode.type) schema = fromCode;
            }
        } else {
            const node = info.tree.props.get(name);
            schema = node ? treeToSchema(node) : {};
        }
        // typeof def.label === 'string' : the constructor explicitly accepts that primitive
        const hints = new Set([...(p.typeHints || [])]);
        const treeNode = info.tree.props.get(name);
        if (treeNode) treeNode.typeHints.forEach(h => hints.add(h));
        if (hints.size && !isAny(schema)) schema = mergeSchemas([schema].concat([...hints].map(h => ({type: h}))));
        if (!override) schema = applyTree(schema, treeNode);

        schema = Object.assign({}, schema);
        const desc = [];
        if (p.description) desc.push(p.description);
        if (p.updatable) desc.push('Re-evaluated whenever a parameter changes, so it may be an expression such as "params.x".');
        if (desc.length) schema.description = desc.join(' ');
        if (p.hasDefault && p.default !== null && p.default !== undefined) schema.default = p.default;
        const sources = p.sources.slice();
        if (learned.has(name)) sources.push('read at use-site ' + learned.get(name).sites.slice(0, 2).join(', '));
        if (sources.length) schema.$comment = compactSources(sources);
        out.properties[name] = schema;
    }
    for (const [name, v] of (ARGS.declaredOnly ? [] : inherited)) {
        out.properties[name] = Object.assign({}, v.schema, {$comment: 'accepted because the definition is passed on to ' + v.from.replace(/^KGAuthor\./, '')});
    }

    const required = new Set(partial ? [] : requiredOf(q).filter(n => (omit || []).indexOf(n) < 0));
    if (required.size) out.required = [...required].sort();

    const bits = [c.ns + '.' + c.name + ' (' + info.site + ')'];
    if (info.own.iface) bits.push('definition interface: ' + info.own.iface + ' [' + info.own.how + ']');
    if (info.view) bits.push('rendered by KG.' + info.view.type);
    out.$comment = bits.join('; ');
    const classDoc = commentsOf(c.node);
    if (classDoc) out.description = classDoc;
    return out;
}

function buildInterfaceDefinition(q) {
    const out = {type: 'object', properties: {}};
    out[CLOSED] = true;
    const required = [];
    for (const iq of interfaceChain(q)) {
        const ii = INTERFACES.get(iq);
        for (const d of ii.decls) {
            for (const m of d.members) {
                if (!ts.isPropertySignature(m)) continue;
                const name = m.name.getText();
                if (out.properties[name]) continue;
                const s = typeToSchema(m.type, ii.ns, iq + '.' + name);
                if (s === null) { SKIPPED_MEMBERS.push({member: iq + '.' + name, type: m.type.getText(), site: where(m)}); continue; }
                const schema = Object.assign({}, s);
                const doc = commentsOf(m);
                if (doc) schema.description = doc;
                out.properties[name] = schema;
                // Only members the interface declares itself are enforced.  Inherited requirements
                // (PayoffDefinition extends LabelDefinition -> `text`) belong to a constructor that
                // this plain data object never reaches, so there is no code to check them against.
                if (!m.questionToken && iq === q) required.push(name);
            }
        }
    }
    if (required.length) out.required = required.sort();
    out.$comment = 'interface ' + q + ' (' + where(INTERFACES.get(q).decls[0]) + ')';
    return out;
}

// ----------------------------------------------------------------------------
// 9. Choices: {ClassName: def}  or  {type: "ClassName", def: def}
// ----------------------------------------------------------------------------

function singleKeyChoice(entries, what) {
    const s = {type: 'object', minProperties: 1, maxProperties: 1, properties: {}, additionalProperties: false};
    entries.forEach(e => { s.properties[e.key] = e.schema; });
    s.$comment = what + ': exactly one key, the object type, whose value is the definition. Unknown types are ignored by the engine with a console message ("Maybe you have a typo?").';
    return s;
}

function typeDefChoice(entries) {
    const s = {
        type: 'object',
        required: ['type', 'def'],
        properties: {type: {enum: entries.map(e => e.key)}, def: {}},
        allOf: entries.map(e => ({if: {properties: {type: {const: e.key}}}, then: {properties: {def: e.schema}}}))
    };
    return s;
}

function bothForms(entries, what) {
    // extractTypeAndDef (KGAuthor/parsers/parsingFunctions.ts): an object that has a `type`
    // key is taken as {type, def}; otherwise its first key is the type.
    return {if: {type: 'object', required: ['type']}, then: typeDefChoice(entries), else: singleKeyChoice(entries, what)};
}

// property-level overrides for the dispatch sites
const OVERRIDES = {
    'KGAuthor.Graph.objects': () => ({type: 'array', items: ref('graphObject')}),
    'KGAuthor.MathboxContainer.objects': () => ({type: 'array', items: ref('mathboxObject')}),
    'KGAuthor.Mathbox.objects': () => ({type: 'array', items: ref('mathboxObject')}),
    'KGAuthor.GraphObject.clipPaths': () => ({type: 'array', items: ref('shape')}),
    'KGAuthor.Overlap.shapes': () => ({type: 'array', items: ref('shape')}),
    'KGAuthor.PositionedDiv.children': () => ({type: 'array', items: ref('divChild')}),
    'KGAuthor.DivContainer.children': () => ({type: 'array', items: ref('divChild')}),
    'KG.PositionedDiv.children': () => ({type: 'array', items: ref('divChild')})
};

// ----------------------------------------------------------------------------
// 10. Which classes are authorable, and where
// ----------------------------------------------------------------------------

function parseSelfOwner(q) {
    const m = getMethod(q, 'parseSelf');
    return m ? m.owner : null;
}

function categorize() {
    const cats = {layout: [], schema: [], graphObject: [], mathboxObject: [], positioned: [], functionObject: [], other: [], abstract: [], notExported: []};
    for (const [q, c] of CLASSES) {
        if (c.ns !== 'KGAuthor') continue;
        if (!descendsFrom(q, 'KGAuthor.AuthoringObject')) continue;
        if (!c.exported) { cats.notExported.push(q); continue; }
        if (q === 'KGAuthor.AuthoringObject') { cats.abstract.push({q, why: 'base class'}); continue; }
        // A class that pushes itself to the render list (parseSelf of GraphObject/DivObject) but never
        // sets `type` cannot be rendered: new KG[undefined](...) would throw.
        const pso = parseSelfOwner(q);
        if ((pso === 'KGAuthor.GraphObject' || pso === 'KGAuthor.DivObject') && !viewTypeOf(q)) {
            cats.abstract.push({q, why: 'inherits ' + pso.replace('KGAuthor.', '') + '.parseSelf but never sets `type`'});
            continue;
        }
        if (descendsFrom(q, 'KGAuthor.Layout')) cats.layout.push(q);
        else if (descendsFrom(q, 'KGAuthor.Schema')) cats.schema.push(q);
        else if (descendsFrom(q, 'KGAuthor.MathboxObject')) cats.mathboxObject.push(q);
        else if (descendsFrom(q, 'KGAuthor.GraphObjectGenerator')) cats.graphObject.push(q);
        else if (descendsFrom(q, 'KGAuthor.PositionedObject')) cats.positioned.push(q);
        else if (descendsFrom(q, 'KGAuthor.EconMultivariateFunction')) cats.functionObject.push(q);
        else cats.other.push(q);
    }
    Object.keys(cats).forEach(k => cats[k].sort((a, b) => (a.q || a).localeCompare(b.q || b)));
    return cats;
}

// ----------------------------------------------------------------------------
// 11. Assemble
// ----------------------------------------------------------------------------

function main() {
    const commit = gitCommit(ARGS.repo);
    const dispatch = checkDispatchSites();
    const cats = categorize();
    const short = q => q.replace(/^KGAuthor\.|^KG\./, '');

    const entriesFor = list => list.map(q => ({key: short(q), schema: requestClass(q, false)}));

    // analyse every class first so that use-site learning sees all constructors
    for (const q of CLASSES.keys()) collectClass(q);
    // KG.View reads the top-level keys in its parse(data, div) method
    const viewParse = getMethod('KG.View', 'parse');
    const topReads = viewParse ? analyze(viewParse.node, {paramIndex: 0}, new Map(), {ns: 'KG', classQ: 'KG.View', depth: 0}) : newResult();
    while (learnFromUseSites()) { /* until stable */ }

    const authorable = [].concat(cats.layout, cats.schema, cats.graphObject, cats.mathboxObject, cats.positioned, cats.functionObject, cats.other);

    DEFINITIONS.typeAndDef = {
        type: 'object', required: ['type', 'def'], properties: {type: {type: 'string'}, def: {}},
        $comment: 'KG.TypeAndDef (src/ts/view/view.ts): generic {type, def} pair'
    };
    DEFINITIONS.layout = bothForms(entriesFor(cats.layout), 'layout');
    DEFINITIONS.graphObject = bothForms(entriesFor(cats.graphObject), 'graph object');
    DEFINITIONS.shape = singleKeyChoice(entriesFor(cats.graphObject), 'clip-path shape');
    // MathboxContainer adds the "Mathbox" prefix when it is missing, so `Point:` means MathboxPoint
    const mbEntries = [];
    cats.mathboxObject.forEach(q => {
        const n = short(q);
        if (n.indexOf('Mathbox') < 0) return;        // cannot be reached: the engine would look for "Mathbox" + name
        mbEntries.push({key: n, schema: requestClass(q, false)});
        const bare = n.replace('Mathbox', '');
        if (bare && !mbEntries.some(e => e.key === bare)) mbEntries.push({key: bare, schema: requestClass(q, false)});
    });
    DEFINITIONS.mathboxObject = bothForms(mbEntries, 'mathbox object');
    DEFINITIONS.topLevelObject = typeDefChoice(entriesFor(authorable));
    DEFINITIONS.topLevelObject.$comment = 'Top-level `objects` are passed to KGAuthor.parse() without extractTypeAndDef, so only the {type, def} form works here.';
    // children of a DivContainer are created by the rendering layer: new KG[child.type](child.def)
    const divClasses = [...CLASSES.keys()].filter(q => q.startsWith('KG.') && descendsFrom(q, 'KG.DivObject') && CLASSES.get(q).exported && q !== 'KG.DivObject').sort();
    DEFINITIONS.divChild = typeDefChoice(divClasses.map(q => ({key: short(q), schema: requestClass(q, false)})));

    // ---- top level: KG.ViewDefinition + what View.parse reads --------------------
    const top = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'kgjs (KineticGraphs) authoring format',
        description: 'A graph definition for kgjs / KineticGraphs, written in YAML or JSON.',
        $comment: '',
        type: 'object',
        properties: {}
    };
    top[CLOSED] = true;
    const topOverrides = {
        layout: () => ref('layout'),
        objects: () => ({type: 'array', items: ref('topLevelObject')}),
        schema: () => ({enum: cats.schema.map(short), $comment: 'name of a KGAuthor Schema class (src/ts/view/view.ts: data.objects.push({type: data.schema, ...}))'}),
        explanation: () => requestClass('KGAuthor.Explanation', false)
    };
    for (const iq of interfaceChain('KG.ViewDefinition')) {
        for (const d of INTERFACES.get(iq).decls) {
            for (const m of d.members) {
                if (!ts.isPropertySignature(m)) continue;
                const name = m.name.getText();
                let s = topOverrides[name] ? topOverrides[name]() : typeToSchema(m.type, 'KG', iq + '.' + name);
                if (s === null) continue;
                s = Object.assign({}, s);
                const doc = commentsOf(m);
                if (doc) s.description = doc;
                s.$comment = (s.$comment ? s.$comment + '; ' : '') + iq;
                top.properties[name] = s;
            }
        }
    }
    for (const r of topReads.reads.values()) {
        if (r.path.length !== 1 || top.properties[r.path[0]]) continue;
        top.properties[r.path[0]] = {$comment: 'read by KG.View.parse (' + r.sites[0] + ')'};
    }

    // ---- build everything that was requested (building may request more) -----------
    while (REQUESTED.length) {
        const job = REQUESTED.shift();
        if (job.kind === 'class') DEFINITIONS[job.name] = buildClassDefinition(job.q, job.partial, job.omit);
        else if (job.kind === 'interface') DEFINITIONS[job.name] = buildInterfaceDefinition(job.q);
        else if (job.kind === 'selector') {
            const sel = SELECTORS.get(job.q);
            const entries = [];
            sel.options.forEach(o => o.keys.forEach(k => entries.push({key: k, schema: requestClass(o.cls, false)})));
            DEFINITIONS[job.name] = bothForms(entries, 'choice made by ' + job.q + ' (' + sel.site + ')');
        }
    }

    // drop definitions nothing refers to (an interface requested for a property that a code flow later overrode)
    (function prune() {
        const reachable = new Set();
        const queue = [top.properties];
        while (queue.length) {
            const node = queue.pop();
            if (!node || typeof node !== 'object') continue;
            if (typeof node.$ref === 'string') {
                const name = decodeURIComponent(node.$ref.replace('#/definitions/', ''));
                if (!reachable.has(name)) { reachable.add(name); queue.push(DEFINITIONS[name]); }
            }
            Object.keys(node).forEach(k => queue.push(node[k]));
        }
        Object.keys(DEFINITIONS).forEach(k => { if (!reachable.has(k)) { PRUNED.push(k); delete DEFINITIONS[k]; } });
    })();

    top.$comment = 'Generated by tools/schema/generate.js from kgjs commit ' + commit + '. Do not edit by hand; re-run the generator.';
    const sortedDefs = {};
    Object.keys(DEFINITIONS).sort().forEach(k => { sortedDefs[k] = DEFINITIONS[k]; });
    top.definitions = sortedDefs;

    // ---- two variants -----------------------------------------------------------------
    function variant(node, strict) {
        if (Array.isArray(node)) return node.map(n => variant(n, strict));
        if (!node || typeof node !== 'object') return node;
        const out = {};
        for (const k of Object.keys(node)) {
            if (k === CLOSED) continue;
            out[k] = (k === 'default' || k === 'enum' || k === 'const') ? node[k] : variant(node[k], strict);
        }
        if (node[CLOSED] && strict) out.additionalProperties = false;
        return out;
    }
    const permissive = variant(top, false);
    const strict = variant(top, true);
    permissive.title += ' (permissive: unknown properties allowed)';
    strict.title += ' (strict: unknown properties rejected)';

    fs.mkdirSync(ARGS.out, {recursive: true});
    fs.writeFileSync(path.join(ARGS.out, 'kg.schema.json'), JSON.stringify(permissive, null, 1) + '\n');
    fs.writeFileSync(path.join(ARGS.out, 'kg.strict.schema.json'), JSON.stringify(strict, null, 1) + '\n');

    // ---- class map (used by crosscheck.js and by the reports) -------------------------------
    const classMap = {
        commit,
        generatedFrom: rel(ENTRY),
        sourceFiles: SOURCES.size,
        classes: {}
    };
    const catOf = {};
    Object.keys(cats).forEach(cat => cats[cat].forEach(x => { catOf[x.q || x] = cat; }));
    for (const q of [...CLASSES.keys()].filter(q => q.startsWith('KGAuthor.')).sort()) {
        const info = collectClass(q);
        const abstractEntry = cats.abstract.find(a => a.q === q);
        classMap.classes[short(q)] = {
            file: info.site,
            parent: CLASSES.get(q).parent ? short(CLASSES.get(q).parent) : null,
            category: catOf[q] || 'notAuthoringObject',
            notAuthorableBecause: abstractEntry ? abstractEntry.why : undefined,
            definitionInterface: info.own.iface ? info.own.iface.replace(/^KGAuthor\./, '') : null,
            resolvedBy: info.own.how,
            inheritedInterfaces: info.interfaces.filter(i => i !== info.own.iface).map(i => i.replace(/^KGAuthor\./, '')),
            renderedBy: info.view ? 'KG.' + info.view.type : null,
            propertyCount: DEFINITIONS[q] ? Object.keys(DEFINITIONS[q].properties).length : undefined
        };
    }
    fs.writeFileSync(path.join(ARGS.out, 'class-map.json'), JSON.stringify(classMap, null, 1) + '\n');

    // ---- report ---------------------------------------------------------------------------------
    const count = o => Object.keys(o).length;
    console.log('kgjs schema generator');
    console.log('  date                      ' + new Date().toISOString());
    console.log('  repo                      ' + ARGS.repo);
    console.log('  upstream commit           ' + commit);
    console.log('  typescript (compiler API) ' + ts.version);
    console.log('  source files parsed       ' + SOURCES.size + ' (reachable from src/ts/kg.ts via /// <reference>)');
    console.log('  interfaces indexed        ' + INTERFACES.size + ' (KGAuthor: ' + [...INTERFACES.keys()].filter(k => k.startsWith('KGAuthor.')).length + ')');
    console.log('  classes indexed           ' + CLASSES.size + ' (KGAuthor: ' + [...CLASSES.keys()].filter(k => k.startsWith('KGAuthor.')).length + ')');
    console.log('');
    console.log('KGAuthor classes descending from AuthoringObject:');
    ['layout', 'schema', 'graphObject', 'mathboxObject', 'positioned', 'functionObject', 'other'].forEach(cat => {
        console.log('  ' + (cat + ':').padEnd(16) + String(cats[cat].length).padStart(4) + '   ' + cats[cat].map(short).join(' '));
    });
    console.log('  ' + 'authorable:'.padEnd(16) + String(authorable.length).padStart(4));
    console.log('  ' + 'abstract:'.padEnd(16) + String(cats.abstract.length).padStart(4) + '   ' + cats.abstract.map(a => short(a.q) + ' [' + a.why + ']').join('; '));
    console.log('  ' + 'not exported:'.padEnd(16) + String(cats.notExported.length).padStart(4) + '   ' + cats.notExported.map(short).join(' '));
    const withSchema = authorable.filter(q => DEFINITIONS[q]);
    console.log('  authorable classes with a schema definition: ' + withSchema.length + ' / ' + authorable.length);
    const how = {};
    authorable.forEach(q => { const h = collectClass(q).own.how; how[h] = (how[h] || 0) + 1; });
    console.log('  definition interface found by: ' + Object.keys(how).map(h => h + '=' + how[h]).join(', '));
    console.log('');
    console.log('selector functions: ' + [...SELECTORS.entries()].map(([q, s]) => q + ' -> ' + s.options.map(o => o.keys.join('|') + '=>' + short(o.cls)).join(', ')).join('; '));
    console.log('dispatch sites found in source: ' + dispatch.found.length + ' (unknown: ' + dispatch.unknown.length + ', missing: ' + dispatch.missing.length + ')');
    dispatch.found.forEach(f => console.log('  ' + f.file + ':' + f.line + '  new ' + f.expr + '(...)  in ' + f.within));
    console.log('');
    console.log('interface members skipped because their type is an engine object, not data: ' + SKIPPED_MEMBERS.length);
    const seenSkip = new Set();
    SKIPPED_MEMBERS.forEach(s => { const k = s.member; if (!seenSkip.has(k)) { seenSkip.add(k); console.log('  ' + s.member + ': ' + s.type + ' (' + s.site + ')'); } });
    console.log('');
    console.log('warnings: ' + warnings.length);
    [...new Set(warnings)].forEach(w => console.log('  ' + w));
    console.log('');
    console.log('"required" markers of the TypeScript interfaces that were NOT carried into the schema: ' + RELAXED_REQUIRED.length);
    const seenRelax = new Set();
    RELAXED_REQUIRED.forEach(r => {
        const k = r.cls + '.' + r.property;
        if (seenRelax.has(k)) return;
        seenRelax.add(k);
        console.log('  ' + short(r.cls) + '.' + r.property + ': ' + r.why);
    });
    console.log('');
    console.log('definitions emitted: ' + count(sortedDefs) + (PRUNED.length ? '   (pruned as unreferenced: ' + PRUNED.join(', ') + ')' : ''));
    ['kg.schema.json', 'kg.strict.schema.json', 'class-map.json'].forEach(f => {
        console.log('  wrote ' + path.join(ARGS.out, f) + ' (' + fs.statSync(path.join(ARGS.out, f)).size + ' bytes)');
    });
}

main();
