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
          level: 16
          fn:
            fn: "(x)*(y)"
      - Point:
          coordinates: [4,4]

</div>
