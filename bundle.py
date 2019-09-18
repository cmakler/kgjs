import json
import codecs

__author__ = 'cmakler'

js_directories = [
    'build/bundled/',
    'docs/js/',
    'docs/playground/code/',
    '../electric-book/kg/js/',
    '../bh-textbook/code/',
    '../core-interactives/code/',
    '../econgraphs/static/js/'
]

js_local_directories = [
    'build/bundled/',
    'docs/js/',
    'docs/playground/code/'
]

css_directories = [
    'build/bundled/',
    'docs/css/',
    'docs/playground/code/',
    '../bh-textbook/code/',
    '../core-interactives/code/',
    '../econgraphs/static/css/'
]

bundles = [
    {
        "name": "kg-lib.js",
        "dest_directories": ["build/lib/"],
        "order": [
            "node_modules/katex/dist/katex.min.js",
            "node_modules/katex/dist/contrib/auto-render.min.js",
            "node_modules/d3/dist/d3.min.js",
            "node_modules/mathjs/dist/math.min.js",
            "node_modules/js-yaml/dist/js-yaml.min.js"
        ]
    },
    {
        "name": "kg-lib.css",
        "dest_directories": ["build/lib/"],
        "order": [
            "node_modules/katex/dist/katex.min.css"
        ]
    },
    {
        "name": "kg-tufte.js",
        "dest_directories": ["build/lib/"],
        "order": [
            "node_modules/katex/dist/katex.min.css",
            "node_modules/tufte-css/tufte.min.css"
        ]
    },
    {
        "name": "kg.0.2.4.js",
        "dest_directories": js_directories,
        "order": [
            "build/lib/kg-lib.js",
            "build/kg.js"
        ]
    },
    {
        "name": "kg-lib.js",
        "dest_directories": js_local_directories,
        "order": [
            "build/lib/kg-lib.js"
        ]
    },
    {
        "name": "kg.js",
        "dest_directories": js_local_directories,
        "order": [
            "build/kg.js"
        ]
    },
    {
        "name": "kg.js.map",
        "dest_directories": js_local_directories,
        "order": [
            "build/kg.js.map"
        ]
    },
    {
        "name": "kg.0.2.4.css",
        "dest_directories": css_directories,
        "order": [
            "build/lib/kg-lib.css",
            "build/kg.css"
        ]
    },
    {
        "name": "kg-tufte.0.2.4.css",
        "dest_directories": css_directories,
        "order": [
            "build/lib/kg-tufte.css",
            "build/kg.css"
        ]
    }
]

for bundle in bundles:
    for dest_directory in bundle['dest_directories']:
        result = ''
        bundle_name = bundle['name']
        print 'Processing bundle ' + bundle_name + '\n'
        for file_name in bundle['order']:
            with codecs.open(file_name, 'r', encoding='utf8') as infile:
                print '  Appending ' + file_name + '\n'
                result += infile.read() + "\n\n"
                infile.close()
        with codecs.open(dest_directory + bundle_name, 'w', encoding='utf8') as outfile:
            outfile.write(result)
            outfile.close()
