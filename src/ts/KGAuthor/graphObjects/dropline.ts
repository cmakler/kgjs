/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Dropline extends Segment {

        constructor(def, graph) {
            def.lineStyle = 'dotted';
            delete def.label;
            super(def, graph);
        }

    }

    export class VerticalDropline extends Dropline {

        constructor(def, graph) {
            def.a = [def.x, graph.xScale.intercept];
            def.b = [def.x, def.y];
            super(def, graph);
        }
    }

    export class CrossGraphVerticalDropline extends VerticalDropline {

        constructor(def, graph) {
            def.xScale2Name = '';
            super(def,graph);
        }
    }

    export class HorizontalDropline extends Dropline {

        constructor(def, graph) {
            def.a = [graph.yScale.intercept, def.y];
            def.b = [def.x, def.y];
            super(def, graph);
        }
    }

    export class CrossGraphHorizontalDropline extends HorizontalDropline {

        constructor(def, graph) {
            def.xScale2Name = '';
            super(def,graph);
        }
    }

}