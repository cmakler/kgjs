/// <reference path="../../../eg.ts"/>

module KGAuthor {

    export interface EconParetoLensDefinition extends GraphObjectDefinition {
        bundleA: string;
        bundleB: string;
    }


    export class EconParetoLens extends GraphObjectGenerator {

        constructor(def: EconParetoLensDefinition, graph) {

            super(def, graph);

            this.subObjects.push(new Rectangle({
                    clipPathName: def.bundleA + "_IC_above",
                    clipPathName2: def.bundleB + "_IC_above",
                    x1: graph.def.xAxis.min,
                    x2: graph.def.xAxis.max,
                    y1: graph.def.yAxis.min,
                    y2: graph.def.yAxis.max,
                    fill: "colors.paretoLens",
                    opacity: "0.8",
                    show: def.show
                }, graph))

        }
    }


}