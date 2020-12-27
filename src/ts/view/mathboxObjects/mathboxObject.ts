/// <reference path="../../kg.ts" />

module KG {

    export interface MathboxObjectDefinition extends ViewObjectDefinition {
        mathbox: Mathbox;
        stroke?: string;
    }

    export interface IMathboxObject extends IViewObject {
        mathbox: Mathbox;
        mo: any;
    }

    export class MathboxObject extends ViewObject implements IMathboxObject {

        public mathbox;
        public mo;

        constructor(def: MathboxObjectDefinition) {
            setProperties(def, 'constants', ['mathbox']);
            super(def);
        }

        onGraph() {
            return true; // we won't check yet to see if it's on the graph...
        }

        displayElement(show: boolean) {
            const mbo = this;
            if(mbo.hasOwnProperty("mo")) {
                 this.mo.set("visible",show);
            }
        }

    }

}