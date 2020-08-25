/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface MathboxPlaneDefinition extends MathboxSurfaceDefinition {
        x?: any;
        y?: any;
        z?: any;
    }

    export class MathboxPlane extends MathboxSurface {

        private x;
        private y;
        private z;
        private planeType;

        constructor(def: MathboxPlaneDefinition) {
            let planeType = 'z';
            if (def.hasOwnProperty('x')) {
                def.axis1 = "y";
                def.axis2 = "z";
                planeType = "x";
            } else if (def.hasOwnProperty('y')) {
                def.axis1 = "x";
                def.axis2 = "z";
                planeType = "y";
            } else {
                def.axis1 = "x";
                def.axis2 = "y";
            }
            def.samplePoints = 2;
            setProperties(def, 'updatables', ['x', 'y', 'z']);
            super(def);
            this.planeType = planeType;
        }

        mathboxFn() {
            const p = this;
            if (p.planeType == "x") {
                return function (emit, y, z) {
                    emit(y, z, p.x);
                };
            } else if (p.planeType == "y") {
                return function (emit, x, z) {
                    emit(p.y, z, x);
                };
            } else {
                return function (emit, x, y) {
                    emit(y, p.z, x);
                };
            }

        }

    }

}

