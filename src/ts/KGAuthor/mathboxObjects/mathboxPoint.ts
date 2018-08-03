/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface MathboxPointDefinition extends MathboxObjectDefinition {
        x: any;
        y: any;
        z: any;
    }

    export class MathboxPoint extends MathboxObject {

        public x;
        public y;
        public z;

        constructor(def:MathboxPointDefinition) {
            super(def);
            let a = this;
            a.type = 'MathboxPoint';
        }

    }

}