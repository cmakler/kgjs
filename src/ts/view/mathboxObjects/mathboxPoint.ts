/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface MathboxPointDefinition extends MathboxObjectDefinition {
        x: any;
        y: any;
        z: any;
    }

    export class MathboxPoint extends MathboxObject {

        public pointData: any;
        public x: number;
        public y: number;
        public z: number;

        constructor(def: MathboxPointDefinition) {

            setDefaults(def, {
                x: 0,
                y: 0,
                z: 0
            });

            setProperties(def, 'updatables', ['x', 'y', 'z']);

            super(def);

        }

        draw() {
            let p = this;
            p.pointData = p.mathbox.mathboxView.array({
                width: 1,
                channels: 3
            });

            p.mo = p.mathbox.mathboxView.point({
                size: 20,
                points: p.pointData,
                zIndex: 4
            });
            return p;
        }

        redraw() {
            let p = this;
            //console.log(p);
            p.pointData.set("data", [[p.y, p.z, p.x]]);
            p.mo.set("color", p.stroke);
            return p;
        }

    }

}

