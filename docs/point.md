---
layout: documentation
title: Point
---

The Point object is used for just that: points. In its simplest form, you can define it simply using a pair of coordinates:

<div filename="point/simplePoint" width="500" height="410" class="codePreview"></div>

## Droplines

You can add droplines (vertical and/or horizontal) by saying what their labels should be. Note that the labels are LaTeX by default; to make them text, use the LaTeX `\text` command, double-escaping the backslash:

<div filename="point/simplePoint2" width="500" height="425" class="codePreview"></div>

## Dragging

You can attach drag behavior to a point using the `drag` attribute. Drag is an array of drag instructions.

<div filename="point/dragPoint1" width="500" height="425" class="codePreview"></div>

A couple of things to notice about the above example:
* Each of the drag behaviors has three attributes: the `directions` of the drag (`x`, `y`, or `xy`); the parameter which is adjusted when you drag; and the expression that value should take on.
* The x-value is the `a` parameter. It starts at 6 and can be dragged from 1 to 9; this is determined in the definition of the parameter, so it doesn't need to be redefined on the drag behavior. Furthermore, `round` is set to `0.01` so it drags smoothly.
* The y-value is the `b` parameter. It has a `round` value set to 2, so it snaps to the closest even number.
* Notice that the cursor is a "plus" symbol when you mouse over the point (and move it). This is because you can move it both horizontally and vertically. Try removing the second drag behavior; notice that the point now only drags left and right, and the cursor is a left-right arrow.

Let's talk a little more about the expression attribute of the drag behavior. The expression can use `drag.x`, `drag.y`, `drag.dx`, and `drag.dy`; the first two are the actual coordinates of the mouse, and the second two are the difference between the original position of the mouse and the current position.

If the point is defined by parameters, as above, the usual way do capture the movement by setting the expression equal to the original value plus the different of the mouse movement. This is especially true because you can actually use the droplines to drag a point as well; so if you grab a dropline, we don't want the point to jump to the mouse. (To see what this feels like, change the drag expressions above to just "drag.x" and "drag.y" and play around with the point; it's not quite as natural.)

However, sometimes the value of the point is _not_ a pair of parameters. For example, suppose you want the point to control a line, and you always want the angle of the line to round to the nearest 5. In this case. Here's an example of how you might achieve that, with a little fancy trigonometry converting from radians to degrees to slope:

<div filename="point/dragPoint2" width="500" height="425" class="codePreview"></div>