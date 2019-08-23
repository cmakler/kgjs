---
layout: documentation
title: Shapes and Areas
---

There are various shapes that can be drawn, from standard SVG shapes like circles and rectangles to shapes defined by functions.

## Basic Shapes

A **Rectangle** is defined by two points, (`a` and `b`), or by four coordinates (`x1`, `x2`, `y1`, and `y2`). By default, it will have a grey fill and no stroke, but those can be set as with all [graph objects](index.html).

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Rectangle:
          a: [1,1]
          b: [4,4]
          color: blue
          label: {text: A}
      - Rectangle:
          x1: 5
          x2: 8
          y1: 2
          y2: 6
          color: red
          stroke: colors.blue
          strokeWidth: 1
          label: {text: B}

</div>

A **Circle** is defined by a center point and a radius. The center point may be defined by the attribute `center`, `c`, or `coordinates`. The radius is defined by `radius` or `r` and is set to 1 as a default:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Circle:
          c: [3,3]
          label: {text: A}
      - Circle:
          center: [6,6]
          radius: 3
          color: red
          stroke: colors.blue
          strokeWidth: 1
          label: {text: B}

</div>

For both _Rectangle_ and _Circle_, if you have a `label` attribute it will place the label in the center of the shape.

An **Area** is defined by two functions. If you just specify one function, it assumes the other is f(x) = 0 (and shades the area under the curve); alternatively, you can set `above:true` and it shades the area above the function. If you specify two functions (`fn1` and `fn2`), it shades the area between the functions:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      
      # Area under the function 1 + 0.05x^2
      - Area:
          fn: 1 + 0.05*(x)^2
          
      # Area between two functions
      - Area:
          fn1: 2 + 0.05*(x)^2
          fn2: 3 + 0.05*(x)^2
          fill: red
          
      # Area above the function 4 + 0.05x^2
      - Area:
          fn: 4 + 0.05*(x)^2
          above: true
          fill: green

</div>

Note that if you draw a [Curve](curve.html), you can also use `areaAbove` and `areaBelow` to shade in the area above and below the curve; in fact, all this does is generate an Area object using the curve's function as the base function.

## Composite Shapes and Clip Paths

Sometimes you want to shade an area that's the overlap of two shapes. You can doing that using an **Overlap** object:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      
      # Blue circle
      - Circle:
          center: [4,4]
          radius: 2
          stroke: blue
          fill: none
          
      # Red circle
      - Circle:
          center: [6,4]
          radius: 2
          stroke: red
          fill: none
          
      # Overlap area
      - Overlap:
          fill: purple
          shapes:
          - Circle:
              center: [4,4]
              radius: 2
          - Circle:
              center: [6,4]
              radius: 2

</div>

On the other hand, sometimes you want to "cut out" shapes from an object. To do this, you can add a `clipPaths` attribute to the object and give it an array of shapes. Often the best way to do this is to make a rectangle that's the size of the entire graph, and then add the clipPaths to it to shade the sum of those areas:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      
      - Circle:
          center: [4,4]
          radius: 2
          stroke: blue
          fill: none
          
      # Red circle
      - Circle:
          center: [6,4]
          radius: 2
          stroke: red
          fill: none
          
      # Overlap area
      - Rectangle:
          a: [0,0]
          b: [10,10]
          fill: purple
          clipPaths:
          - Circle:
              center: [4,4]
              radius: 2
          - Circle:
              center: [6,4]
              radius: 2
          
</div>