# A JSON Schema for the kgjs authoring format, generated from the TypeScript source

This folder answers [kgjs issue #51](https://github.com/cmakler/kgjs/issues/51) ("Adding a yaml and
json schema for no code users"): a schema that gives YAML/JSON authors autocomplete, hover help and
typo checking in their editor, **generated automatically from the TypeScript definitions** rather
than written by hand.

```
tools/schema/generate.js        the generator (TypeScript compiler API)  -> schema/*.json
tools/schema/crosscheck.js      independent regex re-derivation of the class -> interface map
tools/schema/validate-docs.js   validates every example in docs/ against the schemas
tools/schema/negative-tests.js  28 invalid documents that must be rejected (+ corrected twins)
tools/schema/mutation-test.js   misspells every key of every docs example; strict must reject
tools/schema/engine-check.js    runs kgjs's own authoring parser on the examples (Node, no browser)
tools/schema/render-check.js    optional: builds a full KG.View under jsdom
tools/schema/editor-check.js    optional: drives yaml-language-server against the schemas
schema/kg.schema.json           permissive schema (unknown properties allowed)
schema/kg.strict.schema.json    strict schema (unknown properties rejected)
schema/class-map.json           class -> definition interface -> rendering class (for review)
```

Generated from kgjs commit `413f99731fe15bd9d436faab108cff220323fdd4` (2026-09-12); the commit hash
is also recorded in the `$comment` of both schema files.

## Using the schema in an editor

VS Code with the **YAML** extension (Red Hat, `redhat.vscode-yaml`; it embeds
`yaml-language-server`). Put this comment on the first line of a graph file:

```yaml
# yaml-language-server: $schema=../schema/kg.schema.json
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [6, 4]
          droplines: {vertical: a_1}
```

The path is relative to the YAML file; an absolute path or an `https://` URL of the raw file works
too. Alternatively map a file pattern once, in `.vscode/settings.json`:

```json
{ "yaml.schemas": { "./schema/kg.schema.json": ["graphs/**/*.yml", "*.kg.yml"] } }
```

For JSON graph files use VS Code's built-in `"json.schemas"` setting with the same mapping. (Adding
a `"$schema"` key inside the graph file itself is not recommended: it is not a kgjs key, and the
strict schema would flag it.)

What you get: completion of layout names after `layout:`, of object types inside `objects:`
(`- Li` -> `Line`, `LineCircleIntersection`, ...), of property names inside an object, default
values, the comments of the TypeScript interfaces as hover text, and a squiggle under
`- Pont:` ("Property Pont is not allowed").

* `kg.schema.json` (**permissive**) never complains about a property it does not know. Use it for
  autocomplete without false alarms.
* `kg.strict.schema.json` (**strict**) also rejects unknown property names, so it catches
  `colour:` or `verticle:`. It is only as complete as the generator's reading of the source; if it
  flags something that works, that is a gap worth reporting (see "Limits").

`editor-check.js` confirms this with yaml-language-server 1.15.0 (diagnostics, completions, hover);
no editor was installed or tested beyond that.

## Regenerating

```bash
cd tools/schema
npm install                 # typescript, ajv, js-yaml  (about 28 MB)
node generate.js            # writes ../../schema/*.json ; prints coverage and warnings
node crosscheck.js          # 0 disagreements expected
node validate-docs.js       # every example in docs/ against both schemas
node negative-tests.js      # 28 / 28 expected
node mutation-test.js       # typo-detection rate of the strict schema
node engine-check.js --docs # kgjs's own authoring parser on the same examples
# optional
npm install --no-save jsdom@24.1.3 yaml-language-server@1.15.0
node render-check.js --docs # full engine (authoring + rendering) under jsdom
node editor-check.js        # yaml-language-server against the schemas
```

Two diagnostic variants exist to show why the generator does more than convert interfaces (write
them to a scratch folder with `--out`, never over the real schemas):
`node generate.js --declared-only` drops every property that is known only because the code reads
it (docs: strict 91/118 instead of 115/118), and `node generate.js --naive-required` makes every
non-optional interface member required (docs: 76/118).

All scripts default to the repository they live in (`../..`); pass `--repo <path>` /
`--schema-dir <path>` (or set `KGJS_REPO`) to point them elsewhere. Nothing in the repository is
modified except `schema/`. The output is deterministic (no timestamps inside the schema files).

