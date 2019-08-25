import json
import codecs

__author__ = 'cmakler'

libraries = [
    "node_modules/katex/dist/contrib/auto-render.min.js",
    "node_modules/katex/dist/katex.min.js",
    "node_modules/d3/dist/d3.min.js",
    "node_modules/mathjs/dist/math.min.js",
    "node_modules/js-yaml/dist/js-yaml.min.js"
]

result = ''
for file_name in libraries:
    with codecs.open(file_name, 'r', encoding='utf8') as infile:
        print '  Appending ' + file_name + '\n'
        result += infile.read() + "\n\n"
        infile.close()
with codecs.open('build/lib/kg-lib.js', 'w', encoding='utf8') as outfile:
    outfile.write(result)
    outfile.close()