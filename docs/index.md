---
layout: documentation
title: KGJS
---

KGJS is a JavaScript engine that takes a description of an interactive graph and renders that graph in a browser.

The engine understands JSON as the language describing the graphs, but as an author you can use YAML, which is then translated into JSON. This is generally easier to read and edit.

Getting up and running with KGJS is quite simple: you just need a single Javascript file and a single CSS file. Each `div` with class `kg-container` that contains a graph definition will be rendered in place. You can start by downloading <a href="hello-world" download>this Hello World HTML file</a> and open it in a browser; you can edit it in a text editor to have an instant playground.

In many of the pages that follow, you'll be able to also play with live code and see how it renders; you can take that code and paste it into a local HTML document if you'd like to experiment more offline. For example, the following live code editor has the same graph as in the Hello World HTML file. Try changing the coordinates or the colors of the points:

<div width="500" height="410" class="codePreview">

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

Getting started:
* [parmameters and calculations](param.html)

Graph objects:
* [point](point.html)
* [line](line.html)
* [curve](curve.html)
* [drag](drag.html)
