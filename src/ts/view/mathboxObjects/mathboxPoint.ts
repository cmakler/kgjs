/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface MathboxPointDefinition extends MathboxObjectDefinition {
        x: any;
        y: any;
        z: any;
    }

    export class MathboxPoint extends MathboxObject {

        private pointData: any;
        private pointObject: any;
        private x: number;
        private y: number;
        private z: number;

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
                width: 1, channels: 3,
                data: [[0, 0, 0]]
            });

            p.pointObject = p.mathbox.mathboxView.point({size: 20, color: "black", points: p.pointData, visible: true});
            return p;
        }

        redraw() {
            let p = this;
            console.log(p);
            p.pointData.set("data", [[p.y, p.z, p.x]]);
            return p;
        }

    }

}

