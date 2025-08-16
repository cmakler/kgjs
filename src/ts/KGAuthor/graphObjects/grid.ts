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
                yStep: 1,
                xGridlines: 10,
                yGridlines: 10
            });
            const g = this;
            g.subObjects = [];

            // Create vertical gridlines
            for (let i = 0; i < def.xGridlines; i++) {
                const x = multiplyDefs(i, def.xStep);
                let gxDef = copyJSON(def),
                    gyDef = copyJSON(def);
                gxDef.a = [x, graph.yScale.min];
                gxDef.b = [x, graph.yScale.max];
                g.subObjects.push(new Segment(gxDef, graph));
            }

            // Create horizontal gridlines
            for (let i = 0; i < def.yGridlines; i++) {
                const y = multiplyDefs(i, def.yStep);
                let gxDef = copyJSON(def),
                    gyDef = copyJSON(def);
                gyDef.a = [graph.xScale.min, y];
                gyDef.b = [graph.xScale.max, y];
                g.subObjects.push(new Segment(gyDef, graph));
            }

        }
    }

}