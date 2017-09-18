/// <reference path="../../kg.ts" />


module KGAuthor {

    import randomString = KG.randomString;

    export interface IMathFunction {
        value: (x: any) => any;
    }

    export class MathFunction extends AuthoringObject {


    }

    export interface IMultivariateFunction extends IMathFunction {
        levelSet: (def: any, graph: Graph) => KG.UnivariateFunctionDefinition[];
    }

    export class MultivariateFunction extends MathFunction implements IMultivariateFunction {

        public alpha;
        public coefficients;
        public exponents;
        public interpolation;
        public fillBelowRect;
        public fillAboveRect;



        value(x) {
            return '';
        }

        levelSet(def) {
            return [];
        }

        levelCurve(def, graph) {
            def.interpolation = this.interpolation;
            return this.curvesFromFunctions(this.levelSet(def), def, graph);
        }

        curvesFromFunctions(fns: any[], def, graph) {
            return fns.map(function (fn) {
                let curveDef = JSON.parse(JSON.stringify(def));
                curveDef.univariateFunction = fn;
                return new Curve(curveDef, graph);
            })
        }

        areaBelowLevelCurve(def, graph) {
            const fn = this;
            fn.fillBelowRect = null;
            def.interpolation = fn.interpolation;
            const fns = fn.levelSet(def);
            let objs = [];
            fns.forEach(function (fn) {
                let areaDef = JSON.parse(JSON.stringify(def));
                areaDef.univariateFunction1 = fn;
                objs.push(new Area(areaDef, graph));
            });
            if (fn.fillBelowRect) {
                fn.fillBelowRect.fill = def.fill;
                objs.push(new Rectangle(fn.fillBelowRect,graph));
            }
            return objs;
        }

        areaAboveLevelCurve(def, graph) {
            const fn = this;
            fn.fillAboveRect = null;
            def.interpolation = fn.interpolation;
            const fns = fn.levelSet(def);
            let objs = [];
            fns.forEach(function (fn) {
                let areaDef = JSON.parse(JSON.stringify(def));
                areaDef.univariateFunction1 = fn;
                areaDef.inClipPath = true;
                areaDef.above = true;
                objs.push(new Area(areaDef, graph));
            });
            if (fn.fillAboveRect) {
                objs.push(new Rectangle(fn.fillAboveRect,graph));
            }
            const clipPathName = KG.randomString(10)
            return [
                new Rectangle({
                    clipPathName: clipPathName,
                    x1: graph.def.xAxis.min,
                    x2: graph.def.xAxis.max,
                    y1: graph.def.yAxis.min,
                    y2: graph.def.yAxis.max
                }, graph),
                new ClipPath({
                    "name": clipPathName,
                    "paths": objs
                }, graph)
            ]
        }

    }

    export class CobbDouglasFunction extends MultivariateFunction {

        constructor(def) {
            super(def);
            let fn = this;
            fn.interpolation = 'curveMonotoneX';
            if (def.hasOwnProperty('alpha')) {
                fn.exponents = [def.alpha, subtractDefs(1, def.alpha)];
            }
        }

        value(x) {
            const e = this.exponents;
            return `((${x[0]})^(${e[0]}))*((${x[1]})^(${e[1]}))`;
        }

        levelSet(def) {
            const e = this.exponents,
                level = def.level || this.value(def.point),
                xMin = `(${level})^(1/(${e[0]} + ${e[1]}))`,
                yMin = `(${level})^(1/(${e[0]} + ${e[1]}))`;
            this.fillBelowRect = {
                x1: 0,
                x2: xMin,
                y1: 0,
                y2: yMin,
                show: def.show
            };
            return [
                {
                    "fn": `(${level}/y^(${e[1]}))^(1/(${e[0]}))`,
                    "ind": "y",
                    "min": yMin,
                    "samplePoints": 30
                },
                {
                    "fn": `(${level}/x^(${e[0]}))^(1/(${e[1]}))`,
                    "ind": "x",
                    "min": xMin,
                    "samplePoints": 30
                }
            ]
        }
    }

    export class LinearFunction extends MultivariateFunction {

        constructor(def) {
            super(def);
            let fn = this;
            this.interpolation = 'curveLinear';
            if (def.hasOwnProperty('alpha')) {
                fn.coefficients = [def.alpha, subtractDefs(1, def.alpha)];
            }
        }

        value(x) {
            const c = this.coefficients;
            return `((${x[0]})*(${c[0]})+(${x[1]})*(${c[1]}))`;
        }

        levelSet(def) {
            const c = this.coefficients,
                level = def.level || this.value(def.point);
            return [
                {
                    "fn": `(${level} - (${c[0]})*x)/(${c[1]})`,
                    "ind": "x",
                    "samplePoints": 2
                }
            ]
        }
    }

    export class MinFunction extends MultivariateFunction {

        constructor(def) {
            super(def);
            let fn = this;
            this.interpolation = 'curveLinear';
            if (def.hasOwnProperty('alpha')) {
                fn.coefficients = [divideDefs(0.5,def.alpha), divideDefs(0.5,subtractDefs(1, def.alpha))];
            }
        }

        value(x) {
            const c = this.coefficients;
            return `(min((${x[0]})*(${c[0]}),(${x[1]})*(${c[1]})))`;
        }

        levelSet(def) {
            const c = this.coefficients,
                level = def.level || this.value(def.point),
                xMin = divideDefs(level, c[0]),
                yMin = divideDefs(level, c[1]);
            this.fillBelowRect = {
                x1: 0,
                x2: xMin,
                y1: 0,
                y2: yMin,
                show: def.show
            };
            return [
                {
                    "fn": divideDefs(level, c[1]),
                    "ind": "x",
                    "min": xMin,
                    "samplePoints": 2
                }, {
                    "fn": divideDefs(level, c[0]),
                    "ind": "y",
                    "min": yMin,
                    "samplePoints": 2
                }
            ];
        }
    }
}