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
            g.subObjects = this.def.objects.map(function(obj) {
                return new KGAuthor[obj.type](obj.def, g)
            });

        }

        parse_self(parsedData: KG.ViewDefinition) {

            const graph = this,
                xAxis = graph.def.xAxis,
                xScale = graph.xScaleName,
                yAxis = graph.def.yAxis,
                yScale = graph.yScaleName,
                clipPath = graph.clipPathName;

            parsedData.scales.push({
                "name": xScale,
                "axis": "x",
                "domainMin": xAxis.domain[0],
                "domainMax": xAxis.domain[1],
                "rangeMin": xAxis.range[0],
                "rangeMax": xAxis.range[1]
            });

            parsedData.scales.push({
                "name": yScale,
                "axis": "y",
                "domainMin": yAxis.domain[0],
                "domainMax": yAxis.domain[1],
                "rangeMin": yAxis.range[0],
                "rangeMax": yAxis.range[1]
            });

            parsedData.clipPaths.push({
                "name": clipPath,
                "xScaleName": xScale,
                "yScaleName": yScale
            });

            return parsedData;
        }
    }

    export class GraphObjectGenerator extends AuthoringObject {

        public def: any;
        public subObjects: AuthoringObject[];

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
            parsedData.layers[this.layer].push({"type": this.type, "def": this.def});
            return parsedData;
        }
    }

}