/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface MathboxPlaneDefinition extends MathboxObjectDefinition {
        x1: any;
        y1: any;
        z1: any;
        x2: any;
        y2: any;
        z2: any;
        x3: any;
        y3: any;
        z3: any;
    }

    export class MathboxShape extends MathboxObject {

        public surfaceData;

        constructor(def: MathboxSurfaceDefinition) {
            setDefaults(def, {
                fill: "#666666",
                strokeWidth: 10,
                opacity: 0.2
            });
            super(def);

        }

        draw() {
            let s = this;
            s.surfaceData = s.mathbox.mathboxView.area({
                axes: [1,3],
                channels: 3,
                width: s.fn.samplePoints,
                height: s.fn.samplePoints
            });

            s.mo = s.mathbox.mathboxView.surface({
                points: s.surfaceData,
                shaded: true,
                fill: true,
                lineX: false,
                lineY: false,
                width: 0,
                zIndex: 2
            });
            return s;
        }

        redraw() {
            let c = this;
            //console.log(c);
            c.surfaceData.set("expr", c.fn.mathboxFn());
            c.mo.set("color", c.fill);
            c.mo.set("opacity", c.opacity);
            return c;
        }

    }

}

