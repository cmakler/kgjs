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
        private rotate: number;

        constructor(def: LabelDefinition) {

            if(def.x == 'AXIS') {
                def.x = 0;
                def.align = 'right';
                def.xPixelOffset = -6;
            }

            if(def.y == 'AXIS') {
                def.y = 0;
                def.yPixelOffset = -14;
            }



            //establish property defaults
            setDefaults(def, {
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12,
                align: 'center',
                valign: 'middle',
                rotate: 0
            });

            // define constant and updatable properties
            setProperties(def, 'constants', ['xPixelOffset', 'yPixelOffset', 'fontSize']);
            setProperties(def, 'updatables', ['x', 'y', 'text', 'align', 'valign', 'rotate']);

            super(def);

        }

        // create div for text
        draw(layer) {
            let label = this;

            label.rootElement = layer.append('div')
                .attr('class', 'draggable')
                .style('position', 'absolute')
                .style('background-color', 'white')
                .style('font-size', label.fontSize + 'pt');

            return label.addInteraction();
        }

        // update properties
        redraw() {
            let label = this;
            const x = label.xScale.scale(label.x) + (+label.xPixelOffset),
                y = label.yScale.scale(label.y) - (+label.yPixelOffset);
            if(undefined != label.text) {
                katex.render(label.text.toString(), label.rootElement.node());
            }
            label.rootElement.style('left', x + 'px');
            label.rootElement.style('top', y + 'px');
            const width = label.rootElement.node().clientWidth,
                height = label.rootElement.node().clientHeight;
            // Set left pixel margin; default to centered on x coordinate
            let alignDelta = width*0.5;
            if (label.align == 'left') {
                alignDelta = 0;
                label.rootElement.style('text-align','left');
            } else if (label.align == 'right') {
                // move left by half the width of the div if right aligned
                alignDelta = width + 2;
                label.rootElement.style('text-align','right');
            }
            label.rootElement.style('left',(x - alignDelta) + 'px');

            // Set top pixel margin; default to centered on y coordinate
            let vAlignDelta = height*0.5;
            // Default to centered on x coordinate
            if (label.valign == 'top') {
                vAlignDelta = 0;
            } else if (label.valign == 'bottom') {
                vAlignDelta = height;
            }
            label.rootElement.style('top',(y - vAlignDelta) + 'px');

            const rotate = `rotate(-${label.rotate}deg)`;
            label.rootElement.style('-webkit-transform', rotate)
                    .style('transform', rotate)

            return label;
        }
    }

}