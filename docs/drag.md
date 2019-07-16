---
layout: documentation
title: Drag
---

Drag is a property that can be applied to points, lines, and curves that allows the user to move these objects in a certain direction by dragging the object with their cursor. Drag may follow many directional patterns, as will be shown below. 

There are three basic components of drag that must be defined for drag to work: 
* `directions`: this determines how the cursor appears for dragging. The `x` direction displays horizontal arrows, the `y` direction displays vertical arrows, and the `xy` direction displays arrows going both horizontally and vertically. 
* `param`: this describes which parameter will change when the user drags the object. This means that at least one parameter must be defined in the program for drag to act on. 
* `expression`: this explains how the parameter will change when the object is dragged by the user in the form of an equation. The equation may be in terms of the following variables: 
    * `x` and `y`
    *`drag.x` and `drag.y`, which describe the position of the mouse as it is dragged. 
    * `drag.dx` and `drag.dy`, which describe the amount that the `x` and `y` coordinate have changed from their original position as the mouse is dragged. 
    * `params.param`, where `param` is the parameter being changed by the drag behavior. 

Let us look at an example of a simple drag expression, a point that can be moved up and down while maintaining the same x-coordinate. Notice that the increments by which the y-coordinate changes depend on the `round` value of the parameter `y`. 


<div width="500" height="425" class="codePreview">

params:
- name: y
  value: 3
  min: 0
  max: 10
  round: 0.5
  
layout:
  OneGraph:
    graph:
      objects:
      - Point:
         coordinates:
         - 5
         - params.y
         drag:
         - directions: y
           param: y
           expression: drag.y
         label:
            text: y = params.y
            x: 6


          

</div>

