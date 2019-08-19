---
layout: documentation
title: Parameters and Calculations
---

A parameter is like a variable that can be used in functions. At its simpest, it consists of a name and a value:

<div width="800" height="210" class="codePreview">

params:
- {name: a, value: 3}
- {name: b, value: 0.5}
layout:
  HTMLLayout:
    html: "`<p>The value of $a$ is ${params.a}.</p><p>The value of $b$ is ${params.b}.</p>`"


</div>

Fundamentally, a parameter is a variable which the user can adjust, either via a slider or by manipulating something on the graph. The initial value of the parameter is determined by the `value` attribute on the parameter definition; the range of the slider is determined by the `min` and `max` attributes. For example, this sets the initial value of _a_ to 3, and sets it range to be between 0 and 10:

<div width="800" height="210" class="codePreview">
	
params:
- {name: a, value: 3, min: 0, max: 10}
layout:
  HTMLPlusSidebarLayout:
    html: "`<p>The value of $a$ is ${params.a}.</p>`"
    sidebar:
      controls:
      - title: Parameters
        sliders:
        - {param: a, label: a}


</div>

By default, parameters are integers; you can change the precision of _a_ by creating a `round` command. Here, we round _a_ to the nearest tenth:

<div width="800" height="210" class="codePreview">
	
params:
- {name: a, value: 3, min: 0, max: 10, round: 0.1}
layout:
  HTMLPlusSidebarLayout:
    html: "`<p>The value of $a$ is ${params.a}.</p>`"
    sidebar:
      controls:
      - title: Rounding Parameters
        sliders:
        - {param: a, label: a}

</div>

Drag the slider back and forth. Oh no! It displays badly. We can fix this by adding a `.toFixed(1)` in the HTML: 

<div width="800" height="210" class="codePreview">
	
params:
- {name: a, value: 3, min: 0, max: 10, round: 0.1}
layout:
  HTMLPlusSidebarLayout:
    html: "`<p>The value of $a$ is ${params.a.toFixed(1)}.</p>`"
    sidebar:
      controls:
      - title: Nicely Rounding Parameters
        sliders:
        - {param: a, label: a}
</div>