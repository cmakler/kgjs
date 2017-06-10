/// <reference path="../../node_modules/@types/katex/index.d.ts"/>
// / <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="../../node_modules/@types/mathjs/index.d.ts"/>

/// <reference path="lib/underscore.ts"/>

/// <reference path="container.ts"/>

/// <reference path="model/model.ts"/>
/// <reference path="model/param.ts" />
/// <reference path="model/updateListener.ts" />

/// <reference path="views/view.ts" />
/// <reference path="views/scale.ts" />

/// <reference path="views/viewObjects/viewObject.ts" />
/// <reference path="views/viewObjects/interactionHandler.ts" />
/// <reference path="views/compositeObjects/axis.ts" />
/// <reference path="views/viewObjects/segment.ts" />
/// <reference path="views/viewObjects/point.ts" />
/// <reference path="views/viewObjects/label.ts" />


// this file provides the interface with the overall web page

// initialize the diagram from divs with class kg-container

let containerDivs = document.getElementsByClassName('kg-container'),
    containers = [];

for(let i = 0; i< containerDivs.length; i++) {
    containers.push(new KG.Container(containerDivs[i]));
}

// if the window changes size, update the dimensions of the containers

window.onresize = function() {
    containers.forEach(function(c) {c.updateDimensions()} )
};





