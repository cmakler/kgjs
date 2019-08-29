/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface RadioGroupDefinition extends DivObjectDefinition {
        param: string;
        options: string[];
    }

    export interface ControlsDefinition extends DivObjectDefinition {
        radioGroup?: RadioGroupDefinition;
        radios?: { param: string; optionValue: number; label: string }[]
    }

    export function parseControlsDef(controlDef: ControlsDefinition) {
        if (controlDef.hasOwnProperty('radioGroup')) {
            controlDef.radios = controlDef.radioGroup.options.map(function (option, index) {
                return {
                    param: controlDef.radioGroup.param,
                    optionValue: index,
                    label: `\\text{${option}}`
                }
            })
        }
    }

    export class Controls extends DivObject {

        constructor(def: ControlsDefinition) {

            parseControlsDef(def);

            super(def);
            this.type = 'Controls';
        }


    }


}