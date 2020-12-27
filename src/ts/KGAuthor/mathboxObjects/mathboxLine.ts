/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface MathboxLineDefinition extends MathboxObjectDefinition {
        x1?: number;
        y1?: number;
        z1?: number;
        x2?: number;
        y2?: number;
        z2?: number;
        linestyle?: string;
    }

    export class MathboxLine extends MathboxObject {

        constructor(def: MathboxLineDefinition) {
            super(def);
            let a = this;
            a.type = 'MathboxLine';
        }

    }

}