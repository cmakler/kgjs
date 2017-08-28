/// <reference path="../../kg.ts" />


module KGAuthor {

    export interface IMathFunction {
        value: (x: any) => any;
    }

    export class MathFunction extends AuthoringObject {


    }

    export interface IMultivariateFunction extends IMathFunction {
        levelCurve: (level: any, def: any, graph: Graph) => Curve;
        levelCurveThroughPoint: (point: any, def: any, graph: Graph) => Curve;
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

        levelCurve(level, def, graph) {
            return new Curve(def, graph);
        }

        levelCurveThroughPoint(point, def, graph) {
            return this.levelCurve(this.value(point), def, graph);
        }
    }

    export class CobbDouglasFunction extends MultivariateFunction {

        value(x) {
            const e = this.exponents;
            return `((${x[0]})^(${e[0]}))*((${x[0]})^(${e[0]}))`;
        }

        levelCurve(level, def, graph) {
            const e = this.exponents;
            def.interpolation = 'curveMonotoneX';
            def.data = [
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
            ];
            return new Curve(def, graph);
        }
    }

    export class Linear extends MultivariateFunction {

        value(x) {
            const c = this.coefficients;
            return `((${x[0]})*(${c[0]})+(${x[0]})*(${c[0]}))`;
        }

        levelCurve(level, def, graph) {
            const c = this.coefficients;
            def.interpolation = 'curveLinear';
            def.data = [
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
            ];
            return new Curve(def, graph);
        }
    }

    export class Min extends MultivariateFunction {

        value(x) {
            const c = this.def.coefficients;
            return `(min((${x[0]})*(${c[0]}),(${x[0]})*(${c[0]})))`;
        }

        levelCurve(level, def, graph) {
            const c = this.def.coefficients;
            def.interpolation = 'curveLinear';
            def.data = [
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
            ];
            return new Curve(def, graph);
        }
    }
}