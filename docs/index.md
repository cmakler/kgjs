---
layout: default
---

KGJS is a JavaScript engine that takes a description of an interactive graph and renders that graph in a browser.

The engine understands JSON as the language describing the graphs, but as an author you can use YAML, which is then translated into JSON. This is generally easier to read and edit.

Getting up and running with KGJS is quite simple: you just need a single Javascript file and a single CSS file. Each `div` with class `kg-container` that contains a graph definition will be rendered in place.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hello World</title>
    <link href="https://cmakler.github.io/kgjs/css/kg.0.2.0.css" rel="stylesheet" type="text/css">
    <script src="https://cmakler.github.io/kgjs/js/kg.0.2.0.js"></script>
</head>
<body>

The text in the following div will be rendered using KGJS:

<div class="kg-container">

layout:
  OneGraph:
    graph:
      objects:

      # Point object at coordinates (6,4)
      - Point:
          coordinates: [6,4]
          
      # Red point object at coordinates (3,3)
      - Point:
          coordinates: [3,3]
          color: red

</div>

</body>
</html>

```

In many of the pages that follow, you'll be able to also play with live code and see how it renders; you can take that code and paste it into a local HTML document if you'd like to experiment more offline.

Getting started:
* [parmameters and calculations](param.html)

Graph objects:
* [point](point.html)
* [line](line.html)
* [curve](curve.html)
