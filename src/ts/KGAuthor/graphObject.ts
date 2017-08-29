/// <reference path="../kg.ts" />

module KGAuthor {

    export class Axis extends GraphObject {

        constructor(def, graph) {
            super(def, graph);
            this.type = 'Axis';
            this.layer = 2;
        }

    }

    export class Curve extends GraphObject {

        constructor(def, graph) {
            if(def.hasOwnProperty('univariateFunctions')) {
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
                    fontSize: 8,
                    xPixelOffset: 5,
                    yPixelOffset: -15
                });
                p.subObjects.push(new Label(labelDef, graph));
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

}