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
        private color;
        private g;
        private dragLine;
        private line;

        constructor(def: SegmentDefinition) {
            def.updatables = ['x1', 'y1', 'x2', 'y2', 'color'];
            super(def);
        }

        draw(layer) {

            let segment = this;

            //initialize line

            segment.g = layer.append('g').attr('class','draggable');
            segment.dragLine = segment.g.append('line').attr('stroke-width','20px').attr("class","invisible");
            segment.line = segment.g.append('line').attr('stroke-width','1px');
            segment.interactionHandler.addTrigger(segment.g);

            return segment;
        }

        update(force) {
            let segment = super.update(force);
            if (segment.hasChanged) {
                segment.dragLine.attr("x1", segment.xScale.scale(segment.x1));
                segment.dragLine.attr("y1", segment.yScale.scale(segment.y1));
                segment.dragLine.attr("x2", segment.xScale.scale(segment.x2));
                segment.dragLine.attr("y2", segment.yScale.scale(segment.y2));
                segment.line.attr("x1", segment.xScale.scale(segment.x1));
                segment.line.attr("y1", segment.yScale.scale(segment.y1));
                segment.line.attr("x2", segment.xScale.scale(segment.x2));
                segment.line.attr("y2", segment.yScale.scale(segment.y2));
                segment.line.attr("stroke", segment.color);
            }
            return segment;
        }
    }

}