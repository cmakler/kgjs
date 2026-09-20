#!/usr/bin/env node
/*
 * editor-check.js -- OPTIONAL: does the schema actually work in an editor?
 *
 * Drives yaml-language-server (the engine inside the VS Code "YAML" extension by Red Hat) against
 * the generated schemas: asks it for diagnostics, completions and a hover on small documents.
 *
 *   npm install --no-save yaml-language-server@1.15.0     (not a dependency of the other tools)
 *   node editor-check.js [<schema dir>]
 */
'use strict';
let getLanguageService, TextDocument;
try {
    ({getLanguageService} = require('yaml-language-server'));
    ({TextDocument} = require('vscode-languageserver-textdocument'));
} catch (e) {
    console.error('editor-check.js needs yaml-language-server:  npm install --no-save yaml-language-server@1.15.0');
    process.exit(2);
}
const fs = require('fs'); const path = require('path'); const {pathToFileURL, fileURLToPath} = require('url');
const schemaDir = path.resolve(process.argv[2] || path.join(__dirname, '..', '..', 'schema'));
console.log('yaml-language-server ' + require('yaml-language-server/package.json').version + ' against ' + schemaDir + '  (' + new Date().toISOString() + ')');
async function run(schemaFile) {
  const schemaUri = pathToFileURL(path.join(schemaDir, schemaFile)).toString();
  const ls = getLanguageService({
    schemaRequestService: async uri => fs.readFileSync(fileURLToPath(uri), 'utf8'),
    workspaceContext: {resolveRelativePath: (rel, res) => new URL(rel, res).toString()}
  });
  ls.configure({validate: true, completion: true, hover: true, schemas: [{uri: schemaUri, fileMatch: ['*.kg.yml']}]});
  const text = [
    'layout:',
    '  OneGraph:',
    '    graph:',
    '      objects:',
    '      - Point:',
    '          coordinates: [6,4]',
    '          colour: red',
    '      - Pont:',
    '          coordinates: [1,2]',
    '      - Point:',
    '          coordinates: [3,3]',
    '          dr',
    ''].join('\n');
  const doc = TextDocument.create('file:///demo.kg.yml', 'yaml', 1, text);
  const diags = await ls.doValidation(doc, false);
  console.log('== ' + schemaFile + ': ' + diags.length + ' diagnostics');
  diags.forEach(d => console.log('   line ' + (d.range.start.line + 1) + ': ' + d.message.split('\n')[0].slice(0, 140)));
  // completion after "dr" on line 12 (0-based 11), column 12
  const comp = await ls.doComplete(doc, {line: 11, character: 12}, false);
  console.log('   completions at "dr|" inside a Point: ' + comp.items.map(i => i.label).slice(0, 12).join(', ') + (comp.items.length > 12 ? ' ... (' + comp.items.length + ' total)' : ''));
  // completion of object type names: new list item
  const text2 = 'layout:\n  OneGraph:\n    graph:\n      objects:\n      - Li';
  const doc2 = TextDocument.create('file:///demo2.kg.yml', 'yaml', 1, text2);
  const comp2 = await ls.doComplete(doc2, {line: 4, character: 10}, false);
  console.log('   completions at "- Li|": ' + comp2.items.map(i => i.label).slice(0, 10).join(', ') + ' (' + comp2.items.length + ' total)');
  const text3 = 'layout:\n  One';
  const comp3 = await ls.doComplete(TextDocument.create('file:///demo3.kg.yml', 'yaml', 1, text3), {line: 1, character: 5}, false);
  console.log('   completions at "layout: One|": ' + comp3.items.map(i => i.label).slice(0, 10).join(', ') + ' (' + comp3.items.length + ' total)');
  const hover = await ls.doHover(TextDocument.create('file:///demo4.kg.yml', 'yaml', 1, 'params:\n- name: a\n  round: 0.01\n'), {line: 2, character: 4});
  console.log('   hover on params[].round: ' + (hover && hover.contents ? JSON.stringify(hover.contents.value || hover.contents).slice(0, 200) : 'none'));
}
(async () => { await run('kg.schema.json'); await run('kg.strict.schema.json'); })().catch(e => { console.error('FAILED', e); process.exit(1); });
