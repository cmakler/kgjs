/// <reference path="node_modules/@types/d3/index.d.ts"/>

/// <reference path="src/scope.ts"/>

/// <reference path="src/param.ts" />

/// <reference path="src/view.ts" />

/// <reference path="src/viewObject.ts" />
/// <reference path="src/viewObjects/point.ts" />
/// <reference path="src/viewObjects/label.ts" />

// initialize the diagram

let scopeDefs: KG.Scope[] = [];

let kgDivs = d3.selectAll("[kg-src]");

kgDivs.attr('loaded', function () {
    d3.json(kgDivs.attr('kg-src'), function (data) {
            data.containerId = kgDivs.attr('id');
            let d = new KG.Scope(data);
        });
        return 'true'
});



