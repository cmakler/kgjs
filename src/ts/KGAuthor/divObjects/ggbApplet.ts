/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface GeoGebraAppletDefinition extends DivObjectDefinition {

    }

    export class GeoGebraApplet extends DivObject {

        constructor(def: GeoGebraAppletDefinition) {
            super(def);
            this.type = 'GeoGebraApplet';
        }
    }

}