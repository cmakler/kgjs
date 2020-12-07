/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface MathboxAxisDefinition extends MathboxObjectDefinition {
        axisNumber?: number;
        ticks?: number;
        min: any;
        max: any;
        label?: string;
    }

    export class MathboxAxis extends MathboxObject {

        private intercept: any;
        public ticks;
        public label;
        public min;
        public max;

        constructor(def: MathboxAxisDefinition) {

            setDefaults(def, {
                ticks: 5,
                min: 0,
                max: 10
            });
            setProperties(def,'constants',['axisNumber', 'ticks']);
            setProperties(def, 'updatables',['ticks', 'label','min','max']);
            super(def);

        }

        redraw() {
            const a = this;
            let view = a.mathbox.mathboxView;
            if(view == undefined) {
                return a;
            }
            view.set("range", [[a.mathbox.yAxis.min, a.mathbox.yAxis.max], [a.mathbox.zAxis.min, a.mathbox.zAxis.max], [a.mathbox.xAxis.min, a.mathbox.xAxis.max]]);
            let axis = view.axis({axis: a.axisNumber, width: 8, detail: 40, color: "black"});
            let scale = view.scale({axis: a.axisNumber, divide: a.ticks, nice: false, zero: true});
            let ticks = view.ticks({width: 5, size: 5, color: "gray", zBias: 2});
            let format = view.format({digits: 2, classes: ["tick"], style: "normal", source: scale});
            let ticklabel = view.label({color: "gray", zIndex: 1, offset: [0, 0], points: scale, text: format, size: 10});
            return a;
        }

    }

    export class MathboxXAxis extends MathboxAxis {

        constructor(def) {
            def.axisNumber = 3;
            super(def);
            let xAxis = this;
            xAxis.mathbox.xAxis = xAxis;
        }

    }

    export class MathboxYAxis extends MathboxAxis {

        constructor(def) {
            def.axisNumber = 1;
            super(def);
            let yAxis = this;
            yAxis.mathbox.yAxis = yAxis;
        }

    }

    export class MathboxZAxis extends MathboxAxis {

        constructor(def) {
            def.axisNumber = 2;
            super(def);
            let zAxis = this;
            zAxis.mathbox.zAxis = zAxis;
        }

    }

}

