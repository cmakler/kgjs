/// <reference path='../../kg.ts' />

module KG {

    export interface AreaDefinition extends ViewObjectDefinition {
        univariateFunction1: UnivariateFunctionDefinition;
        univariateFunction2?: UnivariateFunctionDefinition;
        above?: boolean;
    }

    export class Area extends ViewObject {

        private interpolation;

        private areaShape;
        private areaPath;

        private univariateFunction1: UnivariateFunction;
        private univariateFunction2: UnivariateFunction;

        constructor(def: AreaDefinition) {

            const minValue = def.univariateFunction1.ind == 'x' ? def.yScale.domainMin : def.xScale.domainMin;
            const maxValue = def.univariateFunction1.ind == 'x' ? def.yScale.domainMax : def.xScale.domainMax;

            setDefaults(def, {
                alwaysUpdate: true,
                interpolation: 'curveBasis',
                ind: 'x',
                fill: 'lightsteelblue',
                opacity: 0.2,
                univariateFunction2: {
                    "fn": def.above ? maxValue : minValue,
                    "ind": def.univariateFunction1['ind'],
                    "min": def.univariateFunction1['min'],
                    "max": def.univariateFunction1['max'],
                    "samplePoints": def.univariateFunction1['samplePoints']
                }
            });

            setProperties(def, 'constants', ['interpolation']);
            super(def);

            def.univariateFunction1.model = def.model;
            def.univariateFunction2.model = def.model;
            this.univariateFunction1 = new UnivariateFunction(def.univariateFunction1);
            this.univariateFunction2 = new UnivariateFunction(def.univariateFunction2);
        }

        // create SVG elements
        draw(layer) {
            let ab = this;

            ab.rootElement = layer.append('path');

            ab.areaShape = d3.area()
                .x0(function (d: any) {
                    return ab.xScale.scale(d[0].x);
                })
                .y0(function (d: any) {
                    return ab.yScale.scale(d[0].y);
                })
                .x1(function (d: any) {
                    return ab.xScale.scale(d[1].x);
                })
                .y1(function (d: any) {
                    return ab.yScale.scale(d[1].y);
                });

            ab.areaPath = ab.rootElement;

            return ab.addClipPathAndArrows();
        }

        // update properties
        redraw() {
            const ab = this,
                fn1 = ab.univariateFunction1,
                fn2 = ab.univariateFunction2;

            if (fn1 != undefined && fn2 != undefined) {
                ab.updateFn(fn1);
                ab.updateFn(fn2);

                if (fn1.hasChanged || fn2.hasChanged) {
                    ab.areaPath
                        .data([d3.zip(ab.univariateFunction1.data, ab.univariateFunction2.data)])
                        .attr('d', ab.areaShape)
                        .style('fill', ab.fill)
                        .style('opacity', ab.opacity);
                }

            }

            return ab;
        }

        updateFn(fn) {
            const scale = (fn.ind == 'y') ? this.yScale : this.xScale;
            fn.update(true);
            if (fn.hasChanged) {
                fn.generateData(scale.domainMin, scale.domainMax);
            }
            return false;
        }
    }

}