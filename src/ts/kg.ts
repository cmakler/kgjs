/// <reference path="../../node_modules/@types/katex/index.d.ts"/>
/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="../../node_modules/@types/mathjs/index.d.ts"/>

/// <reference path="lib/underscore.ts"/>

/// <reference path="parser/parser.ts"/>
/// <reference path="parser/schemas/schema.ts"/>
/// <reference path="parser/schemas/econ/econ.ts"/>
/// <reference path="parser/authoringObjects/authoringObject.ts"/>

/// <reference path="model/model.ts"/>
/// <reference path="model/param.ts" />
/// <reference path="model/restriction.ts" />
/// <reference path="model/updateListener.ts" />

/// <reference path="math/univariateFunction.ts" />

/// <reference path="controller/listeners/listener.ts" />
/// <reference path="controller/listeners/dragListener.ts" />
/// <reference path="controller/listeners/clickListener.ts" />
/// <reference path="controller/interactionHandler.ts" />

/// <reference path="view/view.ts"/>
/// <reference path="view/scale.ts" />

/// <reference path="view/viewObjects/viewObject.ts" />
/// <reference path="view/viewObjects/clipPath.ts" />
/// <reference path="view/viewObjects/segment.ts" />
/// <reference path="view/viewObjects/curve.ts" />
/// <reference path="view/viewObjects/axis.ts" />
/// <reference path="view/viewObjects/point.ts" />

/// <reference path="view/divObjects/divObject.ts" />
/// <reference path="view/divObjects/slider.ts"/>
/// <reference path="view/divObjects/sidebar.ts"/>
/// <reference path="view/viewObjects/label.ts" />


// this file provides the interface with the overall web page

let views = [];

// initialize the diagram from divs with class kg-container

window.addEventListener("load", function () {
    let viewDivs = document.getElementsByClassName('kg-container');

// for each div, fetch the JSON definition and create a View object with that div and data
    for (let i = 0; i < viewDivs.length; i++) {
        const url = viewDivs[i].getAttribute('src');
        viewDivs[i].innerHTML = "<p>loading...</p>";
        d3.json(url, function (data) {
            if (!data) {
                viewDivs[i].innerHTML = "<p>oops, " + url + " doesn't seem to exist.</p>"
            } else {
                viewDivs[i].innerHTML = "";
                views.push(new KG.View(viewDivs[i], data));
            }
        })
    }
});


// if the window changes size, update the dimensions of the containers

window.onresize = function () {
    views.forEach(function (c) {
        c.updateDimensions()
    })
};





