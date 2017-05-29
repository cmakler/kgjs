/// <reference path="scope.ts" />

module KG {

    export interface IViewObject {
        scope: Scope;
        layer: d3.Selection<SVGElement, {}, HTMLElement, any>;
        update : (scope:Scope) => ViewObject;
    }

    export class ViewObject implements IViewObject {

        public scope;
        public layer;

        constructor(scope, layer, def) {
            this.scope = scope;
            this.layer = layer;
        }

        update() {
            return this;
        }
    }

}