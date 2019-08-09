---
layout: documentation
title: Curves
---

Curves can be generated in two ways: by a univariate function or by a parametric function. 

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
          color: red
          lineStyle: dashed
          label:
            text: y = 3 + 2x
            x: 2
            align: right
      - Curve:
          univariateFunction:
            fn: 1 + 2*(x)
            ind: x
          color: red
          label:
            text: "'f(x) = 1 + 2x'"
            x: 2
            align: left
      - Line:
          xIntercept: 1
          invSlope: 2
          color: green
          lineStyle: dashed
          label:
            text: x = 1 + 2y
            x: 4
            align: right
      - Curve:
          univariateFunction:
            fn: 3 + 2*(y)
            ind: y
          color: green
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
          color: red
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
          color: blue


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
          color: purple

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
          color: red
          label:
            text: "`f(x) = ${params.yintercept.toFixed(2)} + x^2`"
            x: 2
          drag:
          - directions: y
            param: yintercept
            expression: params.yintercept + drag.dy

</div>

If you would like to shade in the area above or below a curve, you can use the `areaAbove` and `areaBelow` attributes, which will shade in the area above and below the curve, respectively. 

`areaAbove` and `areaBelow` can be customized for opacity, fill, etc. Anything that can be altered in a `graphObject` can also apply to the areas defined here. If you do not specify a fill color or an opacity, the area attributes will default to the color of the curve and an opacity of 0.2.

<div width="500" height="425" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Curve:
          univariateFunction:
            fn: 1 + 2*(x)
            ind: x
          color: red
          label:
            text: "'f(x) = 1 + 2x'"
            x: 2
          areaAbove: {fill: blue, opacity: 0.6}
          areaBelow: {}
          
</div>

By default, the area below the graph will be shaded between the curve and the x-axis. If you would like to customize the upper and lower bounds of the shading, you can do so either in the definition of the curve, or with a new object called `Area` that takes in two curves as parameters. 

Using an existing curve, with the shading ending at y = 0.5x:

<div width="500" height="425" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Curve:
          univariateFunction:
            fn: 1 + 2*(x)
            ind: x
          color: red
          label:
            text: "'f(x) = 1 + 2x'"
            x: 2
          areaBelow: 
            univariateFunction2: 
              fn: 0.5*x
              ind: x
            fill: blue
            
          
</div>

Using the `Area` object and two curve parameters: 

<div width="500" height="425" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:
      - Area: 
          univariateFunction1: 
            fn: 1 + 2*x
            ind: x
          univariateFunction2: 
            fn: 0.5*x
            ind: x
          fill: blue
            
          
</div>