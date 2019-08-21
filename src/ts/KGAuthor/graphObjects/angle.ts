/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface DegreeMarkerDefinition extends CurveDefinition {
        point?: any[];
        measure?: any;
        start?: any;
        end?: any;
        r?: any;
        radians?: boolean;
        showLabel?: any;
        labelRadians?: boolean;
    }

    export class DegreeMarker extends Curve {

        constructor(def: DegreeMarkerDefinition, graph) {

            KG.setDefaults(def,{
                color: 'colors.grey',
                point: [0,0],
                radians: false,
                start: 0,
                r: multiplyDefs(0.05,subtractDefs(graph.def.xAxis.max,graph.def.xAxis.min)),
                showLabel: true,
                strokeWidth: 0.75
            });

            def = setStrokeColor(def);

            if(def.hasOwnProperty("measure")) {
                def.end = addDefs(def.start, def.measure)
            } else {
                def.measure = subtractDefs(def.end, def.start)
            }

            // convert to radians unless already radians
            let start = def.radians ? def.start : multiplyDefs(def.start,0.01745329252),
                measure = def.radians ? def.measure :  multiplyDefs(def.measure,0.01745329252),
                end = def.radians ? def.end :  multiplyDefs(def.end,0.01745329252),
                mid = addDefs(start, multiplyDefs(0.5,measure));


            def.parametricFunction = {
                xFunction: addDefs(def.point[0], multiplyDefs(def.r, "cos(t)")),
                yFunction: addDefs(def.point[1], multiplyDefs(def.r, "sin(t)")),
                min: start,
                max: end
            };

            super(def, graph);

            let dm = this;

            const measureDegrees = def.radians ? multiplyDefs(def.measure, 57.2957795131) : def.measure,
                labelTextRadians = "`${(" + divideDefs(measure, Math.PI) + ").toFixed(2)}\\\\pi`",
                labelTextDegrees = "`${(" + measureDegrees + ").toFixed(0)}^{\\\\circ}`";

            dm.subObjects.push(new Label({
                text: def.labelRadians ? labelTextRadians : labelTextDegrees,
                x: addDefs(def.point[0], multiplyDefs(multiplyDefs(1.7,def.r), `cos(${mid})`)),
                y: addDefs(def.point[1], multiplyDefs(multiplyDefs(1.7,def.r), `sin(${mid})`)),
                fontSize: 8,
                bgcolor: "none",
                show: def.showLabel
            },graph))

        }

    }

    export interface AngleDefinition extends DegreeMarkerDefinition {
        A: any[];
        B: any[];
        C: any[];
        showSegments: boolean;
        showPoints: boolean;
    }

    export class Angle extends DegreeMarker {

        constructor(def: AngleDefinition, graph) {

            def.start = `atan2(${def.A[1]}-${def.B[1]},${def.A[0]}-${def.B[0]})`;
            def.end = `atan2(${def.C[1]}-${def.B[1]},${def.C[0]}-${def.B[0]})`;
            def.point = def.B;

            super(def,graph);

            let a = this;

            if(def.showSegments) {
                
            }

        }
    }

}