/// <reference path="../kg.ts" />

module KGAuthor {

    export interface AxisDefinition {
        domain: any[]
        range: any[]
        title: string;
        orient: string;
    }

    export interface GraphObjectDefinition {
        type: string;
        def: any;
    }

    export interface GraphDefinition {
        xAxis: AxisDefinition,
        yAxis: AxisDefinition,
        objects: GraphObjectDefinition[]
    }

    export class Graph extends AuthoringObject {

        public xScaleName;
        public yScaleName;
        public clipPathName;

        constructor(def) {
            super(def);
            this.xScaleName = KG.randomString(10);
            this.yScaleName = KG.randomString(10);
            this.clipPathName = KG.randomString(10);
            this.def.xAxis.range = def.xAxis.range || [0, 1];
            this.def.yAxis.range = def.yAxis.range || [1, 0];
            this.def.objects.push({
                type: 'Axis',
                def: this.def.xAxis
            });
            this.def.objects.push({
                type: 'Axis',
                def: this.def.yAxis
            });

        }

        parse(parsedData: KG.ViewDefinition) {

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

            this.def.objects.forEach(function (obj) {
                parsedData = new KGAuthor[obj.type](obj.def, graph).parse(parsedData);
            });

            return parsedData;
        }
    }

}