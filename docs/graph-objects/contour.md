---
layout: documentation
title: Contours
---

Contours are used to draw contour lines. They take a multivariate function and a threshold level:


<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Contour:
          level: 16
          fn: "(x)*(y)"
      - Label:
          coordinates: [4,4]
          text: "'xy = 16'"
          color: grey

</div>

You can either define a threshold level directly, or via a point. For example, the following code draws a contour line for f(x,y) = f(4,4):

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Contour:
          coordinates: [4,4]
          fn: "(x)*(y)"
      - Point:
          coordinates: [4,4]

</div>

You can shade the areas above and below the contour line by specifying colors in the `fillAbove` and `fillBelow` attributes:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Contour:
          level: 16
          fn: "(x)*(y)"
          fillAbove: green
          fillBelow: red
      - Label:
          coordinates: [8,8]
          text: xy > 16
          color: green
          bgcolor: none
      - Label:
          coordinates: [2,2]
          text: xy < 16
          color: red
          bgcolor: none
</div>
