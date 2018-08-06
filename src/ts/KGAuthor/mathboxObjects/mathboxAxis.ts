/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface MathboxAxisDefinition extends MathboxObjectDefinition {
        min: any;
        max: any;
        ticks?: any;
        width: any;
        detail: any;

    }

    export class MathboxAxis extends MathboxObject {

        public dim;

        constructor(def: MathboxAxisDefinition) {
            super(def);
            let a = this;
            a.type = 'MathboxAxis';
            a.mb.addObject({
                "type": "MathboxLabel",
                "def": {
                    "x": 50,
                    "y": 0,
                    "z": 0,
                    "text": "Good 1"
                }
            })
        }

    }

}