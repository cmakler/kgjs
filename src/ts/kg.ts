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
/// <reference path="view/viewObjects/marker.ts" />
/// <reference path="view/viewObjects/segment.ts" />
/// <reference path="view/viewObjects/curve.ts" />
/// <reference path="view/viewObjects/axis.ts" />
/// <reference path="view/viewObjects/point.ts" />
/// <reference path="view/viewObjects/circle.ts" />
/// <reference path="view/viewObjects/rectangle.ts" />
/// <reference path="view/viewObjects/area.ts" />
/// <reference path="view/viewObjects/ggbObject.ts" />
/// <reference path="view/viewObjects/contour.ts" />
/// <reference path="view/viewObjects/label.ts" />

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
/// <reference path="view/divObjects/explanation.ts"/>
/// <reference path="view/divObjects/table.ts" />

/// <reference path="view/mathboxObjects/mathboxObject.ts" />
/// <reference path="view/mathboxObjects/mathboxAxis.ts" />
/// <reference path="view/mathboxObjects/mathboxPoint.ts" />
/// <reference path="view/mathboxObjects/mathboxCurve.ts" />
/// <reference path="view/mathboxObjects/mathboxSurface.ts" />
/// <reference path="view/mathboxObjects/mathboxShape.ts" />
/// <reference path="view/mathboxObjects/mathboxLabel.ts" />

declare function renderMathInElement(node, delimiters);

// this file provides the interface with the overall web page

let views = [];

// initialize the diagram from divs with class kg-container

window.addEventListener("load", function () {
    let viewDivs = document.getElementsByClassName('kg-container');

    // for each div, fetch the JSON definition and create a View object with that div and data
    for (let i = 0; i < viewDivs.length; i++) {
        const d = viewDivs[i],
            src = d.getAttribute('src'),
            fmt = d.getAttribute('format'),
            greenscreen = d.getAttribute('greenscreen') || false;

        if (d.innerHTML.indexOf('svg') > -1) {
            //console.log('already loaded');
        } else {

            // if there is no src attribute
            if (!src || src.indexOf('.yml') > -1) {
                try {

                    function generateViewFromYamlText(t) {
                        const y = jsyaml.safeLoad(t);
                        const j = JSON.parse(JSON.stringify(y).replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&'));
                        j.greenscreen = greenscreen;
                        views.push(new KG.View(d, j));
                    }

                    if (src) {
                        // load YAML from source file
                        d3.text(src).then(function (yaml_file) {
                            generateViewFromYamlText(yaml_file);
                        });

                    } else {
                        // read inner HTML of div as YAML
                        generateViewFromYamlText(d.innerHTML);

                    }

                } catch (e) {
                    console.log('Error reading YAML: ', e.message)
                }
            }

            // first look to see if there's a definition in the KG.viewData object
            else if (KG['viewData'].hasOwnProperty(src)) {
                viewDivs[i].innerHTML = "";
                views.push(new KG.View(viewDivs[i], KG['viewData'][src]));
            } else {
                // then look to see if the src is available by a URL
                d3.json(src + "?update=true").then(function (data) {
                    if (!data) {
                        d.innerHTML = "<p>oops, " + src + " doesn't seem to exist.</p>"
                    } else {
                        d.innerHTML = "";
                        data.greenscreen = greenscreen;
                        views.push(new KG.View(d, data));
                    }
                })
            }
            d.classList.add('kg-loaded');
        }
    }

});


// if the window changes size, update the dimensions of the containers

window.onresize = function () {
    views.forEach(function (c) {
        c.updateDimensions()
    })
};

// if embedded within a slide, send slide transitions to the parent

document.addEventListener("keyup", event => {
    if (event.key == 'PageDown') {
        event.preventDefault();
        console.log('trigger next page');
        if (window != window.parent) {
            window.parent.postMessage(JSON.stringify({
                method: 'next'
            }), '*');
        }
    }
    if (event.key == 'PageUp') {
        event.preventDefault();
        if (window != window.parent) {
            window.parent.postMessage(JSON.stringify({
                method: 'prev'
            }), '*');
        }
    }
});





