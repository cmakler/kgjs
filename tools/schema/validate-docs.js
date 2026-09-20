#!/usr/bin/env node
/*
 * validate-docs.js -- extracts every graph definition that ships with kgjs and validates it
 * against schema/kg.schema.json (permissive) and schema/kg.strict.schema.json (strict).
 *
 *   node validate-docs.js [--repo <kgjs checkout>] [--schema-dir <dir>] [--report <file.json>] [--verbose]
 *                         [--extra <graph file outside the checkout>]...
 *
 * Sources of examples:
 *   1. <div ... class="codePreview"> blocks in docs/**\/*.md and docs/**\/*.html
 *      (rendered by docs/js/preview-pane.js, which YAML-parses the div's inner text)
 *   2. <div class="kg-container"> blocks with inline YAML in docs/**\/*.html
 *      (rendered by loadGraphs() in src/ts/kg.ts)
 *   3. stand-alone graph files: docs/**\/*.yml|yaml|json and src/**\/*.yml|yaml|json
 * Generated or third-party folders (docs/_site, docs/codemirror, node_modules) and files that
 * are not graph definitions (Jekyll config, package.json, source maps) are excluded and listed.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');

function parseArgs(argv) {
    const a = {repo: null, schemaDir: null, report: null, verbose: false, extra: []};
    for (let i = 2; i < argv.length; i++) {
        if (argv[i] === '--repo') a.repo = argv[++i];
        else if (argv[i] === '--schema-dir') a.schemaDir = argv[++i];
        else if (argv[i] === '--report') a.report = argv[++i];
        else if (argv[i] === '--verbose') a.verbose = true;
        else if (argv[i] === '--extra') a.extra.push(path.resolve(argv[++i]));      // additional graph files (out-of-sample)
        else { console.error('unknown argument ' + argv[i]); process.exit(2); }
    }
    a.repo = path.resolve(a.repo || process.env.KGJS_REPO || path.join(__dirname, '..', '..'));
    a.schemaDir = path.resolve(a.schemaDir || path.join(__dirname, '..', '..', 'schema'));
    return a;
}
let ARGS = {repo: null};

const EXCLUDED_DIRS = ['docs/_site', 'docs/codemirror', 'docs/.jekyll-cache', 'docs/.sass-cache', 'node_modules', '.git'];
const NOT_GRAPH_FILES = {
    'docs/_config.yml': 'Jekyll site configuration',
    'docs/_data/contents.yml': 'Jekyll navigation data',
    '_config.yml': 'Jekyll site configuration'
};

function rel(f) { return path.relative(ARGS.repo, f).split(path.sep).join('/'); }

function walk(dir, out) {
    for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const r = rel(full);
        if (EXCLUDED_DIRS.some(d => r === d || r.startsWith(d + '/'))) continue;
        const st = fs.statSync(full);
        if (st.isDirectory()) walk(full, out); else out.push(full);
    }
    return out;
}

// The engine (src/ts/kg.ts, docs/js/preview-pane.js) undoes HTML escaping before use.
function unescapeHtml(s) { return s.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&'); }

function extractDivs(text, className) {
    // returns [{startLine (1-based line of the first content line), body}]
    const blocks = [];
    const open = new RegExp('<div\\b[^>]*class="[^"]*\\b' + className + '\\b[^"]*"[^>]*>', 'g');
    let m;
    while ((m = open.exec(text)) !== null) {
        const tag = m[0];
        const contentStart = m.index + tag.length;
        // find the matching </div>, allowing nested <div> inside the YAML (html: "<div>..</div>")
        let depth = 1, pos = contentStart;
        const token = /<div\b|<\/div>/g;
        token.lastIndex = contentStart;
        let t;
        while ((t = token.exec(text)) !== null) {
            depth += t[0] === '</div>' ? -1 : 1;
            if (depth === 0) { pos = t.index; break; }
        }
        if (depth !== 0) continue;
        const startLine = text.slice(0, contentStart).split('\n').length;
        blocks.push({startLine, body: text.slice(contentStart, pos), tag});
        open.lastIndex = pos;
    }
    return blocks;
}

function collectExamples() {
    const examples = [];
    const excluded = [];
    const roots = ['docs', 'src'].map(d => path.join(ARGS.repo, d)).filter(fs.existsSync);
    const files = [];
    roots.forEach(r => walk(r, files));
    files.sort();
    for (const f of files) {
        const r = rel(f);
        const ext = path.extname(f).toLowerCase();
        if (ext === '.md' || ext === '.html') {
            const text = fs.readFileSync(f, 'utf8');
            extractDivs(text, 'codePreview').forEach((b, i) => examples.push({file: r, kind: 'codePreview', index: i + 1, startLine: b.startLine, text: b.body, format: 'yaml'}));
            extractDivs(text, 'kg-container').forEach((b, i) => {
                if (/\bsrc=/.test(b.tag)) { excluded.push({file: r, why: 'kg-container that loads an external src (no inline definition)'}); return; }
                if (/\btemplate=/.test(b.tag)) { excluded.push({file: r, why: 'kg-container with template= attribute: inline text is a list of template substitutions, not a graph definition'}); return; }
                if (!b.body.trim()) return;
                examples.push({file: r, kind: 'kg-container', index: i + 1, startLine: b.startLine, text: b.body, format: 'yaml'});
            });
        } else if (ext === '.yml' || ext === '.yaml' || ext === '.json') {
            if (NOT_GRAPH_FILES[r]) { excluded.push({file: r, why: NOT_GRAPH_FILES[r]}); continue; }
            if (path.basename(f) === 'package.json' || path.basename(f) === 'package-lock.json' || path.basename(f) === 'tsconfig.json') { excluded.push({file: r, why: 'not a graph definition'}); continue; }
            examples.push({file: r, kind: 'file', index: 1, startLine: 1, text: fs.readFileSync(f, 'utf8'), format: ext === '.json' ? 'json' : 'yaml'});
        }
    }
    for (const f of ARGS.extra || []) {
        examples.push({file: 'EXTRA:' + path.basename(f), kind: 'extra', index: 1, startLine: 1, text: fs.readFileSync(f, 'utf8'), format: /\.json$/.test(f) ? 'json' : 'yaml'});
    }
    return {examples, excluded};
}

// ---- evidence: is a property name mentioned anywhere in the engine source? ------------------------
let SOURCE_LINES = null;
function sourceEvidence(prop) {
    if (!SOURCE_LINES) {
        SOURCE_LINES = [];
        const files = [];
        walk(path.join(ARGS.repo, 'src', 'ts'), files);
        files.filter(f => /\.ts$/.test(f)).sort().forEach(f => {
            fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => SOURCE_LINES.push({file: rel(f), line: i + 1, text: line}));
        });
    }
    const esc = String(prop).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const access = new RegExp('(\\.' + esc + '\\b|\\[[\'"]' + esc + '[\'"]\\]|hasOwnProperty\\([\'"]' + esc + '[\'"]\\))');
    const declared = new RegExp('^\\s*[\'"]?' + esc + '[\'"]?\\??\\s*:');
    const quoted = new RegExp('[\'"]' + esc + '[\'"]');
    const hits = {access: [], declared: [], quoted: []};
    for (const l of SOURCE_LINES) {
        if (/^\s*\/\//.test(l.text)) continue;
        if (access.test(l.text)) hits.access.push(l.file + ':' + l.line);
        else if (declared.test(l.text)) hits.declared.push(l.file + ':' + l.line);
        else if (quoted.test(l.text)) hits.quoted.push(l.file + ':' + l.line);
    }
    return hits;
}

// ---- locating a JSON-pointer path in YAML text (best effort, block style) ---------------------
function locate(text, startLine, pointer) {
    const lines = text.split('\n');
    const segs = pointer.split('/').slice(1).map(s => s.replace(/~1/g, '/').replace(/~0/g, '~'));
    let from = 0;              // search from this line index
    let found = 0;
    let indent = -1;
    for (const seg of segs) {
        let hit = -1;
        if (/^\d+$/.test(seg)) {
            // n-th "- " item of the list that starts after `from`
            let n = Number(seg), dashIndent = -1;
            for (let i = from; i < lines.length; i++) {
                const mm = /^(\s*)-(\s|$)/.exec(lines[i]);
                if (!lines[i].trim() || /^\s*#/.test(lines[i])) continue;
                const ind = /^(\s*)/.exec(lines[i])[1].length;
                if (dashIndent >= 0 && ind < dashIndent) break;
                if (mm) {
                    if (dashIndent < 0) dashIndent = mm[1].length;
                    if (mm[1].length === dashIndent) { if (n === 0) { hit = i; break; } n--; }
                }
            }
            if (hit < 0) break;
            from = hit; found = hit; indent = dashIndent;
        } else {
            const re = new RegExp('^(\\s*)(-\\s+)?["\']?' + seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\']?\\s*:');
            for (let i = from; i < lines.length; i++) {
                if (re.test(lines[i])) { hit = i; break; }
            }
            if (hit < 0) break;
            from = hit; found = hit;
        }
    }
    void indent;
    return startLine + found;
}

// ---- Ajv ---------------------------------------------------------------------------------------
function compile(file) {
    const schema = JSON.parse(fs.readFileSync(file, 'utf8'));
    // verbose: errors carry the schema node that failed, whose $comment names the kgjs class
    const ajv = new Ajv({allErrors: true, verbose: true, strict: true, allowUnionTypes: true, strictTypes: false, strictRequired: false, strictTuples: false});
    return {schema, validate: ajv.compile(schema)};
}

function significantErrors(errors) {
    // `if` errors only say "then/else failed"; the real reason is reported separately
    return (errors || []).filter(e => e.keyword !== 'if');
}

function defNameOf(e) {
    // class definitions carry "$comment": "KGAuthor.Point (src/...:15); ..."
    const c = e.parentSchema && typeof e.parentSchema.$comment === 'string' ? e.parentSchema.$comment : '';
    const m = /^((?:KGAuthor|KG)\.[A-Za-z0-9_]+) \(/.exec(c) || /^interface ((?:KGAuthor|KG)\.[A-Za-z0-9_]+)/.exec(c);
    if (m) return m[1];
    if (/^Generated by/.test(c)) return '(top level)';
    const w = /^([a-z][A-Za-z -]*?): exactly one key/.exec(c);
    if (w) return '(' + w[1] + ')';
    return '(inline object)';
}

function describe(e) {
    if (e.keyword === 'additionalProperties') {
        const choice = typeof e.parentSchema.$comment === 'string' && /exactly one key/.test(e.parentSchema.$comment);
        return {kind: choice ? 'unknown-object-type' : 'unknown-property', property: e.params.additionalProperty, def: defNameOf(e)};
    }
    if (e.keyword === 'enum' && /properties\/type\/enum$/.test(e.schemaPath)) return {kind: 'unknown-object-type', property: '(type)', def: defNameOf(e)};
    if (e.keyword === 'required') return {kind: 'missing-required', property: e.params.missingProperty, def: defNameOf(e)};
    if (e.keyword === 'type') return {kind: 'wrong-type', property: e.instancePath.split('/').pop(), def: defNameOf(e), expected: e.params.type};
    return {kind: e.keyword, property: e.instancePath.split('/').pop(), def: defNameOf(e)};
}

// used by engine-check.js and negative-tests.js
function collectParsedExamples(repo) {
    ARGS = Object.assign({}, ARGS, {repo: path.resolve(repo)});
    const out = [];
    for (const ex of collectExamples().examples) {
        try {
            const data = ex.format === 'json' ? JSON.parse(ex.text) : yaml.safeLoad(unescapeHtml(ex.text));
            if (data && typeof data === 'object' && !Array.isArray(data)) out.push({id: ex.file + (ex.kind === 'file' ? '' : ' #' + ex.index + ' (line ' + ex.startLine + ')'), data});
        } catch (e) { /* reported by validate-docs.js itself */ }
    }
    return out;
}

