/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface ArrowDefinition extends SegmentDefinition {
        begin: any;
        end: any;
        double?: boolean;
    }


    export class Arrow extends Segment {


        constructor(def, graph) {

            def.endArrow = true;

            if (def.hasOwnProperty('double')) {
                def.startArrow = def.double;
            }

            def.a = def.begin;
            def.b = def.end;

            

            super(def, graph);
        }

    }

}