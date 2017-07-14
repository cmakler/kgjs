/// <reference path="../../kg.ts" />

module KG {

    export interface SegmentDefinition extends ViewObjectDefinition {
        x1: any;
        y1: any;
        x2: any;
        y2: any;
        color?: any;
        width?: any;
    }

    export class Segment extends ViewObject {

        private x1;
        private y1;
        private x2;
        private y2;
        private color;
        private g;
        private dragLine;
        private line;
        private width;

        constructor(def: SegmentDefinition) {

            // establish property defaults
            def = _.defaults(def, {
                color: 'black',
                width: '1pt',
                updatables: []
            });

            // define updatable properties
            def.updatables = def.updatables.concat(['x1', 'y1', 'x2', 'y2', 'color', 'width']);

            super(def);
        }

        // create SVG elements
        draw(layer) {
            let segment = this;
            segment.g = layer.append('g').attr('class', 'draggable');
            segment.dragLine = segment.g.append('line').attr('stroke-width', '20px').attr("class", "invisible");
            segment.line = segment.g.append('line');
            segment.interactionHandler.addTrigger(segment.g);
            return segment;
        }

        // update properties
        update(force) {
            let segment = super.update(force);
            if (segment.hasChanged) {
                const x1 = segment.xScale.scale(segment.x1),
                    x2 = segment.xScale.scale(segment.x2),
                    y1 = segment.yScale.scale(segment.y1),
                    y2 = segment.yScale.scale(segment.y2),
                    color = segment.color,
                    width = segment.width;
                segment.dragLine.attr("x1", x1);
                segment.dragLine.attr("y1", y1);
                segment.dragLine.attr("x2", x2);
                segment.dragLine.attr("y2", y2);
                segment.line.attr("x1", x1);
                segment.line.attr("y1", y1);
                segment.line.attr("x2", x2);
                segment.line.attr("y2", y2);
                segment.line.attr("stroke", color);
                segment.line.attr('stroke-width', width);
            }
            return segment;
        }
    }

}