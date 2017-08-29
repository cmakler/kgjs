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

    export class DivObject extends ViewObject implements IDivObject {



    }

}