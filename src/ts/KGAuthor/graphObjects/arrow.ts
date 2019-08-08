/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface ArrowDefinition extends SegmentDefinition {
        begin: any;
        end: any;
        trim: any;
        double?: boolean;
    }


    export class Arrow extends Segment {


        constructor(def, graph) {

            def.endArrow = true;

            if (def.hasOwnProperty('double')) {
                def.startArrow = def.double;
            }

            if (def.hasOwnProperty('trim')) {
                def.a = [averageDefs(def.end[0], def.begin[0], def.trim),averageDefs(def.end[1], def.begin[1], def.trim)];
                def.b = [averageDefs(def.begin[0], def.end[0], def.trim),averageDefs(def.begin[1], def.end[1], def.trim)];
            } else {
                def.a = def.begin;
                def.b = def.end;
            }

            super(def, graph);
        }

    }

}