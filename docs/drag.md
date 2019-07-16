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

First, let's look at a how a univariate function is generated. There are a few key components of the function code: 
* `"fn"`: this is the function you want the curve to follow. For example, _x_+2 or 3_y_.
* `"ind"`: this is your independent variable, which can be _x_ or _y_ depending on how your function is defined. In general, _x_ is taken as the default, so if your independent variable is _x_, it does not need to be specified.  

<div width="500" height="425" class="codePreview">
	
layout:
  OneGraph:
    graph:
      objects:
      - Curve:
          univariateFunction:
            fn: 1 + 2*(x)
            ind: x
          label:
            text: "'f(x) = 1 + 2x'"
            x: 2

</div>

Notice that the curve is a line, which we've been able to generate using points, slopes, and intercepts. Here is a comparison of the two methods, with dashed lines and solid curves: 

<div width="500" height="425" class="codePreview">
	
layout:
  OneGraph:
    graph:
      objects:
      - Line:
          yIntercept: 3
          slope: 2
          color: colors.red
          lineStyle: dashed
          label:
            text: y = 3 + 2x
            x: 2
            align: right
      - Curve:
          univariateFunction:
            fn: 1 + 2*(x)
            ind: x
          color: colors.red
          label:
            text: "'f(x) = 1 + 2x'"
            x: 2
            align: left
      - Line:
          xIntercept: 1
          invSlope: 2
          color: colors.green
          lineStyle: dashed
          label:
            text: x = 1 + 2y
            x: 4
            align: right
      - Curve:
          univariateFunction:
            fn: 3 + 2*(y)
            ind: y
          color: colors.green
          label:
            text: "'f(y) = 3 + 2y'"
            y: 2.5
            align: left

</div>

Here is a more complicated univariate function, the quadratic function: 

<div width="500" height="425" class="codePreview">
	
layout:
  OneGraph:
    graph:
      objects:
      - Curve:
          univariateFunction:
            fn: 1 + (x)^2
            ind: x
          color: colors.red
          label:
            text: "'f(x) = 1 + x^2'"
            x: 2

</div>

We can also create parametric functions, which are especially useful for displaying circles or trigonometric functions. Parametric functions include:
* `xFunction`: a function in terms of _t_ to show how _x_ changes as the parameter _t_ changes. 
* `yFunction`: a function in terms of _t_ to show how _y_ changes as the parameter _t_ changes.
* `min` and `max`: the minimum and maximum values that you want _t_ to take, which may determine the length of the curve generated.

Here is an example of a quarter circle in the first quadrant (note that the max for _t_ is 1.57, approximately _pi/2_):

<div width="500" height="425" class="codePreview">
	
layout:
  OneGraph:
    graph:
      xAxis:
        min: -10
        max: 10
      yAxis:
        min: -10
        max: 10
      objects:

      # define a curve parametrically
      # using two functions, x(t) and y(t)
      # the min and max define the range of t
      - Curve:
          parametricFunction:
            xFunction: 8*cos(t)
            yFunction: 8*sin(t)
            min: 0
            max: 1.57
          color: colors.blue


</div>

You can be very creative with parametric functions, as shown below: 

<div width="500" height="425" class="codePreview">
	
layout:
  OneGraph:
    graph:
      xAxis:
        min: -10
        max: 10
      yAxis:
        min: -10
        max: 10
      objects:
      - Curve:
          parametricFunction:
            xFunction: 0.5*t*cos(t)
            yFunction: 0.5*t*sin(t)
            min: 0
            max: 20
          color: colors.purple

</div>

In general, it is often easier and more successful to draw circles, ellipses, and sinusoidal functions using the parametric form. Below is a univariate function for creating a circle. Notice that it does not format well near the x-axis:

<div width="500" height="425" class="codePreview">
	
layout:
  OneGraph:
    graph:
      objects:
      - Curve:
          univariateFunction:
            fn: sqrt(25 - (x)^2)
            min: 0
            max: 5

</div>

If you do choose to draw a circular or elliptical curve using a univariate function, there are two ways to smooth out the end of the curve: 
* Create two functions, one in terms of _x_ and one in terms of _y_ that each handle the area where they are well-defined. 
* Change the sample point parameter. 

## Drag behavior

One practical use of curves is to have a point traveling along a curve. In this case, the `drag` of the point will follow the form of the curve, using a calculation, like this: 

<div width="500" height="425" class="codePreview">
	
params:
- {name: x, value: 0, min: -10, max: 10, round: 0.01}
calcs:
  m: "(cos(params.x))"
layout:
  OneGraph:
    graph:
      xAxis: { min: -10, max: 10}
      yAxis: { min: -10, max: 10}
      objects:
      - Curve:
          univariateFunction:
            fn: cos((x))
      - Point:
          # plot point at (params.x, calcs.m)
          coordinates:
          - params.x
          - calcs.m
          # use drag to just change params.x
          drag:
          - directions: x
            param: x
            expression: params.x + drag.dx

</div>

You can also move an entire curve in the x or y direction. Let's try to change the y-intercept of the quadratic curve shown above: 

<div width="500" height="425" class="codePreview">

params:
- name: yintercept
  value: 1
  min: 0
  max: 5
  round: 0.01
layout:
  OneGraph:
    graph:
      objects:
      - Curve:
          univariateFunction:
            fn: params.yintercept + (x)^2
            ind: x
          color: colors.red
          label:
            text: "`f(x) = ${params.yintercept.toFixed(2)} + x^2`"
            x: 2
          drag:
          - directions: y
            param: yintercept
            expression: params.yintercept + drag.dy

</div>

