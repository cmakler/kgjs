---
layout: documentation
title: Calculations
---

Expressions involving parameters may be used anywhere in KGJS. For example, an attribute can show the sum of two params: 

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



