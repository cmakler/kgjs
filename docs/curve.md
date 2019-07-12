---
layout: documentation
title: Curves
---

Curves can be generated in two ways: by a univariate function or by a parametric function. 

First, let's look at a how a univariate function is generated. There are a few key components of the function code: 
* `"fn"`: this is the function you want the curve to follow. For example, _x_+2 or 3_y_.
* `"ind"`: this is your independent variable, which can be _x_ or _y_ depending on how your function is defined. In general, _x_ is taken as the default, so if your independent variable is _x_, it does not need to be specified.  

<div filename="curve/simple_curve" width="500" height="425" class="codePreview"></div>

Notice that the curve is a line, which we've been able to generate using points, slopes, and intercepts. Here is a comparison of the two methods, with dashed lines and solid curves: 

<div filename="curve/curves_vs_lines" width="500" height="425" class="codePreview"></div>

Here is a more complicated univariate function, the quadratic function: 

<div filename="curve/quadratic_curve" width="500" height="425" class="codePreview"></div>

We can also create parametric functions, which are especially useful for displaying circles or trigonometric functions. Parametric functions include:
* `xFunction`: a function in terms of _t_ to show how _x_ changes as the parameter _t_ changes. 
* `yFunction`: a function in terms of _t_ to show how _y_ changes as the parameter _t_ changes.
* `min` and `max`: the minimum and maximum values that you want _t_ to take, which may determine the length of the curve generated.

Here is an example of a quarter circle in the first quadrant (note that the max for _t_ is 1.57, approximately _pi/2_):

<div filename="curve/circle_quarter" width="500" height="425" class="codePreview"></div>

You can be very creative with parametric functions, as shown below: 

<div filename="curve/parametric" width="500" height="425" class="codePreview"></div>

In general, it is often easier and more successful to draw circles, ellipses, and sinusoidal functions using the parametric form. Below is a univariate function for creating a circle. Notice that it does not format well near the x-axis:

<div filename="curve/univariate_circle" width="500" height="425" class="codePreview"></div>

If you do choose to draw a circular or elliptical curve using a univariate function, there are two ways to smooth out the end of the curve: 
* Create two functions, one in terms of _x_ and one in terms of _y_ that each handle the area where they are well-defined. 
* Change the sample point parameter. 

One practical use of curves is to have a point traveling along a curve. In this case, the `drag` of the point will follow the form of the curve, using a calculation, like this: 

<div filename="curve/point_curve_drag" width="500" height="425" class="codePreview"></div>

You can also move an entire curve in the x or y direction. Let's try to change the y-intercept of the quadratic curve shown above: 

<div filename="curve/quadratic_curve_drag" width="500" height="425" class="codePreview"></div>

