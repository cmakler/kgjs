/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Curve extends GraphObject {

        constructor(def, graph) {
            def = setStrokeColor(def);
            if (def.hasOwnProperty('univariateFunctions')) {
                delete def.univariateFunctions;
            }
            super(def, graph);
            this.type = 'Curve';
            this.layer = def.layer || 1;
        }

    }

}