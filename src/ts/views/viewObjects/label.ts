/// <reference path="../../kg.ts" />

module KG {

    export interface LabelDefinition extends ViewObjectDefinition {
        x: any;
        y: any;
        text: string;
    }

    export interface ILabel extends IViewObject {
        element: d3.Selection<SVGElement, {}, HTMLElement, any>
    }

    export class Label extends ViewObject implements ILabel {

        private x;
        private y;
        private text;
        public element;

        constructor(def) {
            def.updatables = ['x','y','text'];
            super(def);
            let label = this;

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