/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface MathboxLabelDefinition extends MathboxPointDefinition {
        text: string;
    }

    export class MathboxLabel extends MathboxObject {

        public text;

        constructor(def:MathboxLabelDefinition) {
            super(def);
            let a = this;
            a.type = 'MathboxLabel';
        }

    }

}