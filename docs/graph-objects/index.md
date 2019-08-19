---
layout: documentation
title: Graph Objects
---

Graph objects are lines, shapes, and labels which may be placed within the Cartesian plane of a graph.

All graph objects have some basic attributes, which we'll describe here; the following pages will then discuss the particulars of each object type.

## Colors

By default, there are named colors called `blue`, `orange`, `green`, `red`, `purple`, `brown`, `magenta`, `grey` or `gray`, and `olive`. These correspond to the colors in [d3.schemeCategory10](https://github.com/d3/d3-scale-chromatic#schemeCategory10). Circle _A_ below is colored this way.

Because d3 is available, you can access other d3 color functions; for example, circle _B_ uses the purple in the `d3.schemeDark2` palette.

You can specify a hex color code (as in circle _C_) and RGB color code (as in circle _D_); however, notice that the hex codes need to be wrapped in double quotes and _then_ single quotes in order to be read properly!
  
<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Circle:
          x: 3
          y: 7
          color: red
          label: {text: A}
      - Circle:
          x: 7
          y: 7
          color: d3.schemeDark2[2]
          label: {text: B}
      - Circle:
          x: 3
          y: 3
          color: "'#224466'"
          label: {text: C}
      - Circle:
          x: 7
          y: 3
          color: rgb(245, 215, 66)
          label: {text: D}
         

</div>

You can specify names of colors in the `colors` attribute and use them for multiple objects:

<div width="500" height="410" class="codePreview">

colors:
  PurpleCow: rgb(81,38,152)
  GarnetRed: "'#781C2E'"
layout:
  OneGraph:
    graph:
      objects:
      - Circle:
          x: 5
          y: 5
          color: PurpleCow
      - Arrow:
          begin: [2,2]
          end: [8,2]
          color: GarnetRed
         

</div>