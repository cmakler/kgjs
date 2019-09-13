---
layout: documentation
title: Segments and Arrows
---

Here, we discuss segments and arrows, two connected types of graph objects that differ from lines in a few important ways. 

## Segments

Let's start with a basic segment, shown below: 

<div width="500" height="400" class="codePreview">


layout:
  OneGraph:
    graph:
      objects:
      - Segment:
          a: [2,2]
          b: [8,7]
          label:
            text: x
            location: 0.8

</div>

A **segment** is defined by a point a (the beginning of the segment) and point b (the end of the segment). Of note, it can also be labelled with text that shows up at a location specific by its _length along the segment_. In other words, in the example above. the 0.8 for location means that the text will show up 8/10ths of the way along the segment. When we add draggability to segments, this is useful because the placement of the text will adjust as the segment changes. 

As with other graph objects, you can customize your segments in numerous ways: 

<div width="500" height="400" class="codePreview">


layout:
  OneGraph:
    graph:
      objects:
      - Segment:
          a: [2,8]
          b: [9,1]
          color: grey
          strokeWidth: 4
          lineStyle: dotted
          label:
            text: "\\text{This is a segment.}"
            location: 0.8

</div>

## Arrows

Arrows are similar to segments, but include one or two pointers on the ends, as shown below: 

<div width="500" height="400" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:     
      - Arrow:
          begin: [3,5]
          end: [5,7]
          color: blue
          
          
</div>

Notice that, unlike segments, arrows use `begin` and `end` as their coordinate attributes. Now let's look at a more customized arrow: 

<div width="500" height="400" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:     
      - Arrow:
          begin: [3,5]
          end: [5,7]
          color: blue
          trim: 0.1
          double: true
      - Point: 
          coordinates: [5,7]
          
</div>

A few things to note about the more complex arrow: 
* The `trim` of an arrow refers to how much the arrow is trimmed away from its actual beginning and end points. As you can see, the arrow does not quite touch the point (5,7) where the point is, even though the arrow technically ends there. That is because the trim is shaving it down for aesthetic purposes. This is very useful when the arrow points to an object. 
* `double` is a boolean attribute that, when true, creates a double-sided arrow. Without the `double: true`, the arrow is single-sided with the pointer at its `end` coordinate. 

