/// <reference path="../../kg.ts" />

module KG {

    export interface ClickListenerDefinition extends ListenerDefinition {

    }

    export interface IClickListener extends IListener {

    }

    export class ClickListener extends Listener implements IClickListener {

        constructor(def: ClickListenerDefinition) {
            super(def);
        }

    }

}