/// <reference path='../../kg.ts' />

module KG {

    export interface CurveDefinition extends ViewObjectDefinition {
        univariateFunction: UnivariateFunctionDefinition;
    }

    export class Curve extends ViewObject {

        private dataLine;

        private dragPath;
        private path;
        private interpolation;
        private univariateFunction: UnivariateFunction;

        constructor(def: CurveDefinition) {

            setDefaults(def, {
                alwaysUpdate: true,
                interpolation: 'curveBasis'
            });
            setProperties(def, 'constants',['interpolation']);
            super(def);
            def.univariateFunction.model = def.model;
            this.univariateFunction = new UnivariateFunction(def.univariateFunction)
        }

        // create SVG elements
        draw(layer) {
            let curve = this;

            curve.dataLine = d3.line()
                        .curve(d3[curve.interpolation])
                        .x(function (d: any) {
                            return curve.xScale.scale(d.x)
                        })
                        .y(function (d: any) {
                            return curve.yScale.scale(d.y)
                        });

            curve.rootElement = layer.append('g');
            curve.dragPath = curve.rootElement.append('path').attr('stroke-width', '20px').style('stroke-opacity', 0).style('fill', 'none');
            curve.path = curve.rootElement.append('path').style('fill', 'none');
            return curve.addClipPath().addInteraction();
        }

        // update properties
        redraw() {
            let curve = this;
            if (curve.hasOwnProperty('univariateFunction')) {
                const fn = curve.univariateFunction.update(true);
                if (fn.hasChanged) {
                    const scale = fn.ind == 'y' ? curve.yScale : curve.xScale;
                    fn.generateData(scale.domainMin, scale.domainMax);
                    curve.dragPath.data([fn.data]).attr('d', curve.dataLine);
                    curve.path.data([fn.data]).attr('d', curve.dataLine);
                }
                curve.path.attr('stroke', curve.stroke);
                curve.path.attr('stroke-width', curve.strokeWidth);
            }
            return curve;
        }
    }

}