function main() {
    ARGS = parseArgs(process.argv);
    const {examples, excluded} = collectExamples();
    const permissive = compile(path.join(ARGS.schemaDir, 'kg.schema.json'));
    const strict = compile(path.join(ARGS.schemaDir, 'kg.strict.schema.json'));

    console.log('kgjs documentation examples vs. generated schema');
    console.log('  date            ' + new Date().toISOString());
    console.log('  repo            ' + ARGS.repo);
    console.log('  schema comment  ' + permissive.schema.$comment);
    console.log('  js-yaml ' + require('js-yaml/package.json').version + ', ajv ' + require('ajv/package.json').version);
    console.log('');

    const stats = {found: examples.length, parsed: 0, notObject: 0, permissiveValid: 0, strictValid: 0};
    const byKind = {};
    const parseFailures = [];
    const failures = [];          // {file, line, schema: 'permissive'|'strict', ...describe}

    for (const ex of examples) {
        byKind[ex.kind] = (byKind[ex.kind] || 0) + 1;
        let data;
        try {
            data = ex.format === 'json' ? JSON.parse(ex.text) : yaml.safeLoad(unescapeHtml(ex.text));
        } catch (err) {
            parseFailures.push({file: ex.file, line: ex.startLine, index: ex.index, message: String(err.message).split('\n')[0]});
            continue;
        }
        if (data === null || typeof data !== 'object' || Array.isArray(data)) {
            stats.notObject++;
            parseFailures.push({file: ex.file, line: ex.startLine, index: ex.index, message: 'parsed, but the result is not a mapping (' + (data === null ? 'empty' : typeof data) + ')'});
            continue;
        }
        stats.parsed++;
        ex.id = ex.file + (ex.kind === 'file' ? '' : ' #' + ex.index + ' (line ' + ex.startLine + ')');

        const okP = permissive.validate(data);
        const errsP = okP ? [] : significantErrors(permissive.validate.errors);
        const okS = strict.validate(data);
        const errsS = okS ? [] : significantErrors(strict.validate.errors);
        if (okP) stats.permissiveValid++;
        if (okS) stats.strictValid++;

        const seen = new Set();
        const record = (errs, which) => errs.forEach(e => {
            const d = describe(e);
            const pointer = e.instancePath + (d.kind === 'unknown-property' || d.kind === 'unknown-object-type' ? '/' + String(d.property).replace(/~/g, '~0').replace(/\//g, '~1') : '');
            const key = d.kind + '|' + pointer + '|' + d.property;
            if (seen.has(which + key)) return;
            seen.add(which + key);
            failures.push(Object.assign({example: ex.id, file: ex.file, line: locate(ex.text, ex.startLine, pointer), path: pointer, schema: which, message: e.message}, d));
        });
        record(errsP, 'permissive');
        // under strict, only report what permissive did not already report
        const pKeys = new Set(failures.filter(f => f.example === ex.id && f.schema === 'permissive').map(f => f.kind + '|' + f.path));
        record(errsS.filter(e => { const d = describe(e); const pointer = e.instancePath + (d.kind === 'unknown-property' || d.kind === 'unknown-object-type' ? '/' + d.property : ''); return !pKeys.has(d.kind + '|' + pointer); }), 'strict');
        ex.okP = okP; ex.okS = okS;
    }

    console.log('examples found                 ' + stats.found + '   (' + Object.keys(byKind).map(k => k + ': ' + byKind[k]).join(', ') + ')');
    console.log('parsed to a YAML/JSON mapping  ' + stats.parsed);
    console.log('valid under permissive schema  ' + stats.permissiveValid + ' / ' + stats.parsed);
    console.log('valid under strict schema      ' + stats.strictValid + ' / ' + stats.parsed);
    console.log('');
    console.log('files excluded (' + excluded.length + '):');
    excluded.forEach(e => console.log('  ' + e.file + '  -- ' + e.why));
    console.log('');
    console.log('examples that did not parse (' + parseFailures.length + '):');
    parseFailures.forEach(p => console.log('  ' + p.file + ':' + p.line + '  #' + p.index + '  ' + p.message));
    console.log('');

    for (const which of ['permissive', 'strict']) {
        const list = failures.filter(f => f.schema === which);
        console.log((which === 'permissive' ? 'FAILURES UNDER THE PERMISSIVE SCHEMA' : 'ADDITIONAL FAILURES UNDER THE STRICT SCHEMA') + ' (' + list.length + ' distinct problems in ' + new Set(list.map(f => f.example)).size + ' examples)');
        const groups = new Map();
        list.forEach(f => {
            const k = f.kind + ' | ' + f.def + ' | ' + f.property + (f.expected ? ' | expected ' + [].concat(f.expected).join('/') : '');
            if (!groups.has(k)) groups.set(k, []);
            groups.get(k).push(f);
        });
        [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])).forEach(([k, fs_]) => {
            console.log('  [' + fs_.length + 'x] ' + k);
            fs_.slice(0, ARGS.verbose ? 1000 : 6).forEach(f => console.log('        ' + f.file + ':' + f.line + '  ' + f.path));
            if (!ARGS.verbose && fs_.length > 6) console.log('        ... ' + (fs_.length - 6) + ' more (use --verbose)');
            const prop = fs_[0].property;
            if (prop && prop !== '(type)') {
                const ev = sourceEvidence(prop);
                console.log('        evidence in src/ts for "' + prop + '": ' + ev.access.length + ' property accesses, ' + ev.declared.length + ' declarations/object keys, ' + ev.quoted.length + ' other quoted mentions');
                ev.access.slice(0, 4).forEach(h => console.log('            access   ' + h));
                ev.declared.slice(0, 4).forEach(h => console.log('            declared ' + h));
            }
        });
        console.log('');
    }

    if (ARGS.report) {
        fs.mkdirSync(path.dirname(path.resolve(ARGS.report)), {recursive: true});
        fs.writeFileSync(ARGS.report, JSON.stringify({stats, byKind, excluded, parseFailures, failures, examples: examples.map(e => ({id: e.id, file: e.file, line: e.startLine, kind: e.kind, permissive: e.okP, strict: e.okS}))}, null, 1) + '\n');
        console.log('report written to ' + ARGS.report);
    }
    console.log('SUMMARY found=' + stats.found + ' parsed=' + stats.parsed + ' permissive_valid=' + stats.permissiveValid + ' strict_valid=' + stats.strictValid);
}

module.exports = {collectParsedExamples, unescapeHtml};
if (require.main === module) main();
