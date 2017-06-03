/// <reference path="node_modules/@types/d3/index.d.ts"/>
/// <reference path="node_modules/@types/mathjs/index.d.ts"/>

/// <reference path="src/container.ts"/>
/// <reference path="src/scope.ts"/>

/// <reference path="src/param.ts" />

/// <reference path="src/view.ts" />

/// <reference path="src/viewObject.ts" />
/// <reference path="src/viewObjects/point.ts" />
/// <reference path="src/viewObjects/label.ts" />

// initialize the diagram

let containerDivs = document.getElementsByClassName('kg-container'),
    containers = [];

for(let i = 0; i< containerDivs.length; i++) {
    containers.push(new KG.Container(containerDivs[i]));
}

window.onresize = function() {
    containers.forEach(function(c) {c.updateWidth()} )
};





