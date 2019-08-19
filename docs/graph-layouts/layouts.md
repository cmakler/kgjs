---
layout: documentation
title: Layouts
---

## Layout Basics

One of the primary reasons I created KGJS was to have ability to present multiple linked graphs. (This is a critical element of economic analysis, for example when you want to see how a change in one market affects other markets.) Layouts are pre-set combinations of graphs in different configurations.

The simplest layout is the OneGraph layout, which is what is used for most of the examples in this documentation. It takes a single `graph` child, which has the definition of the one graph in it. This has an aspect ratio of 1:1, meaning it's a square:

<div width="500" height="450" class="codePreview">

layout:
  OneGraph:
    graph: 
      xAxis:
        title: Left X Axis
      yAxis:
        title: Left Y Axis
   
      
</div>

Because you sometimes don't need to use all the vertical space afforded by a square graph, there's also a OneWideGraph layout which has a 2:1 aspect ratio. If you want to have the graph appear to have the same dimensions on both axes, it's a good idea to double the number of ticks on the horizontal axis and make the scale twice as long:

<div width="500" height="240" class="codePreview">

layout:
  OneWideGraph:
    graph: 
      xAxis:
        title: Left X Axis
        ticks: 10
      yAxis:
        title: Left Y Axis
        max: 5
      
</div>

The TwoVerticalGraphs layout also has an aspect ratio of 1:1, but each of the graphs in it (defined by the children `topGraph` and `bottomGraph`) has an aspect ratio of 2:1:

<div width="500" height="440" class="codePreview">

layout:
  TwoVerticalGraphs:
    topGraph:
      xAxis:
        title: Top X Axis
      yAxis:
        title: Top Y Axis
    bottomGraph:
      xAxis:
        title: Bottom X Axis
      yAxis:
        title: Bottom Y Axis
      
</div>

A lot of the time when you use this layout, the horizontal axes have the same value, so we don't label the top graph's x-axis. Another trick is to take advantage of the knowledge that the graph will be a rectangle, and adjust the axis values so that the tick marks represent the same values:

<div width="500" height="440" class="codePreview">

layout:
  TwoVerticalGraphs:
    topGraph:
      xAxis:
        ticks: 10
      yAxis:
        max: 5
        title: Top Y Axis
    bottomGraph:
      xAxis:
        ticks: 10
        title: X Axis
      yAxis:
        max: 5
        title: Bottom Y Axis
      
</div>


The TwoHorizontalGraphs layout is has an aspect ratio of 2:1, and places two square graphs (defined by `leftGraph` and `rightGraph`) side-by-side:

<div width="500" height="250" class="codePreview">

layout:
  TwoHorizontalGraphs:
    leftGraph:
      xAxis: {title: Left X Axis}
      yAxis: {title: Left Y Axis}
    rightGraph:
      xAxis: {title: Right X Axis}
      yAxis: {title: Right Y Axis}
      
</div>

There are also layouts for larger numbers of graphs:
* ThreeHorizontalGraphs takes children `leftGraph`, `middleGraph`, and `rightGraph`.
* SquarePlusTwoVerticalGraphs takes children `bigGraph`, `topGraph`, and `bottomGraph`. Here's an [example](https://www.econgraphs.org/graphs/micro/equilibrium/general_equilibrium/ppf_and_production_functions).
* FourGraphs takes children `topLeftGraph`, `topRightGraph`, `bottomLeftGraph`, and `bottomRightGraph`.
These all do basically what you would imagine.

There are some additional specialty layouts for economics, which handle things like game matrices and Edgeworth Boxes.

It's also possible to create a custom layout by positioning a graph exactly where you want to; if you're interested in finding out more, or requesting additional layouts be constructed, drop me a line.




