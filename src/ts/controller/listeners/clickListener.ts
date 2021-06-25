/// <reference path="../../kg.ts" />

module KG {

    export interface ClickListenerDefinition extends ListenerDefinition {
        transitions: number[];
    }

    export interface IClickListener extends IListener {
        state: number;
    }

    export class ClickListener extends Listener implements IClickListener {

        public state: number
        public transitions: number[]

        constructor(def: ClickListenerDefinition) {
            setDefaults(def, {transitions: [1,0]}); // default to toggle on/off
            super(def);
            this.transitions = def.transitions;
        }

        click() {
            const c = this;
            console.log("clicking", c);
            const current = c.model.currentParamValues[c.param];
            const newvalue = c.transitions[current];
            c.model.updateParam(c.param, newvalue);
        }

    }

}