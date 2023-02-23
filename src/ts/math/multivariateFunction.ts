/// <reference path="../kg.ts" />

module KG {

    import MathFunction = KG.MathFunction;

    export interface MultivariateFunctionDefinition extends MathFunctionDefinition {
        fn: string;
        domainCondition?: string;
    }

    export interface IMultivariateFunction extends IMathFunction {
        inDomain: (x: number, y: number, z: number) => boolean;
        evaluate: (x: number, y: number) => number;
        mathboxFn: (maxY, maxZ, minY?, minZ?) => (emit: (y: number, z: number, x: number) => any, x: number, y: number, i?: number, j?: number, t?: number) => void;
        contour: (level: number, xScale: Scale, yScale: Scale) => string;
    }

    export class MultivariateFunction extends MathFunction implements IMultivariateFunction {

        private fnString;
        private domainConditionString;
        public fnStringDef;
        public domainConditionStringDef;
        private compiledFunction;
        private compiledDomainCondition;

        constructor(def: MultivariateFunctionDefinition) {
            def.samplePoints = 100;
            setProperties(def, 'constants', ['fn']);
            super(def);
            this.fnStringDef = def.fn;
            this.domainConditionStringDef = def.domainCondition;
        }

        inDomain(x, y, z) {
            let fn = this;
            if (fn.hasOwnProperty('compiledDomainCondition')) {
                return fn.compiledDomainCondition.evaluate({x: x, y: y, z: z});
            } else {
                return true;
            }
        }

        evaluate(x, y) {
            let fn = this;
            if (fn.hasOwnProperty('compiledFunction')) {
                const z = fn.compiledFunction.evaluate({x: x, y: y});
                if (fn.inDomain(x, y, z)) {
                    return z;
                }
            }
        }
        mathboxFn() {
            const fn = this;
            return function (emit, x, y) {
                emit(y, fn.evaluate(x, y), x);
            };
        }
        contour(level, xScale, yScale, bounds?) {
            const fn = this;

            bounds = setDefaults(bounds || {}, {
                xMin: xScale.domainMin,
                xMax: xScale.domainMax,
                yMin: yScale.domainMin,
                yMax: yScale.domainMax
            });

            let n = 100, m = 100, values = new Array(n * m);
            for (let j = 0.5, k = 0; j < m; ++j) {
                for (let i = 0.5; i < n; ++i, ++k) {
                    let x = bounds.xMin + i * (bounds.xMax - bounds.xMin) / n,
                        y = bounds.yMin + j * (bounds.yMax - bounds.yMin) / m;
                    values[k] = fn.evaluate(x, y);
                }
            }

            let transform = ({type, value, coordinates}) => {
                return {
                    type, value, coordinates: coordinates.map(rings => {
                        return rings.map(points => {
                            return points.map(([x, y]) => ([xScale.scale(bounds.xMin + x * (bounds.xMax - bounds.xMin) / 100), yScale.scale(bounds.yMin + y * (bounds.yMax - bounds.yMin) / 100)]));
                        });
                    })
                };
            };

            const p = d3.geoPath();

            // Compute the contour polygons at log-spaced intervals; returns an array of MultiPolygon.
            const contourLine = d3.contours().size([n, m]).contour(values, level);

            return p(transform(contourLine));
        }

        update(force) {
            let fn = super.update(force);
            //console.log('updating; currently ', fn.fnString);
            fn.scope = {
                params: fn.model.currentParamValues,
                calcs: fn.model.currentCalcValues,
                colors: fn.model.currentColors
            };
            const originalString = fn.fnString,
                originalDomainCondition = fn.domainConditionString;
            if (originalString != fn.updateFunctionString(fn.fnStringDef, fn.scope)) {
                fn.hasChanged = true;
                fn.fnString = fn.updateFunctionString(fn.fnStringDef, fn.scope);
                fn.compiledFunction = math.compile(fn.fnString);
            }
            if (fn.domainConditionStringDef != undefined) {
                if (originalDomainCondition != fn.updateFunctionString(fn.domainConditionStringDef, fn.scope)) {
                    fn.hasChanged = true;
                    fn.domainConditionString = fn.updateFunctionString(fn.domainConditionStringDef, fn.scope);
                    fn.compiledDomainCondition = math.compile(fn.domainConditionString);
                }
            }


            return fn;
        }

    }
}