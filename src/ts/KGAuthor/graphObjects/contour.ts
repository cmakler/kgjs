/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface ContourDefinition extends GraphObjectDefinition {

    }

    export class Contour extends GraphObject {

        constructor(def, graph) {
            def = setStrokeColor(def);
            super(def, graph);
            let c = this;
            c.type = 'Contour';
            c.layer = def.layer || 1;

        }

    }

}