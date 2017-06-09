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
        public element;

        constructor(def) {
            def.updatables = ['x','y','text'];
            super(def);
            let label = this;
            label.x = def.x;
            label.y = def.y;
            label.text = def.text;

            label.element = def.layer.append('div')
                .style('position','absolute')
                .style('background-color','green');

            label.update();
        }

        update() {
            let label = super.update();
            label.element.style('left', label.xScale.scale(label.x)+'px');
            label.element.style('top', label.yScale.scale(label.y)+'px');
            katex.render(label.text,label.element.node());
            return label;
        }
    }

}