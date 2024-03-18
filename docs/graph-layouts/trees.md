---
layout: documentation
title: Trees
---

Tree diagrams are special kinds of graphs comprised of *nodes* and *edges* which connect those nodes.

KGJS creates trees using an axisless graph whose dimensions are fixed at $24 \times 24$ since that's easily divisible by many numbers, and can therefore accommodate a range of layouts. For convenience, while you're authoring, a grid showing the coordinate system is available to you; just put `showGrid: true` under `tree` and it will display the following grid:

<div width="500" height="410" class="codePreview">

layout:
  OneTree:
    tree:
    
      # you can see a grid for help in authoring
      # remove or set to false when publishing 
      showGrid: true
      
      # all trees must have a nodes object
      nodes:
      - coordinates: [12, 12]

</div>

In the examples below, we've included line `showGrid: false`; if you want to see the grid, just change that to `showGrid: true`.

## Nodes and Edges

A `tree` object is just like a `graph` object, and in fact they are identical. However, a `tree` must have a child called `nodes`, and may have a child called `edges`.

### Nodes

A node is a special kind of [Point](../graph-objects/point). Because it generates a `Point` object, you can do everything you can with a `Point`: for example, give it a label, a color, a radius, etc:

<div width="500" height="410" class="codePreview">

layout:
  OneTree:
    tree:
      showGrid: false
      
      nodes: # list of nodes
      - coordinates: [6,12]
        color: colors.blue
        label:
          text: A
          position: br
      - coordinates: [18,12]
        color: colors.red
        label:
          text: B

</div>

So far, there's nothing that a node can do that a `Point` can't. However, we can name nodes and connect them with edges:

<div width="500" height="410" class="codePreview">

layout:
  OneTree:
    tree:
      showGrid: false
      
      nodes: # list of nodes
      - name: A
        coordinates: [6,12]
        color: colors.blue
        label:
          text: A
          position: br
      - name: B
        coordinates: [18,12]
        color: colors.red
        label:
          text: B

      edges: # list of edges
      - node1: A
        node2: B
        color: colors.purple

</div>

Now in fact, an edge is just a [Segment](../graph-objects/segments-arrows) that takes its coordinates from the referenced nodes. So you can use any formatting you would for a segment, including adding an arrow or trimming it:

<div width="500" height="410" class="codePreview">

layout:
  OneTree:
    tree:
      showGrid: false
      
      nodes: # list of nodes
      - name: A
        coordinates: [6,12]
        color: colors.blue
        label:
          text: A
          position: br
      - name: B
        coordinates: [18,12]
        color: colors.red
        label:
          text: B

      edges: # list of edges
      - node1: A
        node2: B
        color: colors.purple
        endArrow: true
        trim: 0.1

</div>

