/// <reference path='../../kg.ts' />

module KG {

    export interface CurveDefinition extends ViewObjectDefinition {
        univariateFunction: UnivariateFunctionDefinition;
    }

    export class Curve extends ViewObject {

        private g;
        private dragPath;
        private path;
        private interpolation;
        private univariateFunction: UnivariateFunction;

        constructor(def: CurveDefinition) {
            // establish property defaults
            def = defaults(def, {
                interpolation: 'curveBasis',
                constants: []
            });

            // define updatable properties
            def.constants = def.constants.concat(['interpolation']);
            super(def);
            def.univariateFunction.model = def.model
            this.univariateFunction = new UnivariateFunction(def.univariateFunction)
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
            if (curve.hasOwnProperty('univariateFunction')) {
                const fn = curve.univariateFunction.update(force);
                const scale = fn.ind == 'y' ? curve.yScale: curve.xScale;
                data = fn.dataPoints(scale.domainMin, scale.domainMax);
                const dataLine = d3.line()
                    .curve(d3[curve.interpolation])
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