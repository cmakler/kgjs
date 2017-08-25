/// <reference path="../../kg.ts" />

module KG {

    export interface DivObjectDefinition extends UpdateListenerDefinition {
        layer: any;
        name?: string;
        show?: any;
    }

    export interface IDivObject extends IUpdateListener {
        draw: (layer: any) => DivObject;
    }

    export class DivObject extends UpdateListener implements IDivObject {

        public element;

        constructor(def: DivObjectDefinition) {
            def = _.defaults(def, {
                updatables: [],
                constants: [],
                show: true
            });

            super(def);

            let divObj = this;

            // the draw method creates the DOM elements for the view object
            // the update method updates their attributes
            if (def.hasOwnProperty('layer')) {
                divObj.draw(def.layer).update(true);
            }
        }

        draw(layer:any) {
            return this;
        }

    }

}