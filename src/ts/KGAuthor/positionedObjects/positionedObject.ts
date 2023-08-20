/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface AxisDefinition {
        min: any;
        max: any;
        title: string;
        orient: string;
        log: boolean;
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
        yAxis?: AxisDefinition
    }

    export class PositionedObject extends AuthoringObject {
        public xScale;
        public yScale;

        constructor(def) {

            KG.setDefaults(def, {xAxis: {}, yAxis: {}});
            KG.setDefaults(def.xAxis, {min: 0, max: 10, intercept: 0, title: '', orient: 'bottom'});
            KG.setDefaults(def.yAxis, {min: 0, max: 10, intercept: 0, title: '', orient: 'left'});

            super(def);

            const po = this,
                xMin = def.xAxis.min,
                xMax = def.xAxis.max,
                xIntercept = def.xAxis.intercept,
                xLog = def.xAxis.log,
                yMin = def.yAxis.min,
                yMax = def.yAxis.max,
                yIntercept = def.yAxis.intercept,
                yLog = def.yAxis.log,
                leftEdge = def.position.x,
                rightEdge = addDefs(def.position.x, def.position.width),
                bottomEdge = addDefs(def.position.y, def.position.height),
                topEdge = def.position.y;

            po.xScale = new Scale({
                "name": KG.randomString(10),
                "axis": "x",
                "domainMin": xMin,
                "domainMax": xMax,
                "rangeMin": leftEdge,
                "rangeMax": rightEdge,
                "log": xLog,
                "intercept": xIntercept
            });

            po.yScale = new Scale({
                "name": KG.randomString(10),
                "axis": "y",
                "domainMin": yMin,
                "domainMax": yMax,
                "rangeMin": bottomEdge,
                "rangeMax": topEdge,
                "log": yLog,
                "intercept": yIntercept
            });

            po.subObjects = [po.xScale, po.yScale];

            if(po.def.hasOwnProperty('objects')) {
                po.def.objects.map(KGAuthor.extractTypeAndDef);
            }

        }

    }

}