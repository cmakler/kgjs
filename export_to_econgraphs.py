import json
import codecs

__author__ = 'cmakler'

src_directory = 'build/'
dest_directories = ['../econgraphs/static/', '../kg-authoring/static/']

bundles = [
    {
        "name": "kg.0.1.1.js",
        "order": [
            "lib/kg-lib.js",
            "kg.js"
        ]
    },
    {
        "name": "kg.0.1.1.css",
        "order": [
            "lib/kg-lib.css",
            "kg.css"
        ]
    },
    {
        "name": "kg-tufte.0.1.1.css",
        "order": [
            "lib/kg-tufte.css",
            "kg.css"
        ]
    }
]
for dest_directory in dest_directories:
    for bundle in bundles:
        result = ''
        bundle_name = bundle['name']
        print 'Processing bundle ' + bundle_name + '\n'
        for file_name in bundle['order']:
            with codecs.open(src_directory + file_name, 'r', encoding='utf8') as infile:
                print '  Appending ' + file_name + '\n'
                result += infile.read() + "\n\n"
                infile.close()
        with codecs.open(dest_directory + bundle_name, 'w', encoding='utf8') as outfile:
            outfile.write(result)
            outfile.close()
