---
layout: documentation
title: Point
---

The Point object is used for just that: points. In its simplest form, you can define it simply using a pair of coordinates:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:

      # Point object at coordinates (6,4)
      - Point:
          coordinates: [6,4]

</div>

## Droplines

You can add droplines (vertical and/or horizontal) by saying what their labels should be. Note that the labels are LaTeX by default; to make them text, use the LaTeX `\text` command, double-escaping the backslash:

<div width="500" height="425" class="codePreview">
	
layout:
  OneGraph:
    graph:
      objects:

      - Point:
          coordinates: [6,4]

          # add droplines
          droplines:
            vertical: a_1
            horizontal: "\\text{Price}"

</div>

## Dragging

You can attach drag behavior to a point using the `drag` attribute. For horizontal and vertical dragging, the `drag` command has components `horiztonal` and/or `vertical` which use parameters like this: 

<div width="500" height="425" class="codePreview">
	
params:
- {name: a, value: 6, min: 1, max: 9, round: 0.01}
- {name: b, value: 4, min: 1, max: 9, round: 2}

layout:
  OneGraph:
    graph:
      objects:

      # use parameters for the point coordinates
      - Point:
          coordinates: [params.a, params.b]
          droplines: {vertical: a, horizontal: b}
          drag:
          - vertical: b
          - horizontal: a

</div>

A couple of things to notice about the above example:
* Each of the drag behaviors takes in a parameter that is associated with the direction of motion, i.e. vertical drag is determined by `b`, and the y-coordinate is also determined by `b`.
* The x-value is the `a` parameter. It starts at 6 and can be dragged from 1 to 9; this is determined in the definition of the parameter, so it doesn't need to be redefined on the drag behavior. Furthermore, `round` is set to `0.01` so it drags smoothly.
* The y-value is the `b` parameter. It has a `round` value set to 2, so it snaps to the closest even number.
* Notice that the cursor is a "plus" symbol when you mouse over the point (and move it). This is because you can move it both horizontally and vertically. Try removing the second drag behavior; notice that the point now only drags left and right, and the cursor is a left-right arrow.

If you want to enact a more complicated dragging motion, then instead of using `vertical` and `horizontal`, you may use the components `directions`, `param`, and `expression` to describe the dragging behavior.
* `directions` determines which two-sided arrow(s) will show up on the cursor. The options are `x`, the horiztonal direction, or `y`, the vertical direction. 
* `param` determines which parameter will be affected by the dragging. 
* `expression` describes how the parameter will change when dragged. 

Let's talk a little more about the expression attribute of the drag behavior. The expression can use `drag.x`, `drag.y`, `drag.dx`, and `drag.dy`; the first two are the actual coordinates of the mouse, and the second two are the difference between the original position of the mouse and the current position.

However, sometimes the value of the point is _not_ a pair of parameters. For example, suppose you want the point to control a line, and you always want the angle of the line to round to the nearest 5. In this case. Here's an example of how you might achieve that, with a little fancy trigonometry converting from radians to degrees to slope:

<div width="500" height="425" class="codePreview">
	
params:
- {name: m, value: 30, min: 5, max: 55, round: 5}

calcs:

  # m is in degrees; convert to slope
  slope: "(math.tan(2*math.pi*(params.m)/360))"

  # determine the y-coordinate of a point at x=6
  y: "(6*(math.tan(2*math.pi*(params.m)/360)))"

layout:
  OneGraph:
    graph:
      objects:

      # define the line using the slope only
      # (draws a line through the origin)
      - Line:
          slope: calcs.slope
          label:
            text: "`${params.m}^\\\\circ`"
            x: 2

      # set the drag behavior to update the slope
      # based on the y-coordinate of the dot 
      - Point:
          coordinates: [6, calcs.y]
          droplines: {vertical: a, horizontal: b}
          drag:
          - directions: y
            param: m
            expression: "(atan(drag.y/6)*180/pi)"

</div>