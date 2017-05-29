/// <reference path="node_modules/@types/d3/index.d.ts"/>

/// <reference path="src/scope.ts"/>

/// <reference path="src/param.ts" />

/// <reference path="src/view.ts" />

/// <reference path="src/viewObject.ts" />
/// <reference path="src/viewObjects/point.ts" />
/// <reference path="src/viewObjects/label.ts" />

const diagramDef = {
    containerId: 'diagramDiv',
    params: {
        yA: {
            value: 5,
            min: 1,
            max: 9,
            round: 0.5
        },
        xB: {
            value: 20,
            min: 1,
            max: 24,
            round: 0.25
        },
        yB: {
            value: 8,
            min: 1,
            max: 9
        }
    }, objects: {
        points: [{
            x: 2,
            y: 'yA'
        }, {
            x: 'xB',
            y: 'yB'
        }],
        labels: [
            {
                x: 2.25,
                y: 'yA + 0.25',
                text: 'A'
            },
            {
                x: 'xB + 0.25',
                y: 'yB + 0.25',
                text: 'B'
            }
        ]
    }
};


// initialize the diagram

let d = new KG.Scope(diagramDef);

