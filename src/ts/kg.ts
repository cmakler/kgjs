/// <reference path="../../node_modules/@types/katex/index.d.ts"/>
/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="../../node_modules/@types/mathjs/index.d.ts"/>

/// <reference path="lib/underscore.ts"/>

/// <reference path="view/view.ts"/>

/// <reference path="model/model.ts"/>
/// <reference path="model/param.ts" />
/// <reference path="model/updateListener.ts" />
/// <reference path="model/dragUpdateListener.ts" />
/// <reference path="model/interactionHandler.ts" />

/// <reference path="view/scale.ts" />
/// <reference path="view/viewObjects/viewObject.ts" />
/// <reference path="view/viewObjects/clipPath.ts" />
/// <reference path="view/viewObjects/segment.ts" />
/// <reference path="view/viewObjects/axis.ts" />
/// <reference path="view/viewObjects/point.ts" />
/// <reference path="view/viewObjects/label.ts" />


// this file provides the interface with the overall web page

// initialize the diagram from divs with class kg-container

let viewDivs = document.getElementsByClassName('kg-container'),
    views = [];

for(let i = 0; i< viewDivs.length; i++) {
    d3.json(viewDivs[i].getAttribute('src'), function (data){
        views.push(new KG.View(viewDivs[i],data));
    });
}

// if the window changes size, update the dimensions of the containers

window.onresize = function() {
    views.forEach(function(c) {c.updateDimensions()} )
};





