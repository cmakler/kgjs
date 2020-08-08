/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface MathboxLineDefinition extends MathboxObjectDefinition {
        x1: any;
        y1: any;
        z1: any;
        x2: any;
        y2: any;
        z2: any;
    }

    export class MathboxLine extends MathboxObject {

        public pointData: any;
        public x1: number;
        public y1: number;
        public z1: number;
        public x2: number;
        public y2: number;
        public z2: number;

        constructor(def: MathboxPointDefinition) {

            setDefaults(def, {
                x1: 0,
                y1: 0,
                z1: 0,
                x2: 0,
                y2: 0,
                z2: 0,
                lineStyle: "solid"
            });

            setProperties(def, 'updatables', ['x1', 'y1', 'z1', 'x2', 'y2', 'z2']);

            super(def);

        }

        draw() {
            let p = this;
            p.pointData = p.mathbox.mathboxView.array({
                width: 2,
                channels: 3
            });

            p.mo = p.mathbox.mathboxView.line({
                points: p.pointData,
                zIndex: 4
            });
            return p;
        }

        redraw() {
            let p = this;
            console.log(p);
            p.pointData.set("data", [[p.y1, p.z1, p.x1],[p.y2, p.z2, p.x2]]);
            p.mo.set("color", p.stroke);
            p.mo.set("stroke", p.lineStyle);
            p.mo.set("width", p.strokeWidth);
            return p;
        }

    }

}

