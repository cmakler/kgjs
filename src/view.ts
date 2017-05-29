/// <reference path="scope.ts" />

module KG {

    export interface IView {
        update : (scope:Scope) => ViewObject;
    }

    export class View implements IView {

        public def;

        constructor(def) {
            this.def = def;
        }

        update() {
            return this;
        }
    }

}