/// <reference path='../../kg.ts' />

module KG {

    export interface ContourDefinition extends ViewObjectDefinition {
        fn: string;
        level: any;
        areaAbove?: AreaDefinition;
        areaBelow?: AreaDefinition;
    }

    export class Contour extends ViewObject {

        public curveData;
        private fn: MultivariateFunction;


        constructor(def: ContourDefinition) {
            setDefaults(def, {
                opacity: 0.2,
                stroke: "grey",
                fill: "none"
            });
            setProperties(def, 'updatables', ['level']);
            super(def);
            const fnDef = {
                fn: def.fn,
                model: def.model
            };
            this.fn = new MultivariateFunction(fnDef).update(true);
        }

        draw(layer) {
            let c = this;
            c.rootElement = layer.append('g');
            c.path = c.rootElement.append('path');
            return c.addClipPathAndArrows();
        }

        redraw() {
            let c = this;
            const xMax = c.xScale.domainMax,
                yMax = c.yScale.domainMax;
            if (undefined != c.fn) {
                var n = 110, m = 110, values = new Array(n * m);
                for (var j = 0.5, k = 0; j < m; ++j) {
                    for (var i = 0.5; i < n; ++i, ++k) {
                        let x = i * xMax * 1.1 / n,
                            y = j * yMax * 1.1 / m;
                        values[k] = c.fn.eval(x, y);
                    }
                }

                let transform = ({type, value, coordinates}) => {
                    return {
                        type, value, coordinates: coordinates.map(rings => {
                            return rings.map(points => {
                                return points.map(([x, y]) => ([c.xScale.scale(x * xMax / 100), c.yScale.scale(y * yMax / 100)]));
                            });
                        })
                    };
                }

                const p = d3.geoPath();

                // Compute the contour polygons at log-spaced intervals; returns an array of MultiPolygon.
                var contours = d3.contours().size([n, m]).contour(values, c.level);

                c.path.attr("d", p(transform(contours)))
                c.path.style('fill', c.fill);
                c.path.style('opacity', c.opacity);
                c.path.style('stroke', c.stroke);
                c.path.style('stroke-width', c.strokeWidth);
                c.path.style('stroke-opacity', c.strokeOpacity);

            }


            return c;
        }

    }

}