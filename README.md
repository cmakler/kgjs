# kg.js
Javascript Renderer for KineticGraphs

## See documentation page
[Here](https://cmakler.github.io/kgjs/)

## What it does

The purpose of kg.js is to provide a way to render interactive diagrams ("KineticGraphs") defined as a JSON.

Once the page is loaded, kg.js looks for any elements with a class name `kg-container`. These elements should have a `src` attribute with a URL pointing to a JSON file. This file contains all the information necessary to render a KineticGraph and handle user interactions with it.

Each KineticGraph is a standalone diagram, and does not communicate with the outside page. In particular, you can have multiple graphs rendered from the same JSON and interact with them separately.

Each KineticGraph maintains its aspect ratio as the page window changes dimensions. If a KineticGraph includes a `sidebar` (an area to the right, which generally contains a caption as well as user controls like sliders), that `sidebar` is positioned to the right of the diagram for wide pages, and below the diagram for smaller ones. This responsive flow and layout is designed to work seamlessly with [Tufte CSS](https://edwardtufte.github.io/tufte-css/); just place a KineticGraph within a `figure` element with class `fullwidth`.

## Dependencies

Fundamentally, it uses a number of amazing open-source JavaScript technologies:

* [D3](https://d3js.org) for drawing 2D diagrams
* [MathBox](https://github.com/unconed/mathbox) for drawing 3D diagrams
* [mathjs](https://mathjs.org/) for easy math description
* [KaTeX](https://katex.org) for displaying math
* [underscore](https://underscorejs.org/) and [js-yaml](https://github.com/nodeca/js-yaml) for parsing things

For convenience, minified versions of the JS and CSS dependencies are included in this repository in the build/lib folder. This folder includes the necessary JS and CSS files as well as the fonts required for KaTex and Tufte CSS. To use these, add kg-lib.js and either kg-lib.css or kg-tufte.css. If your project already includes those libraries, you can just use kg.js.


## Code Development

Please email me if you're interested in helping develop the code. Most development occurs during the summer months when I'm not teaching. :)
