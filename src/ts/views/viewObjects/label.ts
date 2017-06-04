/// <reference path="../../kg.ts" />

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

        constructor(view, layer, def) {
            super(view, layer, def);
            let label = this;
            label.x = def.x;
            label.y = def.y;
            label.text = def.text;

            //initialize text element (svg for now, will become KaTex)
            label.element = layer.append('text');

            console.log('initialized label object: ', label);

            label.update();
        }

        update() {
            let label = this;
            label.element.attr('x', label.xScale.scale(label.model.eval(label.x)));
            label.element.attr('y', label.yScale.scale(label.model.eval(label.y)));
            label.element.text(label.model.eval(label.text));
            return label;
        }
    }

}