/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface ContourDefinition extends GraphObjectDefinition {
        fn: string;
        level: any;
        areaAbove?: any;
        areaBelow?: any;
    }

    export class Contour extends GraphObject {

        constructor(def:ContourDefinition, graph) {
            def = setStrokeColor(def);


            super(def, graph);
            let c = this;
            c.type = 'Contour';
            c.layer = def.layer || 1;

        }

    }

}