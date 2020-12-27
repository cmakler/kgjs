/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface MathboxObjectDefinition extends AuthoringObjectDefinition {
        mb?: Mathbox;
        stroke?: string;
    }

    export class MathboxObject extends AuthoringObject {
        public type: string;
        public mb: Mathbox;

        constructor(def: MathboxObjectDefinition) {
           super(def);
            this.mb = def.mb;
        }
    }

}