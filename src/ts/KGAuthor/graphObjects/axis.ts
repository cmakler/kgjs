/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Axis extends GraphObject {

        constructor(def, graph) {
            super(def, graph);
            let a = this;
            a.type = 'Axis';
            a.layer = 2;

            if (def.hasOwnProperty('title')) {
                if (def.orient == 'bottom') {
                    a.subObjects.push(new Label({
                        text: `\\text{${def.title}}`,
                        x: averageDefs(graph.xScale.min,graph.xScale.max),
                        y: graph.yScale.min,
                        yPixelOffset: -40
                    }, graph))
                }

                else if (def.orient == 'left') {
                    a.subObjects.push(new Label({
                        text: `\\text{${def.title}}`,
                        x: graph.xScale.min,
                        y: averageDefs(graph.yScale.min,graph.yScale.max),
                        xPixelOffset: -50,
                        rotate: 90
                    }, graph))
                }
                else if (def.orient == 'top') {
                    a.subObjects.push(new Label({
                        text: `\\text{${def.title}}`,
                        x: averageDefs(graph.xScale.min,graph.xScale.max),
                        y: graph.yScale.min,
                        yPixelOffset: 40
                    }, graph))
                } else {
                    a.subObjects.push(new Label({
                        text: `\\text{${def.title}}`,
                        x: graph.xScale.min,
                        y: averageDefs(graph.yScale.min,graph.yScale.max),
                        xPixelOffset: 50,
                        rotate: 270
                    }, graph));
                }
            }
        }

    }

}