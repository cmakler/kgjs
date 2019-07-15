/// <reference path="../../node_modules/@types/katex/index.d.ts"/>
/// <reference path="../../node_modules/@types/d3/index.d.ts"/>
/// <reference path="../../node_modules/@types/mathjs/index.d.ts"/>
/// <reference path="../../node_modules/@types/js-yaml/index.d.ts"/>

/// <reference path="lib/underscore.ts"/>

/// <reference path="KGAuthor/kgAuthor.ts"/>

/// <reference path="model/model.ts"/>
/// <reference path="model/param.ts" />
/// <reference path="model/restriction.ts" />
/// <reference path="model/updateListener.ts" />

/// <reference path="math/mathFunction.ts" />
/// <reference path="math/univariateFunction.ts" />
/// <reference path="math/parametricFunction.ts" />
/// <reference path="math/multivariateFunction.ts" />

/// <reference path="controller/listeners/listener.ts" />
/// <reference path="controller/listeners/dragListener.ts" />
/// <reference path="controller/listeners/clickListener.ts" />
/// <reference path="controller/interactionHandler.ts" />

/// <reference path="view/view.ts"/>
/// <reference path="view/scale.ts" />

/// <reference path="view/viewObjects/viewObject.ts" />
/// <reference path="view/viewObjects/segment.ts" />
/// <reference path="view/viewObjects/curve.ts" />
/// <reference path="view/viewObjects/axis.ts" />
/// <reference path="view/viewObjects/point.ts" />
/// <reference path="view/viewObjects/rectangle.ts" />
/// <reference path="view/viewObjects/area.ts" />
/// <reference path="view/viewObjects/ggbObject.ts" />

/// <reference path="view/divObjects/divObject.ts" />
/// <reference path="view/divObjects/positionedDiv.ts" />
/// <reference path="view/divObjects/div.ts" />
/// <reference path="view/divObjects/paramControl.ts"/>
/// <reference path="view/divObjects/slider.ts"/>
/// <reference path="view/divObjects/checkbox.ts"/>
/// <reference path="view/divObjects/radio.ts"/>
/// <reference path="view/divObjects/controls.ts"/>
/// <reference path="view/divObjects/gameMatrix.ts"/>
/// <reference path="view/divObjects/ggbApplet.ts"/>
/// <reference path="view/divObjects/mathbox.ts"/>
/// <reference path="view/divObjects/sidebar.ts"/>
/// <reference path="view/viewObjects/label.ts" />

/// <reference path="view/mathboxObjects/mathboxObject.ts" />
/// <reference path="view/mathboxObjects/mathboxAxis.ts" />
/// <reference path="view/mathboxObjects/mathboxPoint.ts" />
/// <reference path="view/mathboxObjects/mathboxCurve.ts" />
/// <reference path="view/mathboxObjects/mathboxSurface.ts" />
/// <reference path="view/mathboxObjects/mathboxLabel.ts" />

declare function renderMathInElement(node,delimiters);


// this file provides the interface with the overall web page

let views = [];

// initialize the diagram from divs with class kg-container

window.addEventListener("load", function () {
    let viewDivs = document.getElementsByClassName('kg-container');

    // for each div, fetch the JSON definition and create a View object with that div and data
    for (let i = 0; i < viewDivs.length; i++) {
        const d = viewDivs[i],
        src = d.getAttribute('src');

        // if there is no src attribute
        if (!src) {
            try {
                var doc = jsyaml.safeLoad(d.innerHTML);
                console.log(doc);
                views.push(new KG.View(d, doc));
            } catch (e) {
                console.log(e);
            }
        }

        // first look to see if there's a definition in the KG.viewData object
        else if (KG['viewData'].hasOwnProperty(src)) {
            viewDivs[i].innerHTML = "";
            views.push(new KG.View(viewDivs[i], KG['viewData'][src]));
        } else {
            // then look to see if the src is available by a URL
            d3.json(src + "?update=true", function (data) {
                if (!data) {
                    viewDivs[i].innerHTML = "<p>oops, " + src + " doesn't seem to exist.</p>"
                } else {
                    viewDivs[i].innerHTML = "";
                    views.push(new KG.View(viewDivs[i], data));
                }
            })
        }
    }
    
})


// if the window changes size, update the dimensions of the containers

window.onresize = function () {
    views.forEach(function (c) {
        c.updateDimensions()
    })
};





