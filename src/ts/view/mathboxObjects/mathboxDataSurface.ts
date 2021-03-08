/// <reference path="../../kg.ts" />

'use strict';

module KG {

    export interface MathboxDataSurfaceDefinition extends MathboxSurfaceDefinition {
        meshWidth?: number;
        axis1?: string;
        axis2?: string;
        samplePoints?: number;
    }

    export class MathboxDataSurface extends MathboxSurface {

        public dataPoints

        constructor(def: MathboxSurfaceDefinition) {
            setDefaults(def, {
                fill: "#666666",
                strokeWidth: 10,
                opacity: 0.2,
                meshWidth: 1,
                samplePoints: 100,
                axis1: "x",
                axis2: "y"
            });
            setProperties(def, 'constants', ['meshWidth', 'samplePoints']);
            super(def);
            let s = this;
            const axis1 = [0, "y", "z", "x"].indexOf(def.axis1);
            const axis2 = [0, "y", "z", "x"].indexOf(def.axis2);
            s.axes = [axis1, axis2];
        }

        draw() {
            let s = this;
            s.surfaceData = s.mathbox.mathboxView.area({
                axes: s.axes,
                channels: 3,
                width: s.samplePoints,
                height: s.samplePoints
            });

            /*

            #TODO Someday we'll improve shading

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
			);*/

            s.mo = s.mathbox.mathboxView.surface({
                points: s.surfaceData,
                shaded: true,
                fill: true,
                lineX: true,
                lineY: true,
                width: s.meshWidth,
                zIndex: 2
            });
            return s;
        }

        redraw() {
            let c = this;
            //console.log(c);
            c.surfaceData.set("expr", c.mathboxFn());
            c.mo.set("color", c.fill);
            c.mo.set("opacity", c.opacity);
            return c;
        }

    }
}