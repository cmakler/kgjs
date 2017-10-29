/// <reference path="../kg.ts" />

module KGAuthor {

    import setDefaults = KG.setDefaults;

    export interface AxisDefinition {
        min: any;
        max: any;
        title: string;
        orient: string;
    }

    export interface PositionedObjectDefinition {
        position: {
            x: any;
            y: any;
            width: any;
            height: any;
        }
        xAxis?: AxisDefinition,
        yAxis?: AxisDefinition,

    }

    export interface GraphDefinition extends PositionedObjectDefinition {
        objects: KG.TypeAndDef[]
    }

    export class PositionedObject extends AuthoringObject {
        public xScale;
        public yScale;

        constructor(def) {

            KG.setDefaults(def, {xAxis: {}, yAxis: {}});
            KG.setDefaults(def.xAxis, {min: 0, max: 10, title: '', orient: 'bottom'});
            KG.setDefaults(def.yAxis, {min: 0, max: 10, title: '', orient: 'left'});

            super(def);

            const po = this;
            po.xScale = new Scale({
                "name": KG.randomString(10),
                "axis": "x",
                "domainMin": def.xAxis.min,
                "domainMax": def.xAxis.max,
                "rangeMin": def.position.x,
                "rangeMax": addDefs(def.position.x, def.position.width)
            });

            po.yScale = new Scale({
                "name": KG.randomString(10),
                "axis": "y",
                "domainMin": def.yAxis.min,
                "domainMax": def.yAxis.max,
                "rangeMin": addDefs(def.position.y, def.position.height),
                "rangeMax": def.position.y
            });

            po.subObjects = [po.xScale, po.yScale];
        }

    }

    export class GeoGebraContainer extends PositionedObject {

        constructor(def) {
            def.xAxis = {min: 0, max: 1};
            def.yAxis = {min: 0, max: 1};
            super(def);
            const ggb = this;
            def.xScaleName = ggb.xScale.name;
            def.yScaleName = ggb.yScale.name;
            ggb.subObjects.push(new GeoGebraApplet(def, ggb));
        }
    }

    export class Graph extends PositionedObject {

        public clipPath;

        constructor(def) {
            super(def);

            const g = this;
            g.clipPath = new ClipPath({
                "name": KG.randomString(10),
                "paths": [new Rectangle({
                    x1: def.xAxis.min,
                    x2: def.xAxis.max,
                    y1: def.yAxis.min,
                    y2: def.yAxis.max,
                    inClipPath: true
                }, g)]
            }, g);
            g.subObjects.push(g.clipPath);
            g.def.objects.unshift({
                type: 'Axis',
                def: this.def.xAxis
            });
            g.def.objects.unshift({
                type: 'Axis',
                def: this.def.yAxis
            });
            g.def.objects.forEach(function (obj) {
                g.subObjects.push(new KGAuthor[obj.type](obj.def, g))
            });

            console.log(g);

        }
    }

    export interface GraphObjectGeneratorDefinition extends AuthoringObjectDefinition {

    }

    export class GraphObjectGenerator extends AuthoringObject {

        public def: any;
        public subObjects: AuthoringObject[];

        constructor(def, graph?: Graph) {
            super(def);
            if (graph) {
                this.def.xScaleName = graph.xScale.name;
                this.def.yScaleName = graph.yScale.name;
                if (!def.inClipPath) {
                    this.def.clipPathName = def.clipPathName || graph.clipPath.name;
                }

            }
            this.subObjects = [];
        }

        extractCoordinates(coordinatesKey?, xKey?, yKey?) {
            coordinatesKey = coordinatesKey || 'coordinates';
            xKey = xKey || 'x';
            yKey = yKey || 'y';
            let obj = this,
                def = this.def;
            if (def.hasOwnProperty(coordinatesKey) && def[coordinatesKey] != undefined) {
                def[xKey] = def[coordinatesKey][0].toString();
                def[yKey] = def[coordinatesKey][1].toString();
                obj[xKey] = def[coordinatesKey][0].toString();
                obj[yKey] = def[coordinatesKey][1].toString();
                delete def[coordinatesKey];
            }
        }
    }

    export interface GraphObjectDefinition extends GraphObjectGeneratorDefinition {
        type?: string;
        layer?: number;
        color?: string;
        fill?: string;
        opacity?: string;
        stroke?: string;
        strokeWidth?: string;
        strokeOpacity?: string;
        lineStyle?: string;
        drag?: any;
        click?: any;
    }

    export class GraphObject extends GraphObjectGenerator {

        public type: string;
        public layer: number;

        parseSelf(parsedData: KG.ViewDefinition) {
            parsedData.layers[this.layer].push(this);
            return parsedData;
        }
    }

    export class ClipPath extends GraphObjectGenerator {

        constructor(def, graph) {
            def.inClipPath = true;
            super(def, graph);
        }

        parseSelf(parsedData: KG.ViewDefinition) {
            delete this.def.clipPathName;
            parsedData.clipPaths.push(this.def);
            return parsedData;
        }
    }

    export class Scale extends AuthoringObject {

        public min;
        public max;

        constructor(def) {
            super(def);
            this.min = def.domainMin;
            this.max = def.domainMax;
        }

        parseSelf(parsedData: KG.ViewDefinition) {
            parsedData.scales.push(this.def);
            return parsedData;
        }

    }

}