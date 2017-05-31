/// <reference path="node_modules/@types/d3/index.d.ts"/>

/// <reference path="src/container.ts"/>
/// <reference path="src/scope.ts"/>

/// <reference path="src/param.ts" />

/// <reference path="src/view.ts" />

/// <reference path="src/viewObject.ts" />
/// <reference path="src/viewObjects/point.ts" />
/// <reference path="src/viewObjects/label.ts" />

// initialize the diagram

let containers = document.getElementsByClassName('kg-container');

for(let i = 0; i< containers.length; i++) {
    new KG.Container(containers[i]);
}





