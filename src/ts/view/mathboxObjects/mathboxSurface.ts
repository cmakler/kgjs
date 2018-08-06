/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface MathboxSurfaceDefinition extends MathboxObjectDefinition {
        fn: MultivariateFunctionDefinition;
    }

    export class MathboxSurface extends MathboxObject {

        private fn: MultivariateFunction;

        constructor(def: MathboxSurfaceDefinition) {
            setDefaults(def, {
                fill: "#666666",
                strokeWidth: 10,
                opacity: 0.2
            });
            super(def);
            def.fn = setDefaults(def.fn, {
                model: def.model,
                samplePoints: 100
            });
            this.fn = new MultivariateFunction(def.fn).update(true);
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
                shaded: false,
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
            console.log(c);
            c.surfaceData.set("expr", c.fn.mathboxFn());
            c.mo.set("color", c.fill);
            c.mo.set("opacity", c.opacity);
            return c;
        }

    }

}

