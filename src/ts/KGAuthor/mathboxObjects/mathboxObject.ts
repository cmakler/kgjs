/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface MathboxObjectDefinition extends AuthoringObjectDefinition {

    }

    export class MathboxObject extends AuthoringObject {
        public type;
    }

}