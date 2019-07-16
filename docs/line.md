---
layout: documentation
title: Lines
---

A line can be generated in a number of ways. First, let's look at a line defined by two points:

<div width="500" height="425" class="codePreview">
    
layout:
  OneGraph:
    graph:
      objects:

      # line defined by two points
      - Line:
          point: [3,4]
          point2: [6,5]
          
      # show points for reference
      - Point:
          coordinates: [3,4]
      - Point:
          coordinates: [6,5]


</div>

A line can also be created using a point and a slope: 

<div filename="line/point_slope" width="500" height="425" class="codePreview">
    
layout:
  OneGraph:
    graph:
      objects:

      # line defined by a point and a slope
      - Line:
          point: [3,4]
          slope: -2

      # show point for reference
      - Point:
          coordinates: [3,4]

</div>

Or by using the slope and the y-intercept: 

<div width="500" height="425" class="codePreview">
    
layout:
  OneGraph:
    graph:
      objects:
      - Line:
          yIntercept: 2
          slope: 2

</div>

Or by using the inverse slope and the x-intercept: 

<div width="500" height="425" class="codePreview">
    
layout:
  OneGraph:
    graph:
      objects:
      - Line:
          xIntercept: 2
          invSlope: 2

</div>

Or by using _both_ intercepts:

<div width="500" height="425" class="codePreview">
    
layout:
  OneGraph:
    graph:
      objects:
      - Line:
          xIntercept: 2
          yIntercept: 6

</div>

Finally, if you would like to create a line through the origin, you can provide just one point _or_ a slope and the line will, by default, pass through the origin: 

<div width="500" height="425" class="codePreview">
    
layout:
  OneGraph:
    graph:
      objects:
      
      # line defined only by a slope
      - Line:
          slope: 2
          label: {text: "\\text{slope} = 2", x: 3}
          color: colors.green
          
      # line defined only by a point
      - Line:
          point: [3,1]
          
      # show point for reference
      - Point:
          coordinates: [3,1]
</div>

Using our two-points example, let's look at customization. Here are some common attributes you might want to give a line:
* Color: in the `def` of the line, add the command `"color" : "colors.green"` or whatever basic color you prefer. 
* Dashed/Dotted: in the `def` of the line, add the command `"lineStyle" : "dashed"` or `"dotted"` to change the texture of the line. 
* Line segment: if you want the line to begin and end at particular points, in the `def` of the line, add `min` and `max` commands for the x-coordinate at which you would like the line to begin and end. 
* Adding a point: to add a point to your line, follow the normal protocol for drawing a point, as demonstrated below. 
* Line width: use the command `"strokeWidth"` to change the width of the line.
* Labelling: to label a line, add a `label` command to the `def` of the line, which has a `text` attribute (what you want the label to say) and an `x` attribute describing the x-coordinate where you want the label to appear. 
* Axes: you can add axis labels and the minimum and maximum value of each axis as an attribute of the graph, as shown below. 

<div width="500" height="425" class="codePreview">
    
layout:
  OneGraph:
    graph:
      objects:

      # draw a dotted line (lineStyle = dotted)
      # defined by the points (3,4) and (7,8)
      - Line:
          lineStyle: dotted
          point: [3,4]
          point2: [7,8]
          color: colors.blue

      # draw a thick line (strokewidth = 4)
      # defined by the same points,
      # but limited to the range x = 2 to x = 8
      - Line:
          strokeWidth: 4
          point: [3,4]
          point2: [7,8]
          min: 2
          max: 8
          color: colors.blue
          label:
            text: y = x + 3
            x: 5

      # show points for reference
      - Point:
          coordinates: [3,4]
      - Point:
          coordinates: [7,8]


</div>

Now, let's see how we can make a line interactive, such that it can be dragged in a number of ways. Look at the `drag` section of the KGJS documentation site for more background on `drag`. 

First, let's see how to drag a line defined by intercepts. We want to drag the line so that it is always parallel to its starting position; in other words, the x- and y-intercepts will always be equal to each other. 


<div width="500" height="425" class="codePreview">
    
params:
- name: intercepts
  value: 6
  min: 2
  max: 10
  round: 0.01
  
layout:
  OneGraph:
    graph:
      objects:
      - Line:
          xIntercept: params.intercepts
          yIntercept: params.intercepts
          drag:
          - directions: xy
            param: intercepts
            expression: drag.x+drag.y

</div>

Now, let's add a feature where you can change the slope by dragging the line. The slope of a line is defined by /frac{y2 - y1}{x2 - x1}, so we will follow the same form here for our `expression`, where y2 and x2 are drag.y and drag.x, respectively, and y1 and x1 are the coordinates of the point we have chosen, (4,5). See how the slope of the line revolves around our chosen point: 

<div width="500" height="425" class="codePreview">
    
params:
- name: m
  value: 1
  min: -10
  max: 10
  round: 0.01

layout:
  OneGraph:
    graph:
      objects:

      - Line:
          color: colors.blue
          point: [4,5]
          slope: params.m
          drag:
          - directions: xy
            param: m
            expression: "(drag.y-5)/(drag.x-4)"

      - Point:
          coordinates: [4,5]
      

</div>

Here is a template for a graph with several lines. Try implementing the following dragging ability: Drag the green line's slope around its y-intercept. 

<div filename="line/drag_exercises" width="500" height="425" class="codePreview">
    
params:
- name: m
  value: 1
  min: -10
  max: 10
  round: 0.01

layout:
  OneGraph:
    graph:
      objects:

      - Line:
          color: colors.green
          yIntercept: 4
          slope: params.m

</div>

Solution key: 

<div width="500" height="425" class="codePreview">

params:
- name: m
  value: 1
  min: -10
  max: 10
  round: 0.01

layout:
  OneGraph:
    graph:
      objects:

      - Line:
          color: colors.green
          yIntercept: 4
          slope: params.m

          # solution
          drag:
          - directions: xy
            param: m
            expression: "(drag.y - 4)/(drag.x)"

</div>
