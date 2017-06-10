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
        private line;

        constructor(def: SegmentDefinition) {
            def.updatables = ['x1', 'y1', 'x2', 'y2'];
            super(def);
        }

        draw(layer) {

            let segment = this;

            //initialize circle
            segment.line = segment.addSVGElement(layer,'line');
            segment.line.setAttributeNS(null, "stroke", "green");

            //segment.interactionHandler.addTrigger(segment.line);

            return segment;
        }

        update() {
            let segment = super.update();
            if (segment.hasChanged) {
                segment.line.setAttributeNS(null, "x1", segment.xScale.scale(segment.x1));
                segment.line.setAttributeNS(null, "y1", segment.yScale.scale(segment.y1));
                segment.line.setAttributeNS(null, "x2", segment.xScale.scale(segment.x2));
                segment.line.setAttributeNS(null, "y2", segment.yScale.scale(segment.y2));
            }
            return segment;
        }
    }

}