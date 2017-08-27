/// <reference path="../../kg.ts" />

module KG {

    export interface ISchema extends IParser {
        specialTypes: string[]
    }

    export class Schema implements ISchema {

        public specialTypes;

        constructor() {

        }

        parse(schema:any) {
            return this;
        }

    }

}