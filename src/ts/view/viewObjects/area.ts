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
                interpolation: 'curveBasis',
                ind: 'x',
                fill: 'lightsteelblue',
                opacity: 0.2,
                univariateFunction2: {
                    "fn": ((def.above && !def.useTopScale) || (!def.above && def.useTopScale)) ? maxValue : minValue,
                    "ind": def.univariateFunction1['ind'],
                    "min": def.univariateFunction1['min'],
                    "max": def.univariateFunction1['max'],
                    "samplePoints": def.univariateFunction1['samplePoints']
                }
            });

            setProperties(def, 'constants', ['interpolation']);

            def.univariateFunction1.model = def.model;
            def.univariateFunction2.model = def.model;

            // need to initialize the functions before the area, so they exist when it's time to draw the area
            const univariateFunction1 = new UnivariateFunction(def.univariateFunction1),
                univariateFunction2 = new UnivariateFunction(def.univariateFunction2);

            super(def);

            this.univariateFunction1 = univariateFunction1;
            this.univariateFunction2 = univariateFunction2;
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
            const area = this;

            if (area.univariateFunction1 != undefined && area.univariateFunction2 != undefined) {

                const fn1 = area.univariateFunction1,
                    fn2 = area.univariateFunction2,
                    scale = fn1.ind == 'y' ? area.yScale : area.xScale;

                fn1.generateData(scale.domainMin, scale.domainMax);
                fn2.generateData(scale.domainMin, scale.domainMax);

                area.areaPath
                    .data([d3.zip(fn1.data, fn2.data)])
                    .attr('d', area.areaShape);

                area.drawFill(area.areaPath);
            } else {
                //console.log('area functions undefined')
            }

            return area;
        }

        // update self and functions
        update(force) {
            let area = super.update(force);
            if (!area.hasChanged) {
                if (area.univariateFunction1.hasChanged || area.univariateFunction2.hasChanged) {
                    area.redraw();
                }
            }
            return area;
        }
    }

}