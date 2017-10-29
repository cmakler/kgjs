/// <reference path="../kg.ts" />

module KGAuthor {

    import setDefaults = KG.setDefaults;

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
                        xPixelOffset: -40,
                        rotate: 90
                    }, graph))
                }
                else if (def.orient == 'top') {
                    a.subObjects.push(new Label({
                        text: `\\text{${def.title}}`,
                        x: averageDefs(graph.xScale.min,graph.xScale.max),
                        y: graph.yScale.max,
                        yPixelOffset: 40
                    }, graph))
                } else {
                    a.subObjects.push(new Label({
                        text: `\\text{${def.title}}`,
                        x: graph.xScale.max,
                        y: averageDefs(graph.yScale.min,graph.yScale.max),
                        xPixelOffset: 40,
                        rotate: 270
                    }, graph));
                }
            }
        }

    }

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
                let gxDef = JSON.parse(JSON.stringify(def)),
                    gyDef = JSON.parse(JSON.stringify(def));
                gxDef.a = [x, graph.yScale.min];
                gxDef.b = [x, graph.yScale.max];
                gyDef.a = [graph.xScale.min, y];
                gyDef.b = [graph.xScale.max, y];
                g.subObjects.push(new Segment(gxDef, graph));
                g.subObjects.push(new Segment(gyDef, graph));
            }

        }
    }

    export class Curve extends GraphObject {

        constructor(def, graph) {
            def = setStrokeColor(def);
            if (def.hasOwnProperty('univariateFunctions')) {
                delete def.univariateFunctions;
            }
            super(def, graph);
            this.type = 'Curve';
            this.layer = def.layer || 1;
        }

    }

    export interface PointDefinition extends GraphObjectDefinition {
        label?: LabelDefinition;
        x?: any;
        y?: any;
        coordinates?: any[];
        droplines?: { horizontal?: string; vertical?: string };
        r?: any;
    }

    export class Point extends GraphObject {

        public x;
        public y;

        constructor(def: PointDefinition, graph) {

            def = setFillColor(def);

            super(def, graph);

            const p = this;
            p.type = 'Point';
            p.layer = 3;
            p.extractCoordinates();

            if (def.hasOwnProperty('label')) {
                let labelDef = JSON.parse(JSON.stringify(def));
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 10,
                    position: 'bl',
                    color: def.color
                });
                p.subObjects.push(new Label(labelDef, graph));
            }

            if (def.hasOwnProperty('droplines')) {
                if (def.droplines.hasOwnProperty('vertical')) {
                    let verticalDroplineDef = JSON.parse(JSON.stringify(def));
                    verticalDroplineDef.stroke = def.fill;
                    p.subObjects.push(new VerticalDropline(verticalDroplineDef, graph));

                    let xAxisLabelDef = JSON.parse(JSON.stringify(def));
                    xAxisLabelDef.y = 'AXIS';
                    KG.setDefaults(xAxisLabelDef, {
                        text: def.droplines.vertical,
                        fontSize: 10
                    });
                    p.subObjects.push(new Label(xAxisLabelDef, graph));
                }
                if (def.droplines.hasOwnProperty('horizontal')) {
                    let horizontalDroplineDef = JSON.parse(JSON.stringify(def));
                    horizontalDroplineDef.stroke = def.fill;
                    p.subObjects.push(new HorizontalDropline(horizontalDroplineDef, graph));

                    let yAxisLabelDef = JSON.parse(JSON.stringify(def));
                    yAxisLabelDef.x = 'AXIS';
                    KG.setDefaults(yAxisLabelDef, {
                        text: def.droplines.horizontal,
                        fontSize: 10
                    });
                    p.subObjects.push(new Label(yAxisLabelDef, graph));
                }
            }

        }

    }


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

    export class Dropline extends Segment {

        constructor(def, graph) {
            def.lineStyle = 'dotted';
            super(def, graph);
        }

    }

    export class VerticalDropline extends Dropline {

        constructor(def, graph) {
            def.a = [def.x, graph.yScale.min];
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
            def.a = [graph.xScale.min, def.y];
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

    export class Rectangle extends GraphObject {

        constructor(def, graph) {
            super(def, graph);
            this.type = 'Rectangle';
            this.layer = def.layer || 0;
            this.extractCoordinates('a', 'x1', 'y1');
            this.extractCoordinates('b', 'x2', 'y2');
        }

    }

    export class Area extends GraphObject {

        constructor(def, graph) {
            if (def.hasOwnProperty('univariateFunctions')) {
                delete def.univariateFunctions;
            }
            super(def, graph);
            this.type = 'Area';
            this.layer = def.layer || 0;
        }

    }

}