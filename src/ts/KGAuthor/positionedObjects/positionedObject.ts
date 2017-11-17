/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface AxisDefinition {
        min: any;
        max: any;
        title: string;
        orient: string;
    }

    export class Scale extends AuthoringObject {

        public min;
        public max;
        public intercept;

        constructor(def) {
            KG.setDefaults(def, {
                intercept: 0
            });
            super(def);
            this.min = def.domainMin;
            this.max = def.domainMax;
            this.intercept = def.intercept;
        }

        parseSelf(parsedData: KG.ViewDefinition) {
            parsedData.scales.push(this.def);
            return parsedData;
        }

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

}