## How the generator works

kgjs resolves a key such as `Point:` with `new KGAuthor[type](def)`, so every exported class of the
`KGAuthor` namespace that descends from `AuthoringObject` is an authorable object. The generator
parses the 141 source files reachable from `src/ts/kg.ts` (following `/// <reference path>`), and
for each class combines three sources:

| | source | example |
|---|---|---|
| A | the **definition interface**: the type of the constructor's def parameter, or, when the constructor is untyped, the interface called `<Class>Definition`; plus the `extends` chain of the interface and of the class | `Point` -> `PointDefinition` -> `GraphObjectDefinition` -> ... |
| B | what the **constructor chain reads** from `def`: `def.x`, `def['x']`, `def.hasOwnProperty('x')`, `KG.setDefaults(def, {x: 1})`, including helper functions and methods that `def` is passed to | `Segment` reads `def.handles`, `def.trim`; every layout reads `def['graph']` |
| C | the **rendering layer**: `this.type = 'Point'` hands the same def to `new KG.Point(def)`, so `KG.PointDefinition` and `setProperties(def, 'updatables', [...])` count too | `Axis` gets `ticks`, `tickPrepend`, `tickValues` |

B matters because 76 of the 148 authorable classes (all 42 layouts among them) have an untyped
constructor and no definition interface at all; an interface-only converter cannot describe them.

Each element of an `objects` list becomes `{ClassName: <definition>}`; the alternative
`{type: ClassName, def: <definition>}` form, which the engine also accepts and the JSON examples
use, is supported through `if/then/else`.

The rules for types, `required`, `null` and closed objects are listed at the top of
`generate.js`. The short version:

* `number`/`boolean` also accept strings, and `string` also accepts numbers/booleans: any value can
  be an expression such as `"params.x"` (see `UpdateListener.updateDef`), and YAML turns `y: 5` into
  a number even where the interface says `string`.
* A property is **required** only when the source shows the engine cannot do without it (it is
  dereferenced unconditionally, or the interface says non-optional *and* the code never tests,
  defaults or assigns it). For 120 (class, property) pairs a non-optional marker in an interface is
  *not* enforced for that reason; `generate.js` prints the list with the reason for each.
* Doc comments of interface members (JSDoc, `//` above or at the end of the line) become
  `description`; literal `setDefaults` values become `default`; every property carries a `$comment`
  saying where it was declared and where it is read.

The only hand-written knowledge is the list of **dispatch sites** (`DISPATCH_SITES` / `OVERRIDES`
in `generate.js`): which list accepts which family of classes (`layout`, a graph's `objects`, a
mathbox's `objects`, `clipPaths`/`shapes`, top-level `objects`, DivContainer `children`). The
generator scans the source for every `new KGAuthor[...]` / `new KG[...]` and warns if one appears
that it does not know.

## Limits

* Static analysis of untyped JavaScript-style code is approximate. The analysis follows `def`
  through aliases, `copyJSON`, `setDefaults`, helper functions, methods and callbacks, but not
  through arbitrary data flow. Where it cannot see, the strict schema may be too strict
  (a working property flagged) or too loose. The permissive schema is unaffected by the former.
* When `def` is handed to a method of another object (`utilityFunction.levelCurve(def, graph)`)
  the receiver's class is unknown without the type checker, so every KGAuthor class with a method
  of that name is followed (an over-approximation).
* `default` values are the first literal default found walking from the most-derived class
  upwards. If a subclass sets a default *after* calling `super()`, the engine uses the parent's.
* Expressions are not parsed. `slope: params.m**` is a valid string as far as any schema can tell.
* `calcs`, `colors`, `idioms`, `templateDefaults` are free-form maps.
* Internal classes that are technically reachable (`ClipPath`, `Marker`, `StartArrow`,
  `GraphObjectGenerator`, ...) appear in the completion list of object types, because the engine
  would accept them; the generator does not curate.
* The documentation examples exercise 10 of the 42 layouts and 25 of the 73 graph-object types,
  and no 3D (Mathbox) definition at all. Definitions of the remaining classes are generated by the
  same rules but have not been checked against any real document.
