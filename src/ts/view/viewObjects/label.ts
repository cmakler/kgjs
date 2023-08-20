/// <reference path="../../kg.ts" />

module KG {

    export interface LabelDefinition extends ViewObjectDefinition {
        x: any;
        y: any;
        text: string;

        plainText?: boolean;
        fontSize?: number;
        xPixelOffset?: number;
        yPixelOffset?: number;
        align?: string;
        valign?: string;
        rotate?: number;
    }

    export class Label extends ViewObject {

        private x: number;
        private y: number;
        private text: string;
        private plainText: boolean;
        private fontSize: number;
        private xPixelOffset: number;
        private yPixelOffset: number;
        private align: string;
        private valign: string;
        private rotate: number;
        private color: string;
        private bgcolor: string;

        constructor(def: LabelDefinition) {

            const xAxisReversed = (def.xScale.rangeMin > def.xScale.rangeMax),
                yAxisReversed = (def.yScale.rangeMin < def.yScale.rangeMax);

            let xOffset = xAxisReversed ? 1 : -1,
                yOffset = yAxisReversed ? 12 : -12;

            if (def.x == 'AXIS') {
                def.x = def.yScale.intercept;
                def.align = xAxisReversed ? 'left' : 'right';
                def.xPixelOffset = xOffset;
            }

            if (def.x == 'OPPAXIS') {
                def.x = def.xScale.domainMax;
                def.align = xAxisReversed ? 'right' : 'left';
                def.xPixelOffset = -xOffset;
            }

            if (def.y == 'AXIS') {
                def.y = def.yScale.intercept;
                def.yPixelOffset = yOffset;
            }

            if (def.y == 'OPPAXIS') {
                def.y = def.yScale.domainMax;
                def.yPixelOffset = -yOffset;
            }

            //establish property defaults
            setDefaults(def, {
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12,
                align: 'center',
                valign: 'middle',
                rotate: 0,
                color: 'black'
            });

            // define constant and updatable properties
            setProperties(def, 'constants', ['xPixelOffset', 'yPixelOffset', 'fontSize', 'plainText']);
            setProperties(def, 'updatables', ['x', 'y', 'text', 'align', 'valign', 'rotate', 'color', 'bgcolor']);

            super(def);

            this.bgcolor = def.model.clearColor;

        }

        // create div for text
        draw(layer) {
            let label = this;

            label.rootElement = layer.append('div')
                .attr('class', 'draggable')
                .style('position', 'absolute')
                .style('font-size', label.fontSize + 'pt')
                .style('text-align', 'center')
                .style('padding-left', '3px')
                .style('padding-right', '3px')

            return label.addInteraction();
        }

        // update properties
        redraw() {
            let label = this;

            label.rootElement.style('color', label.color).style('background-color', label.bgcolor)
            ;

            const x = label.xScale.scale(label.x) + (+label.xPixelOffset),
                y = label.yScale.scale(label.y) - (+label.yPixelOffset);
            if (undefined != label.text) {
                if (label.plainText) {
                    //console.log('rendering label as plain text: ', label.text)
                    label.text = "\\text{" + label.text + "}";
                } else {
                    //console.log('rendering label as LaTeX: ', label.text)
                }
                try {
                    katex.render(label.text.toString(), label.rootElement.node());
                }
                catch(e) {
                    console.log("Error rendering KaTeX: ",label.text);
                }
            }
            label.rootElement.style('left', x + 'px');
            label.rootElement.style('top', y + 'px');
            const width = label.rootElement.node().clientWidth,
                height = label.rootElement.node().clientHeight;
            // Set left pixel margin; default to centered on x coordinate
            let alignDelta = width * 0.5;
            if (label.align == 'left') {
                alignDelta = 0;
            } else if (label.align == 'right') {
                // move left by half the width of the div if right aligned
                alignDelta = width;
            }
            label.rootElement.style('left', (x - alignDelta) + 'px');

            // Set top pixel margin; default to centered on y coordinate
            let vAlignDelta = height * 0.5;
            // Default to centered on x coordinate
            if (label.valign == 'top') {
                vAlignDelta = 0;
            } else if (label.valign == 'bottom') {
                vAlignDelta = height;
            }
            label.rootElement.style('top', (y - vAlignDelta) + 'px');

            const rotate = `rotate(-${label.rotate}deg)`;
            label.rootElement.style('-webkit-transform', rotate)
                .style('transform', rotate);

            return label;
        }
    }

}