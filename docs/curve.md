---
layout: documentation
title: Curves
---

Curves can be generated in two ways: by a univariate function or by a parametric function. 

First, let's look at a how a univariate function is generated: 

<div filename="curve/simple_curve" width="800" height="710" class="codePreview"></div>

Notice that the curve is a line, which we've been able to generate using points, slopes, and intercepts. Here is a comparison of the two methods, with dashed lines and solid curves: 

<div filename="curve/curves_vs_lines" width="800" height="710" class="codePreview"></div>

Here is a more complicated univariate function, the quadratic function: 

<div filename="curve/quadratic_curve" width="800" height="710" class="codePreview"></div>

We can also create parametric functions, which are especially useful for displaying circles or trigonometric functions.Parametric functions include an `xFunction` and a `yFunction` each in terms of _t_. Here is an example of a quarter circle in the first quadrant (note that the max for _t_ is 1.57, approximately _pi/2_):

<div filename="curve/circle_quarter" width="800" height="710" class="codePreview"></div>

You can be very creative with parametric functions, as shown below: 

<div filename="curve/parametric" width="800" height="710" class="codePreview"></div>

