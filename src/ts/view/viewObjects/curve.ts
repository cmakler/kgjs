/// <reference path='../../kg.ts' />

module KG {

    export interface CurveDefinition extends ViewObjectDefinition {
        univariateFunctions: UnivariateFunctionDefinition[];
    }

    export class Curve extends ViewObject {

        private g;
        private dragPath;
        private path;
        private univariateFunctions: UnivariateFunction[];

        constructor(def: CurveDefinition) {
            super(def);
            this.univariateFunctions = def.univariateFunctions.map(function (f) {
                f.model = def.model;
                return new UnivariateFunction(f)
            })
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
            function sortObjects(key, descending?) {
                    return function (a, b) {
                        let lower = descending ? a[key] : b[key],
                            higher = descending ? b[key] : a[key];
                        return lower > higher ? -1 : lower < higher ? 1 : lower <= higher ? 0 : NaN;
                    }
                }
            if (curve.hasOwnProperty('univariateFunctions')) {
                curve.univariateFunctions.forEach(function (fn) {
                    fn.update(force);
                    data = data.concat(fn.dataPoints(curve.xScale.domainMin, curve.xScale.domainMax));
                });
                data = data.sort(sortObjects('x'));
                const dataLine = d3.line()
                    .curve(d3.curveBasis)
                    .x(function (d: any) {
                        return curve.xScale.scale(d.x)
                    })
                    .y(function (d: any) {
                        return curve.yScale.scale(d.y)
                    });
                curve.dragPath.data([data]).attr('d', dataLine);
                curve.path.data([data]).attr('d', dataLine);
                curve.path.attr('stroke', curve.stroke);
                curve.path.attr('stroke-width', curve.strokeWidth);
            }

            return curve;
        }
    }

}