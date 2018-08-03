/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface MathboxLineDefinition extends MathboxObjectDefinition {
        min: any;
        max: any;
        ticks?: any;
        width: any;
        detail: any;

    }

    export class MathboxLine extends MathboxObject {

        public dim;

        constructor(def:MathboxLineDefinition) {
            super(def);
            let a = this;
            a.type = 'MathboxAxis';
        }

    }

}