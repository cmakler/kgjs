---
layout: documentation
title: Drag
---

The `drag` attribute of graph objects allows points, lines, and curves to be dragged in any number of ways by the user. When coding the graphs, you get to decide how an object can be dragged, and the user can then use their mouse to drag in the fashion you've predetermined. Let's look at a simple example to get started: 

<div width="500" height="425" class="codePreview">

params: 
    - {name: a, value: 5, min: 0, max: 10, round: .01}
layout:
  OneGraph:
    graph:
      objects:
      - Point: 
          coordinates: [params.a, 5]
          color: blue
          drag: 
            - horizontal: a


</div>

As you can see, the point above can be dragged to the left and right, i.e. in the horizontal direction. Let's decompose how we made this happen: 
* We created a parameter, `a`, that has an original value of 5 and can take on values from 0 to 10. This will be the range of dragging allowed for this parameter. 
* We defined the x-coordinate of our point in terms of `params.a`, which means the x-coordinate of the point will be whatever `a` is as it is dragged. 
* We created a `drag` attribute with a horizontal feature. The horizontal drag acts on `a`, meaning that when the mouse clicks the point and drags left or right, `a` is changing according to the amount of drag applied. 
* As `a` changes, the x-coordinate changes, because `x` here is defined by `params.a`.

We could do the same while adding a vertical component, as shown below:

<div width="500" height="425" class="codePreview">

params: 
    - {name: a, value: 5, min: 0, max: 10, round: .01}
    - {name: b, value: 5, min: 0, max: 10, round: 1}
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [params.a,params.b]
          drag: 
            - horizontal: a
            - vertical: b


</div>

Notice that when we drag in the y-direction, the point jumps by 1 unit rather than moving smoothly. This is because the `round` of `params.b` is 1, meaning that the point can only take a y-value rounded to the nearest 1. In contrast, the round on `params.a` is .01, so the motion looks much smoother. 

The same drag command can be applied to lines or curves. Let's take a look at a curve: 

<div width="500" height="425" class="codePreview">

params: 
    - {name: a, value: 0, min: -2, max: 2, round: 0.01}
layout:
  OneGraph:
    graph:
      xAxis: { min: -5, max: 5}
      yAxis: { min: -5, max: 5} 
      objects:
      - Curve: 
          univariateFunction: 
            fn: sin(x) + params.a
            ind: x
          color: red
          drag: 
            - vertical: a
          
          

</div>

Here, we are changing the y-intercept of the sine curve since `params.a` is being added to the expression of sin(x). What if we instead multiplied sin(x) by `params.a`?

<div width="500" height="425" class="codePreview">
    
params: 
    - {name: a, value: 1, min: -2, max: 2, round: 0.01}
layout:
  OneGraph:
    graph:
      xAxis: { min: -5, max: 5}
      yAxis: { min: -5, max: 5} 
      objects:
      - Curve: 
          univariateFunction: 
            fn: (sin(x))*params.a
            ind: x
          color: red
          drag: 
            - vertical: a

</div>

Now, dragging vertically changes the _amplitude_ of the curve because we are changing the coefficient of the curve, `params.a`. This reveals something important about the `vertical` and `horizontal` drag features: the direction of dragging does not necessarily say where the object will move, but how much the parameter will change give movement in that direction, For example, vertically dragging the graph above by 1 unit increases the amplitude by 1 unit. 

What would happen if we changed `vertical` above to `horizontal`?

<div width="500" height="425" class="codePreview">
    
params: 
    - {name: a, value: 1, min: -2, max: 2, round: 0.01}
layout:
  OneGraph:
    graph:
      xAxis: { min: -5, max: 5}
      yAxis: { min: -5, max: 5} 
      objects:
      - Curve: 
          univariateFunction: 
            fn: (sin(x))*params.a
            ind: x
          color: red
          drag: 
            - horizontal: a

</div>

Now dragging _horizontally_ changes the amplitude of the graph! Essentially, the `vertical` and `horizontal` commands allow us to linearly change a parameter. From a user standpoint, it makes sense to define the drag vertically in the graph above, since the change in amplitude is a vertical change to the graph. So we do not have to define it as vertical drag, but for ease-of-use, we probably should. 

Now you understand how to create linear drag. But what if you wanted to do something more complicated, like change the slope of a line while keeping the y-intercept constant?

<div width="500" height="425" class="codePreview">

params: 
    - {name: m, value: 1, min: -2, max: 2, round: 0.01}
layout:
  OneGraph:
    graph:
      objects:
      - Line:
          point: [0,4]
          slope: params.m
          drag: 
            - directions: y
              param: m
              expression: "(drag.y - 4)/drag.x"
          
</div>

Let's take a look at our new `drag` components: 
* `directions`: the direction of the dragging may be in the x direction, the y direction, or in both the x and y direction (notated `xy`). Really, this just tells the mouse if the arrows it displays should be vertical, horizontal, or both, but doesn't affect the dragging behavior otherwise. 
* `param`: this is the parameter you will be changing by dragging the line. In the example above, we are changing the slope, so we change `m` which defines the slope. 
* `expression`: the expression describes how the `param` will change based on the amount of dragging done. 

Let's talk more about the `expression`. Above, we know that slope = rise/run, where 'rise = new y - old y' and 'run = new x - old x'. The rise of the line is based on `drag.y - 4`, the new y-position, and the run is based on `drag.x - 0` or just `drag.x`, the new x-position. `drag.y` and `drag.x` represent the new position of the object. Other times, we will use `drag.dy` and `drag.dx` which refer to the _change_ in the y- and x-positions, respectively, rather than their absolute new position. For example, if you dragged a point from [2,2] to [2,3], `drag.y` would be 3 while `drag.dy` would be 1. 

Here is another example of a more complicated drag function, dragging a point around a circle of radius 3:

<div width="500" height="425" class="codePreview">

params:
- {name: theta, value: 0, min: 0, max: 360, round: 5}

calcs:
  xCoord: "3*(math.cos(params.theta))"
  yCoord: "3*(math.sin(params.theta))"
layout:
  OneGraph:
    graph:
      objects:
      - Point: 
          coordinates: [xCoord, yCoord]
          
          
</div>

More examples of dragging behavior will be shown in the pages on points, lines, and curves. For now, keep note of the information above and see it applied elsewhere!
