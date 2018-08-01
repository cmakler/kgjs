/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface MathboxAxisDefinition extends MathboxObjectDefinition {
        scale: any;
        intercept?: any;
        ticks?: any;
        label?: string;
    }

    export class MathboxAxis extends MathboxObject {

        private intercept: any;
        public ticks;
        public label;

        constructor(def: AxisDefinition) {

            setDefaults(def, {
                ticks: 5,
                intercept: 0
            });

            setProperties(def,'constants',['orient']);
            setProperties(def, 'updatables',['ticks', 'intercept', 'label','min','max','otherMin','otherMax']);

            super(def);

        }

        redraw() {
            let view = this.mathbox.view;
            var xAxis = view.axis({axis: 3, width: 8, detail: 40, color: "black"});
            var xScale = view.scale({axis: 3, divide: 10, nice: true, zero: true});
            var xTicks = view.ticks({width: 5, size: 15, color: "black", zBias: 2});
            var xFormat = view.format({digits: 2, font: "KaTeX_Main", style: "normal", source: xScale});
            var xTicksLabel = view.label({color: "black", zIndex: 1, offset: [0, 0], points: xScale, text: xFormat});
            return this;
        }

    }

}

