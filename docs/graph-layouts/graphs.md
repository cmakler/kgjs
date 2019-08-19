---
layout: documentation
title: Graphs
---

## Axes

A graph is defined by an `xAxis` and `yAxis` object. Each of these has the following attributes:

* `title`: the 
* `min`: the lowest value of the graph (defaults to 0)
* `max`: the highest value of thegraph (defaults to 10)
* `ticks`: the number of ticks to be shown (defaults to 5)
* `intercept`: the value of the _other_ graph where the two axes intersect (defaults to 0)

Here's an example in which the horizontal axis ranges from 0 to 20 with 10 ticks, and vertical axis ranges from -100 to 100 with just 5 ticks :

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      xAxis:
        max: 20
      yAxis:
        min: -100
        max: 100
        ticks: 5

</div>

And here's an example of the same graph, only the y-axis is told to intercept the x-axis at x = 10
            
<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      xAxis:
        max: 20
      yAxis:
        min: -100
        max: 100
        ticks: 5
        intercept: 10

</div>

## Axis Titles

Axis titles generally work best with "standard" layout, since the horizontal axis label is at the bottom of the graph and the vertical axis label is on the left-hand side:

Axis titles are text, but may contain LaTeX using a dollar-sign delimiter:

<div width="500" height="450" class="codePreview">

layout:
  OneGraph:
    graph:
      xAxis:
        title: Time $(s)$
      yAxis:
        title: Distance $(m)$

</div>

## Opposite Axes
            
You can add an axis as a graph object (just like any other graph object), but as of now it must have the same scale as the current axis:

<div width="500" height="460" class="codePreview">

layout:
  OneGraph:
    graph:
      xAxis:
        title: Time $(s)$
      yAxis:
        title: Distance $(m)$
      objects:
        - Axis:
            orient: right
            intercept: 10
            title: Another distance axis!

</div>
            
We're working on developing multiple scales for opposite axes, but as of now there isn't support for that functionality.

## Three-Dimensional Graphs

Three-dimensional graphs have a third axis element for the `zAxis`. More on that soon...



