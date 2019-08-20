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
    }

    export class Contour extends GraphObject {

        constructor(def: ContourDefinition, graph) {
            def = setStrokeColor(def);
            super(def, graph);
            let c = this;
            c.type = 'Contour';
            c.layer = def.layer || 1;
            c.extractCoordinates();
            if(!def.hasOwnProperty('level')) {
                def.level = def.fn.replace('(x)',`(${def.x})`).replace('(y)',`(${def.y})`);
            }
        }

    }

    // A contour map is an authoring-only object which generates multiple Contour objects. TODO use built-in D3 map to do exactly the same thing.

    export interface ContourMapDefinition extends ContourDefinition {
        levels: any[];
    }

    export class ContourMap extends GraphObject {

        constructor(def: ContourMapDefinition, graph) {
            KG.setDefaults(def,{
                color: "grey",
                strokeWidth: 0.5
            });
            super(def,graph);
            let m = this;
            m.type = 'ContourMap';
            m.layer = def.layer || 1;
            m.subObjects = def.levels.map(function(level) {
                let contourDef = copyJSON(def);
                delete contourDef.levels;
                contourDef.level = level;
                return new Contour(contourDef, graph);
            });
            console.log('contours: ', m.subObjects);
        }
    }

}