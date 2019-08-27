---
layout: documentation
title: Styling Graph Objects
---

By default, there are named colors called `blue`, `orange`, `green`, `red`, `purple`, `brown`, `magenta`, `grey` or `gray`, and `olive`. These correspond to the colors in [d3.schemeCategory10](https://github.com/d3/d3-scale-chromatic#schemeCategory10){:target="_blank"}. Circle _A_ below is colored this way.

Because d3 is available, you can access other d3 color functions; for example, circle _B_ uses the purple in the `d3.schemeDark2` palette.

You can specify a hex color code (as in circle _C_) and RGB color code (as in circle _D_); however, notice that the hex codes need to be wrapped in double quotes and _then_ single quotes in order to be read properly!
  
<div width="500" height="416" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Circle:
          center: [3,7]
          color: red
          label: {text: A}
      - Circle:
          center: [7,7]
          color: d3.schemeDark2[2]
          label: {text: B}
      - Circle:
          center: [3,3]
          color: "'#224466'"
          label: {text: C}
      - Circle:
          center: [7,3]
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
          center: [5,5]
          color: PurpleCow
      - Arrow:
          begin: [2,2]
          end: [8,2]
          color: GarnetRed
         

</div>

Some objects can have both a `stroke` color (for lines/curves) and a `fill` color (to fill an area). If you just use `color` as an attribute, it will use that color for both of these. However, if you want a _different_ color for the stroke and fill, you need to specify them separately:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      
      # color not specified (blue is default)
      - Circle:
          center: [2,5]
          
      # red specified, used for stroke and fill
      - Circle:
          center: [5,5]
          color: red
          
      # different stroke and fill colors specified
      - Circle:
          center: [8,5]
          stroke: blue
          fill: red        

</div>

Note that each shape type has a default color (points and circles are blue, lines are orange, etc.) so that they show up even if you don't specify a color.

## Stroke attributes

Besides colors, strokes can have different attributes:
* `strokeWidth` sets the thickness of the stroke (in pixels); the default is 1
* `lineStyle` sets the style of drawing to `solid` (the default), `dashed`, or `dotted`

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      
      # default
      - Line: {yIntercept: 10}
          
      # thin
      - Line: {strokeWidth: 0.5, yIntercept: 8}
          
      # thick
      - Line: {strokeWidth: 10, yIntercept: 6}
          
      # dashed
      - Line: {lineStyle: dashed, yIntercept: 4}
          
      # dotted
      - Line: {lineStyle: dotted, yIntercept: 2}

</div>

## Fill attributes

Besides colors, fills can also have different attributes:
* `opacity` determines how transparent a fill is; by default, it is set to 0.2 (20%)
* future feature: `fillPattern`

<div width="500" height="416" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      
      # default opacity (0.2)
      - Circle:
          center: [2,5]
          
      # medium opacity (0.5)
      - Circle:
          center: [5,5]
          opacity: 0.5
          
      # not opaque at all (1)   
      - Circle:
          center: [8,5]
          opacity: 1        

</div>