/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface ExplanationDefinition extends DivObjectDefinition {
        divs: any[]
    }

    export class Explanation extends DivObject {

        constructor(def: ExplanationDefinition) {

            super(def);
            this.type = 'Explanation';

        }

    }


}