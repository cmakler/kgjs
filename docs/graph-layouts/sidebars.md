---
layout: documentation
title: Sidebars
---

## Layouts with Sidebars

The graphs on the previous page _only_ had graphs, but generally you want to present the graph with a title, some text, and often some controls like sliders. These are presented in what we call a *Sidebar*.

While graphs always have the same aspect ratio, the Sidebar may be placed to the right of the graph or below it, depending on how wide the user's window is. For wide windows, the Sidebar is placed to the right:

<div width="800" height="500" class="codePreview">

layout:
  OneGraphPlusSidebar:
    graph: 
      xAxis:
        title: X Axis
      yAxis:
        title: Y Axis
    sidebar:
      controls:
      - title: Graph Title
        description: This is a description.
      
</div>

If there isn't enough space, the Sidebar is positioned below the graph:

<div width="490" height="560" class="codePreview">

layout:
  OneGraphPlusSidebar:
    graph: 
      xAxis:
        title: X Axis
      yAxis:
        title: Y Axis
    sidebar:
      controls:
      - title: Graph Title
        description: This is a description.
      
</div>

Available layouts with sidebars are:

* OneWideGraphPlusSidebar
* TwoVerticalGraphsPlusSidebar
* TwoHorizontalGraphsPlusSidebar

3D graphs with sidebars will be coming soon...


## Layouts with Multiple Controls

The TwoHorizontalGraphs layout optionally take `leftControl` and `rightControl` children; these place sidebar-like controls underneath the two graphs:

<div width="500" height="480" class="codePreview">

layout:
  TwoHorizontalGraphs:
    leftGraph:
      xAxis: {title: Left X Axis}
      yAxis: {title: Left Y Axis}
    leftControls:
      title: Left Graph
      description: Description of left graph
    rightGraph:
      xAxis: {title: Right X Axis}
      yAxis: {title: Right Y Axis}
    rightControls:
      title: Right Graph
      description: Description of right graph
      
</div>

The ThreeHorizontalGraphs also has this capability; see [this example](https://www.econgraphs.org/graphs/micro/equilibrium/partial_equilibrium/total_surplus).