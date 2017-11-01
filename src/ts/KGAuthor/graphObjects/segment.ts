/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Segment extends GraphObject {

        constructor(def, graph) {
            def = setStrokeColor(def);
            super(def, graph);
            const s = this;
            s.type = 'Segment';
            s.layer = 1;
            s.extractCoordinates('a', 'x1', 'y1');
            s.extractCoordinates('b', 'x2', 'y2');
        }

    }

    export class CrossGraphSegment extends Segment {

        constructor(def, graph) {
            def.xScale2Name = '';
            super(def,graph);
        }
    }

}