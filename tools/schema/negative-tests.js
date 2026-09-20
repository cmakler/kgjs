#!/usr/bin/env node
/*
 * negative-tests.js -- crafted INVALID graph definitions that the schema must reject, each paired
 * with a corrected version that the schema must accept.
 *
 *   node negative-tests.js [--schema-dir <dir>] [--repo <kgjs checkout>] [--no-engine]
 *
 * `rejectedBy`:
 *    'both'   -> the permissive AND the strict schema must reject the invalid document
 *    'strict' -> only the strict schema can catch it (a misspelled property name: the permissive
 *                schema allows unknown properties by design), so permissive must ACCEPT it
 * The corrected document must be accepted by both schemas.
 *
 * When a kgjs checkout is available the real engine (authoring layer, see engine-check.js) is run
 * on every document as well.  That column is informational: it shows what kgjs itself does today
 * with the invalid input (throws / prints "no such object type" / silently accepts).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');

const CASES = [
    {
        name: 'misspelled object type (Pont)',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraph:
    graph:
      objects:
      - Pont:
          coordinates: [6,4]`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [6,4]`
    },
    {
        name: 'unknown layout (OneGraf)',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraf:
    graph:
      objects: []`,
        valid: `
layout:
  OneGraph:
    graph:
      objects: []`
    },
    {
        name: 'coordinates given as a string instead of a list',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: "6,4"`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [6, 4]`
    },
    {
        name: 'misspelled property (colour) on a Point',
        rejectedBy: 'strict',
        invalid: `
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [6,4]
          colour: red`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [6,4]
          color: red`
    },
    {
        name: 'misspelled top-level key (parms)',
        rejectedBy: 'strict',
        invalid: `
parms:
- {name: a, value: 2, min: 0, max: 10}
layout:
  OneGraph:
    graph:
      objects: []`,
        valid: `
params:
- {name: a, value: 2, min: 0, max: 10}
layout:
  OneGraph:
    graph:
      objects: []`
    },
    {
        name: 'params given as a mapping instead of a list',
        rejectedBy: 'both',
        invalid: `
params:
  a: {value: 2, min: 0, max: 10}
layout:
  OneGraph:
    graph:
      objects: []`,
        valid: `
params:
- {name: a, value: 2, min: 0, max: 10}
layout:
  OneGraph:
    graph:
      objects: []`
    },
    {
        name: 'param without a name',
        rejectedBy: 'both',
        invalid: `
params:
- {value: 2, min: 0, max: 10}
layout:
  OneGraph:
    graph:
      objects: []`,
        valid: `
params:
- {name: a, value: 2, min: 0, max: 10}
layout:
  OneGraph:
    graph:
      objects: []`
    },
    {
        name: 'YAML indentation slip: definition keys at the same level as the type key',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraph:
    graph:
      objects:
      - Point:
        coordinates: [6,4]`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [6,4]`
    },
    {
        name: 'layout without its graph',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraph:
    objects:
    - Point: {coordinates: [6,4]}`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Point: {coordinates: [6,4]}`
    },
    {
        name: 'objects given as a mapping instead of a list',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraph:
    graph:
      objects:
        Point: {coordinates: [6,4]}`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Point: {coordinates: [6,4]}`
    },
    {
        name: 'unknown schema name (EconSchemaa)',
        rejectedBy: 'both',
        invalid: `
schema: EconSchemaa
layout:
  OneGraph:
    graph:
      objects: []`,
        valid: `
schema: EconSchema
layout:
  OneGraph:
    graph:
      objects: []`
    },
    {
        name: 'misspelled dropline direction (verticle)',
        rejectedBy: 'strict',
        invalid: `
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [6,4]
          droplines:
            verticle: a_1`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [6,4]
          droplines:
            vertical: a_1`
    },
    {
        name: 'sidebar controls given as a mapping instead of a list',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraphPlusSidebar:
    graph:
      objects: []
    sidebar:
      controls:
        title: My controls`,
        valid: `
layout:
  OneGraphPlusSidebar:
    graph:
      objects: []
    sidebar:
      controls:
      - title: My controls`
    },
    {
        name: 'sidebar without controls',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraphPlusSidebar:
    graph:
      objects: []
    sidebar:
      title: My controls`,
        valid: `
layout:
  OneGraphPlusSidebar:
    graph:
      objects: []
    sidebar:
      controls:
      - title: My controls`
    },
    {
        name: 'Arrow without an end point',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraph:
    graph:
      objects:
      - Arrow:
          begin: [1,1]`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Arrow:
          begin: [1,1]
          end: [4,5]`
    },
    {
        name: 'drag given as a mapping instead of a list of listeners',
        rejectedBy: 'both',
        invalid: `
params:
- {name: a, value: 2, min: 0, max: 10}
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [params.a, 4]
          drag:
            horizontal: a`,
        valid: `
params:
- {name: a, value: 2, min: 0, max: 10}
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [params.a, 4]
          drag:
          - horizontal: a`
    },
    {
        name: 'tree without nodes',
        rejectedBy: 'both',
        invalid: `
layout:
  OneTree:
    tree:
      edges: []`,
        valid: `
layout:
  OneTree:
    tree:
      nodes:
      - {name: root, coordinates: [12, 20]}`
    },
    {
        name: 'unknown utility function type (CobDouglas)',
        rejectedBy: 'both',
        invalid: `
schema: EconSchema
layout:
  OneGraph:
    graph:
      objects:
      - EconIndifferenceCurve:
          utilityFunction:
            CobDouglas: {alpha: 0.5}
          level: 10`,
        valid: `
schema: EconSchema
layout:
  OneGraph:
    graph:
      objects:
      - EconIndifferenceCurve:
          utilityFunction:
            CobbDouglas: {alpha: 0.5}
          level: 10`
    },
    {
        name: 'top-level objects in single-key form (the engine only accepts {type, def} there)',
        rejectedBy: 'both',
        invalid: `
objects:
- Graph:
    position: {x: 0.1, y: 0.1, width: 0.8, height: 0.8}
    objects: []`,
        valid: `
objects:
- type: Graph
  def:
    position: {x: 0.1, y: 0.1, width: 0.8, height: 0.8}
    objects: []`
    },
    {
        name: 'layout given as a list',
        rejectedBy: 'both',
        invalid: `
layout:
- OneGraph:
    graph:
      objects: []`,
        valid: `
layout:
  OneGraph:
    graph:
      objects: []`
    },
    {
        name: 'Overlap without shapes',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraph:
    graph:
      objects:
      - Overlap:
          fill: purple`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Overlap:
          fill: purple
          shapes:
          - Circle: {center: [4,5], r: 3}
          - Circle: {center: [6,5], r: 3}`
    },
    {
        name: 'Angle without its middle point',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraph:
    graph:
      objects:
      - Angle:
          pointA: {coordinates: [5,1]}
          pointC: {coordinates: [1,5]}`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Angle:
          pointA: {coordinates: [5,1]}
          pointB: {coordinates: [1,1]}
          pointC: {coordinates: [1,5]}`
    },
    {
        name: 'Contour without fn',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraph:
    graph:
      objects:
      - Contour:
          level: 16`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Contour:
          fn: (x)*(y)
          level: 16`
    },
    {
        name: 'clipPaths item in {type, def} form (the engine reads the first key as the shape type)',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraph:
    graph:
      objects:
      - Rectangle:
          a: [0,0]
          b: [10,10]
          clipPaths:
          - type: Circle
            def: {center: [5,5], r: 3}`,
        valid: `
layout:
  OneGraph:
    graph:
      objects:
      - Rectangle:
          a: [0,0]
          b: [10,10]
          clipPaths:
          - Circle: {center: [5,5], r: 3}`
    },
    {
        name: '{type, def} form with a misspelled type (JSON style)',
        rejectedBy: 'both',
        invalid: `
layout:
  type: OneGraph
  def:
    graph:
      objects:
      - type: Pointt
        def: {coordinates: [6,4]}`,
        valid: `
layout:
  type: OneGraph
  def:
    graph:
      objects:
      - type: Point
        def: {coordinates: [6,4]}`
    },
    {
        name: 'axis given as a list',
        rejectedBy: 'both',
        invalid: `
layout:
  OneGraph:
    graph:
      xAxis: [0, 20]
      objects: []`,
        valid: `
layout:
  OneGraph:
    graph:
      xAxis: {min: 0, max: 20}
      objects: []`
    },
    {
        name: 'misspelled axis property (titel)',
        rejectedBy: 'strict',
        invalid: `
layout:
  OneGraph:
    graph:
      xAxis: {titel: Quantity, max: 20}
      objects: []`,
        valid: `
layout:
  OneGraph:
    graph:
      xAxis: {title: Quantity, max: 20}
      objects: []`
    },
    {
        name: 'misspelled slider key inside sidebar controls (slidrs)',
        rejectedBy: 'strict',
        invalid: `
params:
- {name: a, value: 2, min: 0, max: 10}
layout:
  OneGraphPlusSidebar:
    graph:
      objects: []
    sidebar:
      controls:
      - title: Controls
        slidrs:
        - {param: a, label: a}`,
        valid: `
params:
- {name: a, value: 2, min: 0, max: 10}
layout:
  OneGraphPlusSidebar:
    graph:
      objects: []
    sidebar:
      controls:
      - title: Controls
        sliders:
        - {param: a, label: a}`
    }
];

function main() {
    let schemaDir = null, repo = null, useEngine = true;
    const argv = process.argv.slice(2);
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === '--schema-dir') schemaDir = argv[++i];
        else if (argv[i] === '--repo') repo = argv[++i];
        else if (argv[i] === '--no-engine') useEngine = false;
        else { console.error('unknown argument ' + argv[i]); process.exit(2); }
    }
    schemaDir = path.resolve(schemaDir || path.join(__dirname, '..', '..', 'schema'));
    repo = path.resolve(repo || process.env.KGJS_REPO || path.join(__dirname, '..', '..'));

    const compile = f => new Ajv({allErrors: true, strict: true, allowUnionTypes: true, strictTypes: false, strictRequired: false})
        .compile(JSON.parse(fs.readFileSync(path.join(schemaDir, f), 'utf8')));
    const permissive = compile('kg.schema.json');
    const strict = compile('kg.strict.schema.json');

    let engine = null;
    if (useEngine && fs.existsSync(path.join(repo, 'src', 'ts', 'kg.ts'))) {
        try {
            const ec = require('./engine-check.js');
            engine = {api: ec, handle: ec.loadEngine(ec.compileEngine(repo))};
        } catch (e) {
            console.log('(engine column disabled: ' + e.message + ')');
        }
    }
    const engineSays = doc => {
        if (!engine) return 'n/a';
        const r = engine.api.parseWithEngine(engine.handle, doc);
        return r.threw ? 'throws ' + r.threw.split(':')[0] : r.unknownTypes.length ? 'ignores unknown type ' + r.unknownTypes.join(',') : 'accepts silently';
    };

    console.log('kgjs schema negative tests  (' + new Date().toISOString() + ')');
    console.log('  schemas: ' + schemaDir);
    console.log('  engine column: ' + (engine ? 'kgjs authoring layer compiled from ' + repo : 'not available'));
    console.log('');

    let failed = 0;
    CASES.forEach((c, i) => {
        const bad = yaml.safeLoad(c.invalid), good = yaml.safeLoad(c.valid);
        const badP = permissive(bad), badS = strict(bad);
        const firstError = (strict.errors || []).filter(e => e.keyword !== 'if')[0];
        const goodP = permissive(good), goodS = strict(good);
        const problems = [];
        if (badS) problems.push('strict schema ACCEPTED the invalid document');
        if (c.rejectedBy === 'both' && badP) problems.push('permissive schema ACCEPTED the invalid document');
        if (c.rejectedBy === 'strict' && !badP) problems.push('permissive schema rejected a document that only has an unknown property');
        if (!goodP) problems.push('permissive schema REJECTED the corrected document: ' + JSON.stringify(permissive.errors.filter(e => e.keyword !== 'if')[0]));
        if (!goodS) problems.push('strict schema REJECTED the corrected document: ' + JSON.stringify((strict.errors || []).filter(e => e.keyword !== 'if')[0]));
        const ok = problems.length === 0;
        if (!ok) failed++;
        console.log((ok ? 'PASS' : 'FAIL') + '  ' + String(i + 1).padStart(2) + '. ' + c.name);
        console.log('         invalid: permissive=' + (badP ? 'accepts' : 'rejects') + ' strict=' + (badS ? 'accepts' : 'rejects') +
            (firstError ? '  [' + firstError.instancePath + ' ' + firstError.message + (firstError.params.additionalProperty ? ': ' + firstError.params.additionalProperty : firstError.params.missingProperty ? '' : '') + ']' : ''));
        console.log('         corrected: permissive=' + (goodP ? 'accepts' : 'rejects') + ' strict=' + (goodS ? 'accepts' : 'rejects'));
        if (engine) console.log('         kgjs engine on the invalid document: ' + engineSays(bad) + ';  on the corrected one: ' + engineSays(good));
        problems.forEach(p => console.log('         !! ' + p));
    });
    console.log('');
    console.log('SUMMARY negative tests: ' + (CASES.length - failed) + ' / ' + CASES.length + ' passed' +
        '  (each test = 1 invalid document that must be rejected + 1 corrected document that must be accepted)');
    process.exit(failed ? 1 : 0);
}

main();
