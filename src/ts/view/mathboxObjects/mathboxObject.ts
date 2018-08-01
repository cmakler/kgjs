/// <reference path="../../kg.ts" />

module KG {

    export interface MathboxObjectDefinition extends ViewObjectDefinition {

    }

    export interface IMathboxObject extends IViewObject {

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

        update(force) {
            let mo = super.update(force);
            if (mo.show) {
                mo.displayElement(true);
                if (mo.hasChanged) {
                    mo.redraw();
                }
            }
            else {
                mo.displayElement(false);
            }
            return mo;
        }

    }

}