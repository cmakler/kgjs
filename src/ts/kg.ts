/// <reference path="../../node_modules/@types/katex/index.d.ts"/>
/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="../../node_modules/@types/mathjs/index.d.ts"/>

/// <reference path="lib/underscore.ts"/>

/// <reference path="view.ts"/>

/// <reference path="model/model.ts"/>
/// <reference path="model/param.ts" />
/// <reference path="model/updateListener.ts" />
/// <reference path="model/dragUpdateListener.ts" />
/// <reference path="model/interactionHandler.ts" />

/// <reference path="views/scale.ts" />

/// <reference path="views/viewObjects/viewObject.ts" />
/// <reference path="views/viewObjects/clipPath.ts" />
/// <reference path="views/viewObjects/segment.ts" />
/// <reference path="views/viewObjects/axis.ts" />
/// <reference path="views/viewObjects/point.ts" />
/// <reference path="views/viewObjects/label.ts" />


// this file provides the interface with the overall web page

// initialize the diagram from divs with class kg-container

let viewDivs = document.getElementsByClassName('kg-container'),
    views = [];

for(let i = 0; i< viewDivs.length; i++) {
    views.push(new KG.View(viewDivs[i]));
}

// if the window changes size, update the dimensions of the containers

window.onresize = function() {
    views.forEach(function(c) {c.updateDimensions()} )
};





