/// <reference path="../../kg.ts" />

module KG {

    export interface SegmentDefinition extends ViewObjectDefinition {
        x1: any;
        y1: any;
        x2: any;
        y2: any;
    }

    export class Segment extends ViewObject {

        private x1;
        private y1;
        private x2;
        private y2;

        private g;
        private dragLine;
        private line;

        constructor(def: SegmentDefinition) {
            setProperties(def, 'updatables',['x1', 'y1', 'x2', 'y2']);
            super(def);
        }

        // create SVG elements
        draw(layer) {
            let segment = this;
            segment.rootElement = layer.append('g');
            segment.dragLine = segment.rootElement.append('line').attr('stroke-width', '20px').style('stroke-opacity', 0);
            segment.line = segment.rootElement.append('line');
            return segment.addClipPath().addInteraction();
        }

        // update properties
        redraw() {
            let segment = this;
            const x1 = segment.xScale.scale(segment.x1),
                x2 = segment.xScale.scale(segment.x2),
                y1 = segment.yScale.scale(segment.y1),
                y2 = segment.yScale.scale(segment.y2),
                stroke = segment.stroke,
                strokeWidth = segment.strokeWidth;
            segment.dragLine.attr("x1", x1);
            segment.dragLine.attr("y1", y1);
            segment.dragLine.attr("x2", x2);
            segment.dragLine.attr("y2", y2);
            segment.line.attr("x1", x1);
            segment.line.attr("y1", y1);
            segment.line.attr("x2", x2);
            segment.line.attr("y2", y2);
            segment.line.attr("stroke", stroke);
            segment.line.attr('stroke-width', strokeWidth);
            if(segment.lineStyle == 'dashed') {
                segment.line.style('stroke-dashArray','10,10');
            }
            if(segment.lineStyle == 'dotted') {
                segment.line.style('stroke-dashArray','1,2');
            }
            return segment;
        }
    }

}