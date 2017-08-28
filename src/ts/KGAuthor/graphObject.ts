/// <reference path="../kg.ts" />

module KGAuthor {

    export class GraphObjectGenerator extends AuthoringObject {

        public def: any;
        public subObjects: GraphObject[];

        constructor(def, graph: Graph) {
            super(def);
            this.def.xScaleName = graph.xScaleName;
            this.def.yScaleName = graph.yScaleName;
            this.def.clipPathName = graph.clipPathName;
            this.subObjects = [];
        }

        extractCoordinates(coordinatesKey?, xKey?, yKey?) {
            coordinatesKey = coordinatesKey || 'coordinates';
            xKey = xKey || 'x';
            yKey = yKey || 'y';
            let def = this.def;
            console.log(def);
            if (def.hasOwnProperty(coordinatesKey)) {
                def[xKey] = def[coordinatesKey][0].toString();
                def[yKey] = def[coordinatesKey][1].toString();
                delete def[coordinatesKey];
            }
            console.log(def);
        }
    }

    export class GraphObject extends GraphObjectGenerator {

        public type: string;
        public layer: number;

        parse_self(parsedData: KG.ViewDefinition) {
            parsedData.layers[this.layer].push({"type": this.type, "def": this.def});
            return parsedData;
        }
    }


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
            this.layer = 1;
        }

    }

    export class Label extends GraphObject {

        parse_self(parsedData: KG.ViewDefinition) {
            parsedData.divs.push({"type": "Label", "def": this.def});
            return parsedData;
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
                let labelDef = _.defaults(def, {
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