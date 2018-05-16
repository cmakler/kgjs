/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface GameMatrixDefinition extends DivObjectDefinition {

    }

    export class GameMatrix extends DivObject {

        constructor(def:GameMatrixDefinition) {
            super(def);
            this.type = 'GameMatrix';
        }

    }

}