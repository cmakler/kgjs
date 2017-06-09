/// <reference path="../../kg.ts" />

module KG {

    export interface LabelDefinition extends ViewObjectDefinition {
        x: any;
        y: any;
        xPixelOffset?: number;
        yPixelOffset?: number;
        text: string;
    }

    export class Label extends ViewObject {

        private x: number;
        private y: number;
        private text: string;
        private element: any;
        private xPixelOffset: number;
        private yPixelOffset: number;

        constructor(def) {
            def.updatables = ['x','y','text'];
            def = _.defaults(def,{
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12
            });
            super(def);
            let label = this;
            label.xPixelOffset = def.xPixelOffset;
            label.yPixelOffset = def.yPixelOffset;

            label.element = def.layer.append('div')
                .style('position','absolute')
                .style('font-size',def.fontSize + 'pt');

            label.update();
        }

        update() {
            let label = super.update();
            label.element.style('left', label.xScale.scale(label.x) + label.xPixelOffset + 'px');
            label.element.style('top', label.yScale.scale(label.y)+ label.yPixelOffset + 'px');
            katex.render(label.text,label.element.node());
            return label;
        }
    }

}