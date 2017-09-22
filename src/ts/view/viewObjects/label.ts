/// <reference path="../../kg.ts" />

module KG {

    export interface LabelDefinition extends ViewObjectDefinition {
        x: any;
        y: any;
        text: string;
        xPixelOffset?: number;
        yPixelOffset?: number;
        align?: string;
        valign?: string;
    }

    export class Label extends ViewObject {

        private x: number;
        private y: number;
        private text: string;
        private fontSize: number;
        private xPixelOffset: number;
        private yPixelOffset: number;
        private align: string;
        private valign: string;

        constructor(def: LabelDefinition) {

            //establish property defaults
            setDefaults(def, {
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12,
                align: 'center',
                valign: 'middle'
            });

            // define constant and updatable properties
            setProperties(def, 'constants', ['xPixelOffset', 'yPixelOffset', 'fontSize']);
            setProperties(def, 'updatables', ['x', 'y', 'text', 'align', 'valign']);

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
            katex.render(label.text, label.rootElement.node());
            label.rootElement.style('left', x + 'px');
            label.rootElement.style('top', y + 'px');
            const width = label.rootElement.node().clientWidth,
                height = label.rootElement.node().clientHeight;
            // Set left pixel margin; default to centered on x coordinate
            let alignDelta = width*0.5;
            if (label.align == 'left') {
                alignDelta = 0;
                label.rootElement.style('text-align','left');
            } else if (this.align == 'right') {
                // move left by half the width of the div if right aligned
                alignDelta = width + 2;
                label.rootElement.style('text-align','right');
            }
            label.rootElement.style('left',(x - alignDelta + label.xPixelOffset) + 'px');

            // Set top pixel margin; default to centered on y coordinate
            let vAlignDelta = height*0.5;
            // Default to centered on x coordinate
            if (this.valign == 'top') {
                vAlignDelta = 0;
            } else if (this.valign == 'bottom') {
                vAlignDelta = height;
            }
            label.rootElement.style('top',(y - vAlignDelta - label.yPixelOffset) + 'px');
            return label;
        }
    }

}