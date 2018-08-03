/// <reference path="../../kg.ts" />

module KG {

    export interface MathboxObjectDefinition extends ViewObjectDefinition {
        mathbox: Mathbox;
    }

    export interface IMathboxObject extends IViewObject {
        mathbox: Mathbox;
    }

    export class MathboxObject extends ViewObject implements IMathboxObject {

        public mathbox;

        constructor(def: MathboxObjectDefinition) {
            setProperties(def, 'constants', ['mathbox']);
            super(def);
        }

        mathboxExists() {
            return this.mathbox != undefined;
        }

        onGraph() {
            return true; // we won't check yet to see if it's on the graph...
        }

    }

}