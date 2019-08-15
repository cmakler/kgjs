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

The key to an interactive graph, of course, is interactivity: that is, the ability of the user to change things. KGJS handles this by defining a set of parameters that the user can change, and then making it easy to adjust the parameters by dragging objects or using sliders:

<div width="500" height="410" class="codePreview">
params:

- name: blueX    # x-coordinate of blue point
  value: 6

- name: redY     # y-coordinate of red point
  value: 3
  min: 2
  max: 6
  round: 0.25
    
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [params.blueX, 4]
          draggable: true
      - Point:
          coordinates: [3, params.redY]
          color: red
          draggable: true

</div>

Notice that the min, max, and round attributes of `blueX` aren't set; KGJS will set sensible defaults (round to the nearest integer, don't allow dragging off the graph) whenever possible. By contrast, these attributes _are_ set for `redY`, so the dot snaps to every 0.25 instead of every integer.

This documentation starts of by describing the way in which user-changeable parameters are used; it then describes generic graph objects like points, lines, and curves; and finally some specialty macros designed for creating graphs for economics.


Getting started:
* [parmameters and calculations](param.html)
* [drag](drag.html)

Graph objects:
* [point](point.html)
* [line](line.html)
* [curve](curve.html)

Econ Stuff: 
* [Econ Linear Supply, Demand, Equilibrium](econLinearSupplyDemand.html)