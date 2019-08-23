/// <reference path='../../kg.ts' />

module KG {

    export interface CurveDefinition extends ViewObjectDefinition {
        univariateFunction?: UnivariateFunctionDefinition;
        parametricFunction?: ParametricFunctionDefinition;
    }

    export class Curve extends ViewObject {

        private dataLine;

        private dragPath;
        private path;
        private interpolation;
        private univariateFunction: UnivariateFunction;
        private parametricFunction: ParametricFunction;

        constructor(def: CurveDefinition) {
            let univariateFunction, parametricFunction;
            setDefaults(def, {
                interpolation: 'curveBasis',
                strokeWidth: 2
            });
            setProperties(def, 'constants', ['interpolation']);
            if (def.hasOwnProperty('univariateFunction')) {
                def.univariateFunction.model = def.model;
                univariateFunction = new UnivariateFunction(def.univariateFunction);
                setProperties(def, 'updatables', [])
            } else if (def.hasOwnProperty('parametricFunction')) {
                def.parametricFunction.model = def.model;
                parametricFunction = new ParametricFunction(def.parametricFunction);
                setProperties(def, 'updatables', [])
            }
            super(def);
            let curve = this;
            if (def.hasOwnProperty('univariateFunction')) {
                curve.univariateFunction = univariateFunction;
            } else if (def.hasOwnProperty('parametricFunction')) {
                def.parametricFunction.model = def.model;
                curve.parametricFunction = parametricFunction;
            }

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
            return curve.addClipPathAndArrows().addInteraction();
        }

        // update properties
        redraw() {
            let curve = this;
            if (curve.hasOwnProperty('univariateFunction')) {
                const fn = curve.univariateFunction,
                    scale = fn.ind == 'y' ? curve.yScale : curve.xScale;
                fn.generateData(scale.domainMin, scale.domainMax);
                curve.dragPath.data([fn.data]).attr('d', curve.dataLine);
                curve.path.data([fn.data]).attr('d', curve.dataLine);
            }
            if (curve.hasOwnProperty('parametricFunction')) {
                const fn = curve.parametricFunction;
                fn.generateData();
                curve.dragPath.data([fn.data]).attr('d', curve.dataLine);
                curve.path.data([fn.data]).attr('d', curve.dataLine);
            }
            curve.drawStroke(curve.path);
            return curve;
        }

        // update self and functions
        update(force) {
            let curve = super.update(force);
            if (!curve.hasChanged) {
                if (curve.hasOwnProperty('univariateFunction')) {
                    if (curve.univariateFunction.hasChanged) {
                        curve.redraw();
                    }
                }
                if (curve.hasOwnProperty('parametricFunction')) {
                    if (curve.parametricFunction.hasChanged) {
                        curve.redraw();
                    }
                }
            }
            return curve;
        }

    }

}