---
layout: documentation
title: Parameters and Calculations
---

A line can be generated in a number of ways. First, let's look at a line defined by two points:

<div filename="line/simple_two_points" width="800" height="710" class="codePreview"></div>

A line can also be created using a point and a slope: 

<div filename="line/point_slope" width="800" height="710" class="codePreview"></div>

Or by using the slope and the y-intercept: 

<div filename="line/simple_slope_intercept" width="800" height="710" class="codePreview"></div>

Or by using the inverse slope and the x-intercept: 

<div filename="line/simple_invslope_intercept" width="800" height="710" class="codePreview"></div>

Or by using _both_ intercepts:

<div filename="line/intercepts" width="800" height="710" class="codePreview"></div>

Finally, if you would like to create a line through the origin, you can provide just one point _or_ a slope and the line will, by default, pass through the origin: 

<div filename="line/one_point" width="800" height="710" class="codePreview"></div>

Using our two-points example, let's look at customization. Here are some common attributes you might want to give a line:
* Color: in the `def` of the line, add the command `"color" : "colors.green"` or whatever basic color you prefer. 
* Dashed/Dotted: in the `def` of the line, add the command `"lineStyle" : "dashed"` or `"dotted"` to change the texture of the line. 
* Line segment: if you want the line to begin and end at particular points, in the `def` of the line, add `min` and `max` commands for the x-coordinate at which you would like the line to begin and end. 
* Adding a point: to add a point to your line, follow the normal protocol for drawing a point, as demonstrated below. 
* Labelling: to label a line, add a `label` command to the `def` of the line, which has a `text` attribute (what you want the label to say) and an `x` attribute describing the x-coordinate where you want the label to appear. 

<div filename="line/two_points" width="800" height="710" class="codePreview"></div>

Now, let's see how we can make a line interactive, such that it can be dragged in a number of ways. The components of the `drag` command are as follows:
* `directions`: the direction of the dragging may be in the x direction, the y direction, or in both the x and y direction (notated `xy` as below).
* `param`: this is the parameter you will be changing by dragging the line. In the example below, we are changing the intercepts, so `param` is `"intercepts"`.
* `expression`: the expression is the 

First, let's see how to drag a line parallel to its starting position:

<div filename="line/drag_parallel" width="800" height="710" class="codePreview"></div>
