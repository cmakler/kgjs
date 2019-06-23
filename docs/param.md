---
layout: documentation
title: Parameters and Calculations
---

A parameter is like a variable that can be inputted into functions.

<div filename="param/simpleParam6" width="800" height="210" class="codePreview"></div>

Furthermore, a parameter is a variable which the user can adjust, either via a slider or by manipulating something on the graph. The initial value of the parameter is determined by the `value` attribute on the parameter definition. The range of the slider is determined by the `min` and `max` of _a_. For example, this sets the initial value of _a_ to 3:

<div filename="param/simpleParam1" width="800" height="210" class="codePreview"></div>

You can change the precision of _a_ by creating a `round` command. Here, we round _a_ to the nearest tenth:

<div filename="param/simpleParam5" width="800" height="210" class="codePreview"></div>

Drag the slider back and forth. Oh no! It displays badly. We can fix this by adding a `.toFixed(1)` after it: 

<div filename="param/simpleParam2" width="800" height="210" class="codePreview"></div>

Parameters may be added together inline: 

<div filename="param/simpleParam3" width="800" height="320" class="codePreview"></div>

However, it's better to use a calculation to pre-calculate the summed value. A calculation is a function that takes in parameters, written in the mathjs format (https://mathjs.org). We can create calculations like this: 

<div filename="param/simpleParam4" width="800" height="320" class="codePreview"></div>

Note that calculations work best when all terms are surrounded by parentheses. For example, `((params.a)^(params.b))` is more robust than `params.a^params.b`. Without parentheses, the expression may be evaluated incorrectly. 

Taking a closer look at the code structure using calculations, notice that the HTML text is surrounded by the `\`` 



