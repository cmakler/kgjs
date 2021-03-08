/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface MathboxAxisDefinition extends MathboxObjectDefinition {
        min: any;
        max: any;
        ticks?: any;
        width?: any;
        detail?: any;
        title?: string;
    }

    export class MathboxAxis extends MathboxObject {

        constructor(def: MathboxAxisDefinition) {
            super(def);
            let a = this;
            a.type = 'MathboxAxis';
        }

    }

    export class MathboxXAxis extends MathboxObject {

        constructor(def: MathboxAxisDefinition) {
            super(def);
            let a = this;
            a.type = 'MathboxXAxis';
        }

    }

    export class MathboxYAxis extends MathboxObject {

        constructor(def: MathboxAxisDefinition) {
            super(def);
            let a = this;
            a.type = 'MathboxYAxis';
        }

    }

    export class MathboxZAxis extends MathboxObject {

        constructor(def: MathboxAxisDefinition) {
            super(def);
            let a = this;
            a.type = 'MathboxZAxis';
        }

    }

}