/// <reference path="../../kg.ts" />


module KGAuthor {

    export interface IMathFunction {
        value: (x: any) => any;
    }

    export class MathFunction extends AuthoringObject {


    }

    export interface IMultivariateFunction extends IMathFunction {
        levelCurve: (def: any, graph: Graph) => Curve[];
    }

    export class MultivariateFunction extends MathFunction implements IMultivariateFunction {

        public coefficients;
        public exponents;

        constructor(def) {
            super(def);
            let fn = this;
            fn.exponents = def.exponents;
            fn.coefficients = def.coefficients;
            if (def.hasOwnProperty('alpha')) {
                fn.exponents = [def.alpha, subtractDefs(1, def.alpha)];
                fn.coefficients = [def.alpha, subtractDefs(1, def.alpha)];
            }
        }

        value(x) {
            return '';
        }

        levelCurve(def, graph) {
            return this.curvesFromFunctions([],def,graph);
        }

        curvesFromFunctions(fns:any[], def, graph) {
            return fns.map(function(fn) {
                let curveDef = JSON.parse(JSON.stringify(def));
                delete curveDef.utilityFunction;
                curveDef.univariateFunction = fn;
                return new Curve(curveDef,graph);
            })
        }

    }

    export class CobbDouglasFunction extends MultivariateFunction {

        value(x) {
            const e = this.exponents;
            return `((${x[0]})^(${e[0]}))*((${x[1]})^(${e[1]}))`;
        }

        levelCurve(def, graph) {
            const e = this.exponents,
                level = def.level || this.value(def.point);
            def.interpolation = 'curveMonotoneX';
            return this.curvesFromFunctions([
                {
                    "fn": `(${level}/y^(${e[1]}))^(1/(${e[0]}))`,
                    "ind": "y",
                    "min": `(${level})^(1/(${e[0]} + ${e[1]}))`,
                    "samplePoints": 30
                },
                {
                    "fn": `(${level}/x^(${e[0]}))^(1/(${e[1]}))`,
                    "ind": "x",
                    "min": `(${level})^(1/(${e[0]} + ${e[1]}))`,
                    "samplePoints": 30
                }
            ], def, graph)
        }
    }

    export class LinearFunction extends MultivariateFunction {

        value(x) {
            const c = this.coefficients;
            return `((${x[0]})*(${c[0]})+(${x[0]})*(${c[0]}))`;
        }

        levelCurve(def, graph) {
            const c = this.coefficients,
                level = def.level || this.value(def.point);
            def.interpolation = 'curveLinear';
            return this.curvesFromFunctions([
                {
                    "fn": `(${level} - (${c[1]})*y)/(${c[0]})`,
                    "ind": "y",
                    "samplePoints": 2
                },
                {
                    "fn": `(${level} - (${c[0]})*x)/(${c[1]})`,
                    "ind": "x",
                    "samplePoints": 2
                }
            ], def, graph)
        }
    }

    export class MinFunction extends MultivariateFunction {

        value(x) {
            const c = this.def.coefficients;
            return `(min((${x[0]})*(${c[0]}),(${x[0]})*(${c[0]})))`;
        }

        levelCurve(def, graph) {
            const c = this.def.coefficients,
                level = def.level || this.value(def.point);
            def.interpolation = 'curveLinear';
            return this.curvesFromFunctions([
                {
                    "fn": divideDefs(level, c[1]),
                    "ind": "x",
                    "min": divideDefs(level, c[0]),
                    "samplePoints": 2
                }, {
                    "fn": divideDefs(level, c[0]),
                    "ind": "y",
                    "min": divideDefs(level, c[1]),
                    "samplePoints": 2
                }
            ], def, graph);
        }
    }
}