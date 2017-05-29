/// <reference path="../scope.ts" />

module KG {

    export interface ILabel extends IViewObject {
        x: any;
        y: any;
        text: string;
        element: d3.Selection<SVGElement, {}, HTMLElement, any>
    }

    export class Label extends ViewObject implements ILabel {

        public x;
        public y;
        public text;
        public foo;
        public element;

        constructor(scope, layer, def) {
            super(scope, layer, def);
            let label = this;
            label.x = def.x;
            label.y = def.y;
            label.text = def.text;

            //initialize text element (svg for now, will become KaTex)
            label.element = layer.append('text');

            console.log('initialized label object: ', label);
        }

        update() {
            let label = this;
            label.element.attr('x', (label.scope.evaluate(label.x) - 0.5) * label.scope.scale);
            label.element.attr('y', (10.5 - label.scope.evaluate(label.y)) * label.scope.scale);
            label.element.text(label.scope.evaluate(label.text));
            return label;
        }
    }

}