---
layout: documentation
title: Contours
---

A *Contour* object is used to draw a contour line. It takes a multivariate function and a threshold level:


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
          text: x \times y = 16
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
          droplines:
            vertical:
            horizontal: 
      - Label:
          coordinates: [2,8]
          text: x \times y = 4 \times 4
          color: grey

</div>

Contour lines are grey by default, with a `strokeWidth` of 1. You can change the color of the contour line itself using the `color` or `stroke` attribute. You can shade the areas above and below the contour line by specifying colors in the `fillAbove` and `fillBelow` attributes:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Contour:
          level: 16
          fn: "(x)*(y)"
          color: blue
          fillAbove: green
          fillBelow: red
      - Label:
          coordinates: [8,8]
          text: x \times y > 16
          color: green
          bgcolor: none
      - Label:
          coordinates: [2,2]
          text: x \times y < 16
          color: red
          bgcolor: none
</div>

A *ContourMap* object takes a function and an array of levels and generates the contours for them. By default, it makes the contour lines thinner (0.5px rather than 1px):

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - ContourMap:
          levels: [1, 4, 9, 16, 25, 36, 49, 64, 81]
          fn: "(x)*(y)"
      
</div>