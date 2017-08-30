/// <reference path="../kg.ts" />

module KGAuthor {

    export interface AxisDefinition {
        domain: any[]
        range: any[]
        title: string;
        orient: string;
    }

    export interface GraphDefinition {
        xAxis: AxisDefinition,
        yAxis: AxisDefinition,
        objects: KG.TypeAndDef[]
    }

    export class Graph extends AuthoringObject {

        public xScaleName;
        public yScaleName;
        public clipPathName;

        constructor(def) {
            super(def);

            const g = this;
            g.xScaleName = KG.randomString(10);
            g.yScaleName = KG.randomString(10);
            g.clipPathName = KG.randomString(10);
            g.def.xAxis.range = def.xAxis.range || [0, 1];
            g.def.yAxis.range = def.yAxis.range || [1, 0];

            g.def.objects.push({
                type: 'Axis',
                def: this.def.xAxis
            });
            g.def.objects.push({
                type: 'Axis',
                def: this.def.yAxis
            });
            g.subObjects = this.def.objects.map(function (obj) {
                return new KGAuthor[obj.type](obj.def, g)
            });
            g.subObjects.push(new Scale({
                "name": g.xScaleName,
                "axis": "x",
                "domainMin": def.xAxis.domain[0],
                "domainMax": def.xAxis.domain[1],
                "rangeMin": def.xAxis.range[0],
                "rangeMax": def.xAxis.range[1]
            }));
            g.subObjects.push(new Scale({
                "name": g.yScaleName,
                "axis": "y",
                "domainMin": def.yAxis.domain[0],
                "domainMax": def.yAxis.domain[1],
                "rangeMin": def.yAxis.range[0],
                "rangeMax": def.yAxis.range[1]
            }));
            g.subObjects.push(new ClipPath({
                "name": g.clipPathName,
                "paths": [new Rectangle({
                    x1: def.xAxis.domain[0],
                    x2: def.xAxis.domain[1],
                    y1: def.yAxis.domain[0],
                    y2: def.yAxis.domain[1],
                    inClipPath: true
                }, g)]
            }, g))

        }
    }

    export class GraphObjectGenerator extends AuthoringObject {

        public def: any;
        public subObjects: AuthoringObject[];

        constructor(def, graph?: Graph) {
            super(def);
            if (graph) {
                this.def.xScaleName = graph.xScaleName;
                this.def.yScaleName = graph.yScaleName;
                this.def.clipPathName = def.clipPathName || graph.clipPathName;
            }
            this.subObjects = [];
        }

        extractCoordinates(coordinatesKey?, xKey?, yKey?) {
            coordinatesKey = coordinatesKey || 'coordinates';
            xKey = xKey || 'x';
            yKey = yKey || 'y';
            let def = this.def;
            if (def.hasOwnProperty(coordinatesKey)) {
                def[xKey] = def[coordinatesKey][0].toString();
                def[yKey] = def[coordinatesKey][1].toString();
                delete def[coordinatesKey];
            }
        }
    }

    export class GraphObject extends GraphObjectGenerator {

        public type: string;
        public layer: number;

        parse_self(parsedData: KG.ViewDefinition) {
            parsedData.layers[this.layer].push(this);
            return parsedData;
        }
    }

    export class ClipPath extends GraphObjectGenerator {

        parse_self(parsedData: KG.ViewDefinition) {
            delete this.def.clipPathName;
            parsedData.clipPaths.push(this.def);
            return parsedData;
        }
    }

    export class Scale extends AuthoringObject {

        parse_self(parsedData: KG.ViewDefinition) {
            parsedData.scales.push(this.def);
            return parsedData;
        }

    }

}