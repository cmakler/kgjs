/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface ContourDefinition extends GraphObjectDefinition {
        level?: any;
        x?: any;
        y?: any;
        coordinates?: any[];
        fn: string;
        fillAbove?: string;
        fillBelow?: string;
        xMin?: any;
        xMax?: any;
        yMin?: any;
        yMax?: any;

    }

    export class Contour extends GraphObject {

        private level;

        constructor(def: ContourDefinition, graph) {
            def = setStrokeColor(def);
            super(def, graph);
            let c = this;
            c.type = 'Contour';
            c.layer = def.layer || 1;
            if (def.hasOwnProperty('coordinates')) {
                c.extractCoordinates();
            }
            if (!def.hasOwnProperty('level')) {
                def.level = def.fn.replace(/\(x\)/g, `(${def.x})`).replace(/\(y\)/g, `(${def.y})`);
            }
            c.level = def.level;
        }

        parseSelf(parsedData) {
            let le = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs.contourLevel = le.level;
            return parsedData;
        }

    }

    // A contour map is an authoring-only object which generates multiple Contour objects. TODO use built-in D3 map to do exactly the same thing.

    export interface ContourMapDefinition extends ContourDefinition {
        levels: any[];
    }

    export class ContourMap extends GraphObject {

        constructor(def: ContourMapDefinition, graph) {
            KG.setDefaults(def, {
                color: "grey",
                strokeWidth: 0.5
            });
            super(def, graph);
            let m = this;
            m.type = 'ContourMap';
            m.layer = def.layer || 1;
            m.subObjects = def.levels.map(function (level) {
                let contourDef = copyJSON(def);
                delete contourDef.levels;
                contourDef.level = level;
                return new Contour(contourDef, graph);
            });
            console.log('contours: ', m.subObjects);
        }
    }


}