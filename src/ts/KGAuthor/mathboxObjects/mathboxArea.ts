/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface MathboxAreaDefinition extends MathboxObjectDefinition {
        min: any;
        max: any;
        ticks?: any;
        width: any;
        detail: any;

    }

    export class MathboxArea extends MathboxObject {

        public dim;

        constructor(def:MathboxAreaDefinition) {
            super(def);
            let a = this;
            a.type = 'MathboxAxis';
        }

    }

    export class Area3D extends MathboxArea {
        // just another name for a 3D area
    }

}