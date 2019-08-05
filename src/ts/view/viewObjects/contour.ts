/// <reference path='../../kg.ts' />

module KG {

    export interface ContourDefinition extends ViewObjectDefinition {
        fn?: MultivariateFunctionDefinition;
        level?: any;
        areaAbove?: AreaDefinition;
        areaBelow?: AreaDefinition;
    }

    export class Contour extends ViewObject {

        public curveData;
        private fn: MultivariateFunction;


        constructor(def: ContourDefinition) {
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

        draw(layer) {
            let c = this;
            c.rootElement = layer.append('g');
            c.path = c.rootElement.append('path')
                .attr("fill", "none")
                .attr("stroke", "lightsteelblue")


            return c.addClipPathAndArrows();
        }

        redraw() {
            let c = this;
            // Populate a grid of n×m values where -2 ≤ x ≤ 2 and -2 ≤ y ≤ 1.
            var n = 200, m = 200, values = new Array(n * m);
            for (var j = 0, k = 0; j < m; ++j) {
                for (var i = 0; i < n; ++i, ++k) {
                    values[k] = Math.min(i,j);
                }
            }

            let transform = ({type, value, coordinates}) => {
                return {
                    type, value, coordinates: coordinates.map(rings => {
                        return rings.map(points => {
                            return points.map(([x, y]) => ([c.xScale.scale(x), c.yScale.scale(y)]));
                        });
                    })
                };
            }

            const p = d3.geoPath();

            // Compute the contour polygons at log-spaced intervals; returns an array of MultiPolygon.
            var contours = d3.contours().size([n, m]).contour(values,40);

            console.log(contours.coordinates[0][0]);

            contours = transform(contours);

            console.log(contours.coordinates[0][0]);

            c.path.attr("d", p(contours));

            return c;
        }

    }

}