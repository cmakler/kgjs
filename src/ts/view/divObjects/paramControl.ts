/// <reference path="../../kg.ts" />

module KG {

    export interface ParamControlDefinition extends DivObjectDefinition {
        param: string;
        label: string;
    }

    export class ParamControl extends DivObject {

        public param;
        public label;

        constructor(def: ParamControlDefinition) {

            // establish property defaults
            setDefaults(def, {
                value: 'params.' + def.param,
                alwaysUpdate: true
            });

            // define constant and updatable properties
            setProperties(def, 'constants',['param']);
            setProperties(def, 'updatables',['label', 'value']);

            super(def);
        }
    }

}