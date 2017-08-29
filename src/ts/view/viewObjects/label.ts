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
        private fontSize: number;
        private element: any;
        private xPixelOffset: number;
        private yPixelOffset: number;

        constructor(def) {

            //establish property defaults
            setDefaults(def, {
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12
            });

            // define constant and updatable properties
            setProperties(def, 'constants',['xPixelOffset', 'yPixelOffset', 'fontSize']);
            setProperties(def, 'updatables',['x', 'y', 'text']);

            super(def);

        }

        // create div for text
        draw(layer) {
            let label = this;

            label.rootElement = layer.append('div')
                .attr('class', 'draggable')
                .style('position', 'absolute')
                .style('font-size', label.fontSize + 'pt');

            return label.addInteraction();
        }

        // update properties
        redraw() {
            let label = this;
            const x = label.xScale.scale(label.x) + (+label.xPixelOffset),
                y = label.yScale.scale(label.y) + (+label.yPixelOffset);
            label.rootElement.style('left', x + 'px');
            label.rootElement.style('top', y + 'px');
            katex.render(label.text, label.rootElement.node());
            return label;
        }
    }

}