/// <reference path="../../kg.ts" />

module KG {

    export interface CurveDefinition extends ViewObjectDefinition {
        univariateFunctionNames: string[];
    }

    export class Curve extends ViewObject {

        private g;
        private dragPath;
        private path;
        private univariateFunctions: UnivariateFunction[];

        constructor(def: CurveDefinition) {

            // establish property defaults
            def = _.defaults(def, {
                constants: []
            });

            // define properties
            def.constants = def.constants.concat(['univariateFunctions']);

            super(def);
        }

        // create SVG elements
        draw(layer) {
            let curve = this;
            curve.g = layer.append('g');
            curve.dragPath = curve.g.append('path').attr('stroke-width', '20px').style('stroke-opacity', 0).style('fill', 'none');
            curve.path = curve.g.append('path').style('fill', 'none');
            if (curve.hasOwnProperty('clipPath') && curve.clipPath != undefined) {
                curve.g.attr('clip-path', `url(#${curve.clipPath.id})`);
            }
            curve.interactionHandler.addTrigger(curve.g);
            return curve;
        }

        // update properties
        update(force) {
            let curve = super.update(force);
            let data = [];
            curve.univariateFunctions.forEach(function (fn) {
                data = data.concat(fn.dataPoints(curve.xScale.domainMin, curve.xScale.domainMax));
            });
            function sortObjects(key, descending?) {
                return function (a, b) {
                    let lower = descending ? a[key] : b[key],
                        higher = descending ? b[key] : a[key];
                    return lower > higher ? -1 : lower < higher ? 1 : lower <= higher ? 0 : NaN;
                }
            }

            data = data.sort(sortObjects('x'));
            const dataline = d3.line()
                .curve(d3.curveBasis)
                .x(function (d: any) {
                    return curve.xScale.scale(d.x)
                })
                .y(function (d: any) {
                    return curve.yScale.scale(d.y)
                });
            curve.dragPath.data([data]).attr("d", dataline);
            curve.path.data([data]).attr("d", dataline);
            curve.path.attr("stroke", curve.stroke);
            curve.path.attr('stroke-width', curve.strokeWidth);
            return curve;
        }
    }

}