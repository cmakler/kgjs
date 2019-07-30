/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface AreaDefinition extends GraphObjectDefinition {

    }

    export class Area extends GraphObject {

        constructor(def, graph) {
            super(def, graph);
            this.type = 'Area';
            this.layer = def.layer || 0;
        }

    }

}