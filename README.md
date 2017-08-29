# kg.js
Javascript Renderer for KineticGraphs

## What it does

The purpose of kg.js is to provide a way to render interactive diagrams ("KineticGraphs") defined as a JSON.

Once the page is loaded, kg.js looks for any elements with a class name `kg-container`. These elements should have a `src` attribute with a URL pointing to a JSON file. This file contains all the information necessary to render a KineticGraph and handle user interactions with it.

Each KineticGraph is a standalone diagram, and does not communicate with the outside page. In particular, you can have multiple graphs rendered from the same JSON and interact with them separately.

Each KineticGraph maintains its aspect ratio as the page window changes dimensions. If a KineticGraph includes a `sidebar` (an area to the right, which generally contains a caption as well as user controls like sliders), that `sidebar` is positioned to the right of the diagram for wide pages, and below the diagram for smaller ones. This responsive flow and layout is designed to work seamlessly with [Tufte CSS](https://edwardtufte.github.io/tufte-css/); just place a KineticGraph within a `figure` element with class `fullwidth`.

## Dependencies

This project is made possible by two incredible open-source technologies:
* [D3](https://d3js.org/) for drawing
* [KaTeX](https://khan.github.io/KaTeX/) for rendering math
For convenience, minified versions of the JS and CSS dependencies are included in this repository in the build/lib folder. This folder includes the necessary JS and CSS files as well as the fonts required for KaTex and Tufte CSS. To use these, add kg-lib.js and either kg-lib.css or kg-tufte.css. If your project already includes those libraries, you can just use kg.js.

## Authoring

Anyone can create a KineticGraph simply by creating a JSON file. 

## Code Development

TBA

## Running locally

Clone this repo and 

## Getting started

Clone this repo

The JSON file has four root objects:
* `aspectRatio` (optional; default `1`): the interactive diagram will have a fixed proportion based on the width of the enclosing container. As you resize your window, the diagram will retain its proportion. The `aspectRatio` in the JSON specifies the proportion, as width/height. Therefore, if you set `aspectRatio: 2`, the diagram will be twice as wide as it is high.
* `params` (required): this is a list of parameter definitions. Parameters are always expressed as numbers that the user can change. (Boolean parameters are 0 and 1.) Each `param` definition specifies the following:
  * `name` (required): a unique string name
  * `value` (required): the initial value of the parameter.
  * `min` (optional; default `0`): the minimum value of the parameter. If the user tries to set the parameter value below this level, it will set to this level instead. This is also used as the left-hand value in a slider.
  * `max` (optional; default `100`): same as `min`, for the maximum value.
  * `round` (optional; default `1`): as the user changes the parameter, it rounds to this value
  * `precision` (optional; computed from `round` if not set): number of digits after the decimal point used when displaying the param. If not set, tries to use `round` to determine: e.g., if `round = 0.1` then `precision` will be set to `1`, and if `round = 0.125` then `precision` will be set to `3`.
