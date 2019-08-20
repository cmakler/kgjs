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

You can shade the areas above and below the contour line by specifying colors in the `areaAbove` and `areaBelow` attributes:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Contour:
          level: 16
          fn: "(x)*(y)"
          areaAbove: green
          areaBelow: red
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
