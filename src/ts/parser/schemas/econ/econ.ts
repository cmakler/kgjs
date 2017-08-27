/// <reference path="../../../kg.ts" />

module KG {

    export interface IEconSchema extends ISchema {
        specialTypes: string[]
    }

    export class EconSchema extends Schema implements IEconSchema {



    }

}