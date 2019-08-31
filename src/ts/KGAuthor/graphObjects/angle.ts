/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface AngleMarkerLabelDefinition extends LabelDefinition {
        radians?: boolean;
    }

    export interface AngleMarkerDefinition extends CurveDefinition {
        coordinates?: any[];
        measure?: any;
        start?: any;
        end?: any;
        r?: any;
        radians?: boolean;
        label?: LabelDefinition
    }

    export class AngleMarker extends Curve {

        public measureDegrees;
        public measureRadians;

        constructor(def: AngleMarkerDefinition, graph) {

            KG.setDefaults(def, {
                name: 'angle',
                color: 'colors.grey',
                coordinates: [0, 0],
                radians: false,
                start: 0,
                r: multiplyDefs(0.05, subtractDefs(graph.def.xAxis.max, graph.def.xAxis.min)),
                strokeWidth: 0.75
            });

            def = setStrokeColor(def);

            if (def.hasOwnProperty("measure")) {
                def.end = addDefs(def.start, def.measure)
            } else {
                def.measure = subtractDefs(def.end, def.start)
            }

            // convert to radians unless already radians
            let start = def.radians ? def.start : multiplyDefs(def.start, 0.01745329252),
                measure = def.radians ? def.measure : multiplyDefs(def.measure, 0.01745329252),
                end = def.radians ? def.end : multiplyDefs(def.end, 0.01745329252),
                mid = addDefs(start, multiplyDefs(0.5, measure));


            def.parametricFunction = {
                xFunction: addDefs(def.coordinates[0], multiplyDefs(def.r, "cos(t)")),
                yFunction: addDefs(def.coordinates[1], multiplyDefs(def.r, "sin(t)")),
                min: start,
                max: end
            };

            super(def, graph);

            let dm = this;

            dm.measureDegrees = def.radians ? multiplyDefs(def.measure, 57.2957795131) : def.measure;
            dm.measureRadians = divideDefs(measure, Math.PI);

            let labelDef = KG.setDefaults(def.label || {}, {
                x: addDefs(def.coordinates[0], multiplyDefs(multiplyDefs(1.7, def.r), `cos(${mid})`)),
                y: addDefs(def.coordinates[1], multiplyDefs(multiplyDefs(1.7, def.r), `sin(${mid})`)),
                fontSize: 8,
                color: def.stroke,
                bgcolor: "none",
                radians: false,
                show: def.show
            });

            const labelTextRadians = "`${calcs." + dm.name + ".measureRadians.toFixed(2)}\\\\pi`",
                labelTextDegrees = "`${calcs." + dm.name + ".measureDegrees.toFixed(0)}^{\\\\circ}`";

            labelDef.text = labelDef.hasOwnProperty('text') ? def.label.text : labelDef.radians ? labelTextRadians : labelTextDegrees;

            dm.subObjects.push(new Label(labelDef, graph))

        }

        parseSelf(parsedData) {
            let dm = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[dm.name] = {
                measureDegrees: dm.measureDegrees.toString(),
                measureRadians: dm.measureRadians.toString()
            };

            return parsedData;
        }


    }

    export interface AngleDefinition extends AngleMarkerDefinition {
        pointA: PointDefinition;
        pointB: PointDefinition;
        pointC: PointDefinition;
        showSegments: boolean;
    }

    export class Angle extends AngleMarker {

        constructor(def: AngleDefinition, graph) {

            const A = new Point(def.pointA, graph),
                B = new Point(def.pointB, graph),
                C = new Point(def.pointC, graph);

            def.start = `atan2(${A.y} - ${B.y},${A.x} - ${B.x})`;
            def.end = `atan2(${C.y} - ${B.y},${C.x} - ${B.x})`;
            def.coordinates = [B.x,B.y];
            def.radians = true;

            KG.setDefaults(def,{
                label: {
                    radians: false
                }
            });

            super(def, graph);

            let a = this;

            a.subObjects.push(A);
            a.subObjects.push(B);
            a.subObjects.push(C);

            if (def.showSegments) {
                let ABdef = copyJSON(def),
                    CBdef = copyJSON(def);

                ABdef.a = [B.x,B.y];
                ABdef.b = [A.x,A.y];
                delete ABdef.label;
                a.subObjects.push(new Segment(ABdef, graph));

                CBdef.a = [B.x,B.y];
                CBdef.b = [C.x,C.y];
                delete CBdef.label;
                a.subObjects.push(new Segment(CBdef, graph));
            }

        }
    }

}