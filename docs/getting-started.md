---
layout: documentation
title: Getting Started
---

KGJS is a JavaScript engine that takes a description of an interactive graph and renders that graph in a browser.

The engine understands JSON as the language describing the graphs, but as an author you can use YAML, which is then translated into JSON. This is generally easier to read and edit.

Getting up and running with KGJS is quite simple: you just need a single Javascript file and a single CSS file. Then, use a

``
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Hello World</title>
    <link rel="stylesheet" type="text/css" href="https://cmakler.github.io/kgjs/css/kg.0.2.0.css">
    <script src="https://cmakler.github.io/kgjs/js/kg.0.2.0.js"></script>
</head>
<body>

The text in the following div will be rendered using KGJS:

<div class="kg-container">

layout:
  OneGraph:
    graph:
      objects:

      # Point object at coordinates (6,4)
      - Point:
          coordinates: [6,4]

</div>

</body>
</html>


``



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

Parameters may be added together inline: 

<div width="800" height="320" class="codePreview">

params:
- {name: a, value: 3, min: 0, max: 10}
- {name: b, value: 0.5, min: 0, max: 1, round: 0.1}
layout:
  HTMLPlusSidebarLayout:
    html: "`<p>The value of $a$ is ${params.a}.</p><p>The value of $b$ is ${params.b.toFixed(1)}.</p><p>Let's add $a$ and $b$ together: $$ ${params.a} + ${params.b.toFixed(1)} = ${(params.a + params.b).toFixed(1)}$$</p>`"
    sidebar:
      controls:
      - title: Adding Parameters
        sliders:
        - {param: a, label: a}
        - {param: b, label: b}

</div>

However, it's better to use a calculation to pre-calculate the summed value. A calculation is a function that takes in parameters, written in the [mathjs format](https://mathjs.org). We can create calculations like this: 

<div width="800" height="320" class="codePreview">
	
params:
- {name: a, value: 3, min: 0, max: 10}
- {name: b, value: 0.5, min: 0, max: 1, round: 0.1}

calcs:
  sumAB: (params.a + params.b)

layout:
  HTMLPlusSidebarLayout:
    html: "`<p>The value of $a$ is ${params.a}.</p><p>The value of $b$ is ${params.b.toFixed(1)}.</p><p>Let's add $a$ and $b$ together: $$ ${params.a} + ${params.b.toFixed(1)} = ${calcs.sumAB.toFixed(1)}$$</p>`"
    sidebar:
      controls:
      - title: Adding Parameters
        sliders:
        - {param: a, label: a}
        - {param: b, label: b}

</div>

Note that calculations work best when all terms are surrounded by parentheses. For example, `((params.a)^(params.b))` is more robust than `params.a^params.b`. Without parentheses, the expression may be evaluated incorrectly. 

Taking a closer look at the code structure using calculations, notice that the HTML text is surrounded by the \` symbols.



