---
layout: documentation
title: KineticGraphs JavaScript Engine (KGJS)
---

## About the project

KGJS is a JavaScript engine that takes a description of an interactive graph and renders that graph in a browser. Fundamentally, it uses a number of amazing open-source JavaScript technologies --  [D3](https://d3js.org) for drawing 2D diagrams, [MathBox](https://github.com/unconed/mathbox) for drawing 3D diagrams, [mathjs](https://mathjs.org/) for easy math description, [KaTeX](https://katex.org) for displaying math, as well as bits and pieces of [underscore](https://underscorejs.org/) and [js-yaml](https://github.com/nodeca/js-yaml) for parsing things -- and it tries to create an author-friendly way of creating interactive graphs. All of these are bundled along with KGJS in a single JS file and CSS file.

The engine understands JSON as the language describing the graphs, but as an author you can use YAML, which is then translated into JSON. This is generally easier to read and edit.

## Getting started

Getting up and running with KGJS is quite simple: you just need a single Javascript file and a single CSS file. Each `div` with class `kg-container` that contains a graph definition will be rendered in place. You can start by downloading <a href="hello-world" download>this Hello World HTML file</a> and open it in a browser; you can edit it in a text editor to have an instant playground.

In all of these documentation pages, you'll be able to also play with live code and see how it renders; you can take that code and paste it into a local HTML document if you'd like to experiment more offline. For example, the following live code editor has the same graph as in the Hello World HTML file. Try changing the coordinates or the colors of the points:

<div width="500" height="410" class="codePreview">

layout:
  OneGraph:
    graph:
      objects:

      # Point object at coordinates (6,4)
      - Point:
          coordinates: [6,4]

      # Red point object at coordinates (3,3)
      - Point:
          coordinates: [3,3]
          color: red

</div>

The key to an interactive graph, of course, is interactivity: that is, the ability of the user to change things. KGJS handles this by defining a set of parameters that the user can change, and then making it easy to adjust the parameters by dragging objects or using sliders:

<div width="500" height="410" class="codePreview">
params:

- name: blueX    # x-coordinate of blue point
  value: 6

- name: redY     # y-coordinate of red point
  value: 3
  min: 2
  max: 6
  round: 0.25
    
layout:
  OneGraph:
    graph:
      objects:
      - Point:
          coordinates: [params.blueX, 4]
          draggable: true
      - Point:
          coordinates: [3, params.redY]
          color: red
          draggable: true

</div>

Notice that the min, max, and round attributes of `blueX` aren't set; KGJS will set sensible defaults (round to the nearest integer, don't allow dragging off the graph) whenever possible. By contrast, these attributes _are_ set for `redY`, so the dot snaps to every 0.25 instead of every integer.

Use the navigation links to the left to learn about drawing graph objects, defining user interactions, and creating complex layouts with multiple graphs.

## About me, and the others who have made this possible

My name is Chris Makler; I'm an economist by training, not a software developer, as you'll quickly find out if you look at the [source code](https://github.com/cmakler/kgjs) on Github. I have developed this code to support my research project, [econgraphs.org](https://econgraphs.org), which I use in my own teaching and consider a public good for other teaching economists who might find it useful.

I have drawn inspiration and guidance from the community [Nicky Case](https:/ncase.me) has build up around [Explorable Explanations](https://explorabl.es/), including but certainly not limited to [Amit Patel](https://www.redblobgames.com/), [Chris Walker](http://polytrope.com/), [Hamish Todd](https://hamishtodd1.github.io/), [Andy Matuschak](https://andymatuschak.org), and [Matthew Conlen](https://mathisonian.com/). I'm also a huge fan of [desmos.com](https://desmos.com), [idyll](https://idyll-lang.org), and [slides.com](https://slides.com), which I use for my own teaching because I can embed these diagrams within it. I also owe a debt of gratitude to a host of former colleagues who helped introduce me to the black art of coding, including David Murphy, Karl Lew, Wilson Cheung, Harrison Caudill, and Kyle Moore.

Finally, a huge thanks to my students Avery Rogers and Chris Hull for their help in creating this documentation.