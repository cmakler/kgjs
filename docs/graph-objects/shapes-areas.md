---
layout: documentation
title: Shapes and Areas
---

There are various shapes that can be drawn, from standard SVG shapes like circles and rectangles to shapes defined by functions.

## Basic Shapes

A **Rectangle** is defined by two points, (`a` and `b`), or by four coordinates (`x1`, `x2`, `y1`, and `y2`). By default, it will have a blue fill and no stroke, but those can be set as with all [graph objects](index.html).

<div width="300" height="250" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Rectangle: {a: [1,1], b: [4,4]}
      - Rectangle:
          x1: 5
          x2: 8
          y1: 2
          y2: 6
          fill: red
          stroke: blue
          strokeWidth: 1
          label: {text: R}

</div>

A **Circle** is defined by a center point and a radius. The center point may be defined by the attribute `center`, `c`, or `coordinates`. The radius is defined by `radius` or `r` and is set to 1 as a default:

<div width="300" height="250" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Circle: {coordinates: [2,2]}
      - Circle: {c: [2,9], r: 0.5, color: green}
      - Circle:
          center: [6,5]
          radius: 3
          fill: red
          stroke: blue
          label: {text: C}

</div>

For both **Rectangle** and **Circle**, if you have a `label` attribute it will place the label in the center of the shape.

## Areas

An **Area** is defined by two functions. If you just specify one function, it assumes the other is f(x) = 0 (and shades the area under the curve); alternatively, you can set `above:true` and it shades the area above the function. If you specify two functions (`fn1` and `fn2`), it shades the area between the functions:

<div width="300" height="250" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Area:       # area under function (blue)
          fn: 1 + 0.05*(x)^2
      - Area:       # area between functions (red)
          fn1: 2 + 0.05*(x)^2
          fn2: 3 + 0.05*(x)^2
          fill: red
      - Area:       # area above function (green)
          fn: 4 + 0.05*(x)^2
          above: true
          fill: green
</div>

Note that if you draw a [Curve](curve.html), you can also use `areaAbove` and `areaBelow` to shade in the area above and below the curve; in fact, all this does is generate an Area object using the curve's function as the base function. You can specify just `areaBelow: true` to shade the entire area under the curve the same color as the curve itself, with an opacity of 0.2; or you can specify a string color; or you can specify an entire definition of an Area. Note that the `color`, `min`, and `max` attributes will inherit from the **Curve** parent, but can be overridden if you only want to shade a region under the curve!

<div width="300" height="250" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Curve:
          fn: 1 + 0.05*(x)^2
          max: 5
          areaBelow: true
      - Curve:
          fn: 1 + 0.05*(x)^2
          min: 5
          color: red
          areaBelow: {min: 8, opacity: 0.8}
          areaAbove: green
      
</div>

## Composite Shapes and Clip Paths

Sometimes you want to shade an area that's the overlap of two shapes. You can doing that using an **Overlap** object:

<div width="300" height="250" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      
      - Circle: {c: [4,4], r: 2, fill: none}
      
      - Circle: {c: [6,4], r: 2, fill: none}
      
      - Overlap:
          fill: purple
          shapes:
          - Circle: {c: [4,4], r: 2}
          - Circle: {c: [6,4], r: 2}

</div>

On the other hand, sometimes you want to "cut out" shapes from an object. To do this, you can add a `clipPaths` attribute to the object and give it an array of shapes. Often the best way to do this is to make a rectangle that's the size of the entire graph, and then add the clipPaths to it to shade the sum of those areas:

<div width="300" height="250" class="codePreview">
      
layout:
  OneGraph:
    graph:
      objects:
      
      - Circle: {c: [4,4], r: 2, fill: none}
      
      - Circle: {c: [6,4], r: 2, fill: none}
      
      - Rectangle:
          a: [0,0]
          b: [10,10]
          fill: purple
          clipPaths:
          - Circle: {c: [4,4], r: 2}
          - Circle: {c: [6,4], r: 2}
          
</div>