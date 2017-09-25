/// <reference path="../kg.ts" />

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
                        x: 0.5 * (graph.xScale.min + graph.xScale.max),
                        y: graph.yScale.min,
                        yPixelOffset: -40
                    }, graph))
                }

                else if (def.orient == 'left') {
                    a.subObjects.push(new Label({
                        text: `\\text{${def.title}}`,
                        x: graph.xScale.min,
                        y: 0.5 * (graph.yScale.min + graph.yScale.max),
                        xPixelOffset: -40,
                        rotate: 90
                    }, graph))
                }
                else if (def.orient == 'top') {
                    a.subObjects.push(new Label({
                        text: `\\text{${def.title}}`,
                        x: 0.5 * (graph.xScale.min + graph.xScale.max),
                        y: graph.yScale.max,
                        yPixelOffset: 40
                    }, graph))
                } else {
                    a.subObjects.push(new Label({
                        text: `\\text{${def.title}}`,
                        x: graph.xScale.max,
                        y: 0.5 * (graph.yScale.min + graph.yScale.max),
                        xPixelOffset: 40,
                        rotate: 270
                    }, graph));
                }
            }
        }

    }

    export class Curve extends GraphObject {

        constructor(def, graph) {
            if (def.hasOwnProperty('univariateFunctions')) {
                delete def.univariateFunctions;
            }
            super(def, graph);
            this.type = 'Curve';
            this.layer = def.layer || 1;
        }

    }

    export class Point extends GraphObject {

        constructor(def, graph) {
            super(def, graph);

            const p = this;
            p.type = 'Point';
            p.layer = 3;
            p.extractCoordinates();

            if (def.hasOwnProperty('label')) {
                let labelDef = JSON.parse(JSON.stringify(def));
                delete labelDef.label;
                KG.setDefaults(labelDef, {
                    text: def.label.text,
                    fontSize: 10,
                    xPixelOffset: 2,
                    yPixelOffset: 2,
                    align: 'left',
                    valign: 'bottom'
                });
                p.subObjects.push(new Label(labelDef, graph));
            }

            if(def.hasOwnProperty('droplines')) {
                if(def.droplines.hasOwnProperty('vertical')) {
                    let verticalDroplineDef = JSON.parse(JSON.stringify(def));
                    p.subObjects.push(new VerticalDropline(verticalDroplineDef, graph));
                }
                if(def.droplines.hasOwnProperty('horizontal')) {
                    let horizontalDroplineDef = JSON.parse(JSON.stringify(def));
                    p.subObjects.push(new HorizontalDropline(horizontalDroplineDef, graph));
                }
            }
            
        }

    }



    export class Segment extends GraphObject {

        constructor(def, graph) {
            super(def, graph);
            const s = this;
            s.type = 'Segment';
            s.layer = 1;
            s.extractCoordinates('a', 'x1', 'y1');
            s.extractCoordinates('b', 'x2', 'y2');
        }

    }

    export class Dropline extends Segment {

        constructor(def, graph) {
            def.stroke = 'blue';
            super(def, graph);
        }

    }

    export class VerticalDropline extends Dropline {

        constructor(def, graph) {
            def.a = [def.x, def.y];
            def.b = [def.x, graph.yScale.min];
            super(def, graph);
        }
    }

    export class HorizontalDropline extends Dropline {

        constructor(def, graph) {
            def.a = [def.x, def.y];
            def.b = [graph.xScale.min, def.y];
            super(def, graph);
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