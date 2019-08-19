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

They are actually closed paths, so if you fill them in you fill in the area above them -- that is, the set of points for which the value of the function is greater than the level:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Contour:
          level: 16
          fn: "(x)*(y)"
          fill: green
      - Label:
          coordinates: [8,8]
          text: xy > 16
          color: green
          bgcolor: none

</div>

If you want to fill in the area _below_ the contour line, change the sign of both the function and the threshold! (I might make a way to do this is a less hacky fashion...)

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Contour:
          level: -16
          fn: "-(x)*(y)"
          fill: red
      - Label:
          coordinates: [2,2]
          text: xy < 16
          color: red
          bgcolor: none

</div>