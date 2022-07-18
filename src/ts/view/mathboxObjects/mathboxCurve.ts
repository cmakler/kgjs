/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface MathboxCurveDefinition extends MathboxObjectDefinition {
        fn: UnivariateFunctionDefinition;
    }

    export class MathboxCurve extends MathboxObject {

        public curveData: any;
        private fn: UnivariateFunction;

        constructor(def: MathboxCurveDefinition) {
            setDefaults(def,{
                text: "#666666",
                strokeWidth: 10
            });
            super(def);
            def.fn = setDefaults(def.fn,{
                model: def.model,
                samplePoints: 100
            });
            this.fn = new UnivariateFunction(def.fn).update(true);
        }

        draw() {
            let c = this;
            c.curveData = c.mathbox.mathboxView.interval({
                axis: 1,
                channels: 3,
                width: c.fn.samplePoints
            });

            c.mo = c.mathbox.mathboxView.line({
                points: c.curveData,
                zIndex: 3
            });
            return c;
        }

        redraw() {
            let c = this;
            //console.log(c);
            c.curveData.set("expr", c.fn.mathboxFn(c.mathbox));
            c.mo.set("color", c.stroke);
            c.mo.set("width", c.strokeWidth);
            c.mo.set("stroke", c.lineStyle);
            return c;
        }

    }

    export class CurveThreeD extends MathboxCurve {

        constructor(def: MathboxCurveDefinition) {
            super(def);
        }

    }

}

