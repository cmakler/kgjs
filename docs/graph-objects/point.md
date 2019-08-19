---
layout: documentation
title: Point
---

## Coordinates

In its simplest form, you can define it simply using a pair of coordinates. You can either express these as an ordered pair, or with the x- and y-coordinates specified in their own attributes:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:

      # Point object at coordinates (6,4)
      - Point:
          coordinates: [6,4]
          
      # Point object at coordinates (3,3)
      - Point:
          x: 3
          y: 3
          color: red

</div>

## Droplines

You can add droplines (vertical and/or horizontal) by saying what their labels should be. If you just want droplines with no labels, _include the attribute but leave it blank_.

<div width="500" height="425" class="codePreview">
	
layout:
  OneGraph:
    graph:
      objects:

      # point with labeled droplines 
      - Point:
          coordinates: [6,4]
          droplines:
            vertical: a_1
            horizontal: a_2
            
      # point with unlabeled droplines
      - Point:
          coordinates: [3,3]
          color: red
          droplines:
            vertical:
            horizontal:

</div>

## Labels

You often want to label a point. Since the label uses the coordinates of the point, you just need to specify the text and the position of the label. The default, as in point _A_ below, is to display the label above and to the right of the point. If you want to change this, use the `position` attribute. We follow the LaTeX convention of thinking of the position from the _label's_ point of view, not the point: so specifying `tr`, as in point _B_ below, means the top-right corner of the label is touching the point -- that is, the label appears below and to the left of the point.

<div width="500" height="425" class="codePreview">
	
layout:
  OneGraph:
    graph:
      objects:

      # label in the default position
      - Point:
          coordinates: [6,4]
          label:
            text: A
            
      # label top-right corner touches the point
      - Point:
          coordinates: [3,3]
          color: red
          label:
            text: B
            position: tr

</div>

## Formatting

Points are blue by default; use the `color` attribute to change the color. Droplines and labels inherit the color of the point.

Both labels and dropline labels are rendered as LaTeX. If you need to label them using text (or mixed math and text), use the `\text{}` command for the text strings. 

<div width="500" height="425" class="codePreview">
	
layout:
  OneGraph:
    graph:
      xAxis: {ticks: 0}
      yAxis: {ticks: 0}
      objects:
      
      - Point:
          coordinates: [6,4]
          label:
            text: \text{A blue point}
          droplines:
            vertical: x\text{ value}
            horizontal: y\text{ value}
            
      - Point:
          coordinates: [3,3]
          color: red
          label:
            text: \text{A red point}
            position: tr
            
         
            
</div>

