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

        constructor(def, graph) {
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

}