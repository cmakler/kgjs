/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Grid extends GraphObjectGenerator {

        constructor(def, graph) {
            def = def || {};
            super(def, graph);
            KG.setDefaults(def, {
                strokeWidth: 1,
                stroke: 'lightgrey',
                lineStyle: 'dotted',
                layer: 0,
                xStep: 1,
                yStep: 1
            });
            const g = this;
            g.subObjects = [];
            for (let i = 0; i < 10; i++) {
                const x = multiplyDefs(i, def.xStep),
                    y = multiplyDefs(i, def.yStep);
                let gxDef = copyJSON(def),
                    gyDef = copyJSON(def);
                gxDef.a = [x, graph.yScale.min];
                gxDef.b = [x, graph.yScale.max];
                gyDef.a = [graph.xScale.min, y];
                gyDef.b = [graph.xScale.max, y];
                g.subObjects.push(new Segment(gxDef, graph));
                g.subObjects.push(new Segment(gyDef, graph));
            }

        }
    }

}