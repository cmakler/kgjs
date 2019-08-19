---
layout: documentation
title: Contours
---

Contours are used to draw contour lines. They take a multivariate function and a threshold level:


<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      xAxis:
        max: 20
      yAxis:
        max: 20
      objects:
      - Contour:
          level: 25
          fn: "(x)*(y)"
      - Label:
          coordinates: [5,5]
          text: "'xy = 25'"
          color: grey

</div>

They are actually closed paths, so if you fill them in you fill in the area above them:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      xAxis:
        max: 20
      yAxis:
        max: 20
      objects:
      - Contour:
          level: 25
          fn: "(x)*(y)"
          fill: green
      - Label:
          coordinates: [15,15]
          text: xy > 25
          color: green
          bgcolor: none

</div>

If you want to fill in the area _below_ the contour line, change the sign of both the function and the threshold! (I might make a way to do this is a less hacky fashion...)

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      xAxis:
        max: 20
      yAxis:
        max: 20
      objects:
      - Contour:
          level: -25
          fn: "-(x)*(y)"
          fill: red
      - Label:
          coordinates: [3,3]
          text: xy < 25
          color: red
          bgcolor: none

</div>