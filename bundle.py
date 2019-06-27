import json
import codecs

__author__ = 'cmakler'

bundles = [
    {
        "name": "kg.0.1.5.js",
        "dest_directories": ['build/bundled/','docs/js/','docs/playground/code/'],
        "order": [
            "build/lib/kg-lib.js",
            "build/kg.js"
        ]
    },
    {
        "name": "kg.0.1.5.css",
        "dest_directories": ['build/bundled/','docs/css/'],
        "order": [
            "build/lib/kg-lib.css",
            "build/kg.css"
        ]
    },
    {
        "name": "kg-tufte.0.1.5.css",
        "dest_directories": ['build/bundled/'],
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
