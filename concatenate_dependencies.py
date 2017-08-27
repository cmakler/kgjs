import json
import codecs

__author__ = 'cmakler'

src_directory = 'src/lib/'
dest_directory = 'build/lib/'

with open(src_directory + 'config.json') as configfile:
    raw_file_data = configfile.read()
    bundles = json.loads(raw_file_data)
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