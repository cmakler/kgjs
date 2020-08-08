/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface MathboxSurfaceDefinition extends MathboxObjectDefinition {
        fn: MultivariateFunctionDefinition;
    }

    export class MathboxSurface extends MathboxObject {

        public surfaceData;
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
                axes: [1, 3],
                channels: 3,
                width: s.fn.samplePoints,
                height: s.fn.samplePoints
            });

            var graphColors = s.mathbox.mathboxView.area({
                expr: function (emit, x, y, i, j, t) {
                    if (x < 0)
                        emit(1.0, 0.0, 0.0, 1.0);
                    else
                        emit(0.0, 1.0, 0.0, 1.0);
                },
                axes: [1, 3],
                width: 64, height: 64,
                channels: 4, // RGBA
            });

            graphColors.set("expr",
				function (emit, x, y, i, j, t)
				{
					var z = x*x + y*y;
					const zMin = 0, zMax=200;
					var percent = (z - zMin) / (zMax - zMin);
					emit( percent, percent, percent, 1.0 );
				}
			);

            s.mo = s.mathbox.mathboxView.surface({
                points: s.surfaceData,
                shaded: true,
                fill: true,
                lineX: true,
                lineY: true,
                width: 1,
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

