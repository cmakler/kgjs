/// <reference path="../../kg.ts" />

module KG {

    export interface MathboxObjectDefinition extends ViewObjectDefinition {

    }

    export interface IMathboxObject extends IViewObject {
        mathbox: Mathbox;
    }

    export class MathboxObject extends ViewObject implements IMathboxObject {

        public mathbox;

        constructor(def: MathboxObjectDefinition) {
            setDefaults(def, {
                interactive: false
            });
            setProperties(def, 'updatables', []);
            setProperties(def, 'constants', []);

            super(def);

            let mo = this;
        }

        mathboxExists() {
            return this.mathbox != undefined;
        }

    }

}