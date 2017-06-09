/// <reference path="../../kg.ts" />

module KG {

    export interface LabelDefinition extends ViewObjectDefinition {
        x: any;
        y: any;
        text: string;
    }

    export class Label extends ViewObject {

        private x: number;
        private y: number;
        private text: string;
        private element: any;

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