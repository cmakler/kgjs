/// <reference path="../../kg.ts" />


module KGAuthor {

    export interface IUtilityFunction {
        value: (x: any[]) => any;
        optimalBundle: (budgetLine: EconBudgetLine) => any[];
        lagrangeBundle: (budgetLine: EconBudgetLine) => any[];
        cornerCondition: (budgetLine: EconBudgetLine) => string;
        levelSet: (def: any, graph: Graph) => KG.UnivariateFunctionDefinition[];
        levelCurve: (def: any, graph: Graph) => Curve[];
        demandFunction: (budgetLine: EconBudgetLine, good: number, graph: Graph) => KG.UnivariateFunctionDefinition[];
        demandCurve: (budgetLine: EconBudgetLine, good: number, def: any, graph: Graph) => Curve[];
    }

    export class UtilityFunction implements IUtilityFunction {

        public alpha;
        public coefficients;
        public exponents;
        public interpolation;
        public fillBelowRect;
        public fillAboveRect;

        constructor(def) {
            let fn = this;
            fn.interpolation = 'curveMonotoneX';
            if (def.hasOwnProperty('alpha')) {
                fn.alpha = def.alpha;
                fn.exponents = [def.alpha, subtractDefs(1, def.alpha)];
                fn.coefficients = [def.alpha, subtractDefs(1, def.alpha)];
            } else if (def.hasOwnProperty('exponents')) {
                fn.exponents = def.exponents;
                fn.alpha = divideDefs(fn.exponents[0], addDefs(fn.exponents[0], fn.exponents[1]));
            } else if (def.hasOwnProperty('coefficients')) {
                fn.coefficients = def.coefficients;
                fn.alpha = divideDefs(fn.coefficients[0], addDefs(fn.coefficients[0], fn.coefficients[1]));
            }
        }

        value(x) {
            return null;
        }

        extractLevel(def) {
            const u = this;
            if (def.hasOwnProperty('level') && def.level != undefined) {
                return getDefinitionProperty(def.level);
            } else if (def.hasOwnProperty('point') && def.point != undefined) {
                return u.value(def.point);
            } else if (def.hasOwnProperty('budgetLine')) {
                const bl = new EconBudgetLine(def.budgetLine, null);
                return u.value(u.optimalBundle(bl));
            }
        }

        levelSet(def) {
            return [];
        }

        levelCurve(def, graph) {
            def.interpolation = this.interpolation;
            return curvesFromFunctions(this.levelSet(def), def, graph);
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
                objs.push(new Rectangle(fn.fillBelowRect, graph));
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
                areaDef.above = true;
                objs.push(new Area(areaDef, graph));
            });
            if (fn.fillAboveRect) {
                fn.fillAboveRect.fill = def.fill;
                fn.fillAboveRect.inClipPath = true;
                objs.push(new Rectangle(fn.fillAboveRect, graph));
            }
            const clipPathName = KG.randomString(10);
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

        cornerCondition(budgetLine: EconBudgetLine) {
            return 'false';
        }

        lagrangeBundle(budgetLine: EconBudgetLine) {
            return [];
        }

        optimalBundle(budgetLine: EconBudgetLine) {
            return [];
        }

        priceOfferFunction(budgetLine: EconBudgetLine, good: number, min: number, max: number, graph) {
            const u = this,
                blDef = (good == 1) ? {p1: 't', p2: budgetLine.p2, m: budgetLine.m} : {
                    p1: budgetLine.p1,
                    p2: 't',
                    m: budgetLine.m
                },
                optimalBundle = u.optimalBundle(new EconBudgetLine(blDef, graph));
            return [
                {
                    xFunction: optimalBundle[0],
                    yFunction: optimalBundle[1],
                    min: min,
                    max: max,
                    samplePoints: 30,
                    parametric: true
                }
            ]
        }

        priceOfferCurve(budgetLine: EconBudgetLine, good: number, min: number, max: number, def, graph) {
            const u = this;
            def.interpolation = 'curveMonotoneX';
            return curvesFromFunctions(u.priceOfferFunction(budgetLine, good, min, max, graph), def, graph);
        }

        demandFunction(budgetLine: EconBudgetLine, good: number, graph) {
            const u = this,
                blDef = (good == 1) ? {p1: 'y', p2: budgetLine.p2, m: budgetLine.m} : {
                    p1: budgetLine.p1,
                    p2: 'y',
                    m: budgetLine.m
                };
            return [
                {
                    "fn": u.optimalBundle(new EconBudgetLine(blDef, graph))[good - 1],
                    "ind": "y",
                    "samplePoints": 30
                }
            ]
        }

        demandCurve(budgetLine, good, def, graph) {
            const u = this;
            def.interpolation = 'curveMonotoneX';
            return curvesFromFunctions(u.demandFunction(budgetLine, good, graph), def, graph);
        }

        quantityDemanded(budgetLine, good) {
            return this.optimalBundle(budgetLine)[good - 1];
        }

    }

    export class CobbDouglasFunction extends UtilityFunction {

        value(x) {
            const e = this.exponents;
            return `((${x[0]})^(${e[0]}))*((${x[1]})^(${e[1]}))`;
        }

        levelSet(def) {
            const e = this.exponents,
                level = this.extractLevel(def),
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

        optimalBundle(budgetLine: EconBudgetLine) {
            const a = this.alpha;
            return [multiplyDefs(a, budgetLine.xIntercept), multiplyDefs(subtractDefs(1, a), budgetLine.yIntercept)]
        }
    }

    export class QuasilinearFunction extends UtilityFunction {

        value(x) {
            const c = this.coefficients;
            return `(0.5*(${c[0]}*log(${x[0]})+${x[1]}))`;
        }

        levelSet(def) {
            const c = this.coefficients,
                level = def.level || this.value(def.point);
            return [
                {
                    "fn": `(2*(${level})-${c[0]}*log(x))`,
                    "ind": "x",
                    "samplePoints": 100
                }
            ]
        }

        cornerCondition(budgetLine: EconBudgetLine) {
            return `(${this.lagrangeBundle(budgetLine)[1]} < 0)`
        }

        lagrangeBundle(budgetLine: EconBudgetLine) {
            const c = this.coefficients;
            return [divideDefs(multiplyDefs(c[0], budgetLine.p2), budgetLine.p1), subtractDefs(budgetLine.yIntercept, c[0])]
        }

        optimalBundle(budgetLine: EconBudgetLine) {
            const lagr = this.lagrangeBundle(budgetLine),
                cornerCondition = this.cornerCondition(budgetLine);
            return [`${cornerCondition} ? ${budgetLine.xIntercept} : ${lagr[0]}`, `${cornerCondition} ? 0 : ${lagr[1]}`]
        }
    }

    export class CES extends UtilityFunction {

        public r;
        public s;

        constructor(def) {
            super(def);
            let fn = this;
            fn.interpolation = 'curveMonotoneX';
            if (def.hasOwnProperty('r')) {
                fn.r = def.r;
                fn.s = divideDefs(1, subtractDefs(1, def.r));
            } else if (def.hasOwnProperty('s')) {
                fn.s = def.s;
                fn.r = subtractDefs(1, divideDefs(1, def.s));
            }
        }

        value(x) {
            const c = this.coefficients,
                r = this.r;
            return raiseDefToDef(addDefs(multiplyDefs(c[0], raiseDefToDef(x[0], r)), multiplyDefs(c[1], raiseDefToDef(x[1], r))), divideDefs(1, r));
        }

        levelSet(def) {
            const u = this,
                a = getDefinitionProperty(u.alpha),
                r = getDefinitionProperty(u.r),
                b = subtractDefs(1, u.alpha),
                level = this.extractLevel(def);
            let rZeroLevel;
            if (def.hasOwnProperty('level') && def.level != undefined) {
                rZeroLevel = level;
            } else if (def.hasOwnProperty('point') && def.point != undefined) {
                rZeroLevel = multiplyDefs(raiseDefToDef(def.point[0], a), raiseDefToDef(def.point[1], b));
            } else if (def.hasOwnProperty('budgetLine')) {
                const bl = new EconBudgetLine(def.budgetLine, null);
                rZeroLevel = multiplyDefs(raiseDefToDef(multiplyDefs(a, bl.xIntercept), a), raiseDefToDef(multiplyDefs(b, bl.yIntercept), b));
            } else {
                console.log('must provide either a level, point, or budget line to draw an indifference curve')
            }

            this.fillBelowRect = {
                x1: 0,
                x2: level,
                y1: 0,
                y2: level,
                show: def.show
            };
            return [
                {
                    "fn": `((${r} == 0) ? (${rZeroLevel}/x^(${a}))^(1/(${b})) : ((${level}^${r} - ${a}*x^${r})/${b})^(1/${r}))`,
                    "ind": "x",
                    "min": level,
                    "samplePoints": 60
                },
                {
                    "fn": `((${r} == 0) ? (${rZeroLevel}/y^(${b}))^(1/(${a})) : ((${level}^${r} - ${b}*y^${r})/${a})^(1/${r}))`,
                    "ind": "y",
                    "min": level,
                    "samplePoints": 60
                }
            ]
        }

        // see http://www.gamsworld.org/mpsge/debreu/ces.pdf
        optimalBundle(budgetLine: EconBudgetLine) {
            const s = this.s,
                oneMinusS = subtractDefs(1, s),
                a = this.alpha,
                oneMinusA = subtractDefs(1, a),
                theta = divideDefs(budgetLine.m, addDefs(multiplyDefs(raiseDefToDef(a, s), raiseDefToDef(budgetLine.p1, oneMinusS)), multiplyDefs(raiseDefToDef(oneMinusA, s), raiseDefToDef(budgetLine.p2, oneMinusS)))),
                optimalX1 = `(${this.r} == 0) ? ${multiplyDefs(a, budgetLine.xIntercept)} : ${multiplyDefs(raiseDefToDef(divideDefs(a, budgetLine.p1), s), theta)}`,
                optimalX2 = `(${this.r} == 0) ? ${multiplyDefs(oneMinusA, budgetLine.yIntercept)} : ${multiplyDefs(raiseDefToDef(divideDefs(oneMinusA, budgetLine.p2), s), theta)}`;
            return [optimalX1, optimalX2];
        }


    }

    export class EllipseFunction extends UtilityFunction {

        value(x) {
            const c = this.coefficients;
            return `(${c[0]})*(${x[0]})^2+(${c[1]})*(${x[1]})^2`;
        }

        levelSet(def) {

            const c = this.coefficients,
                level = def.level || this.value(def.point),
                max = `((${level})/(${c[0]}+${c[1]}))^(0.5)`;
            this.fillAboveRect = {
                x1: max,
                x2: 50,
                y1: max,
                y2: 50,
                show: def.show
            };
            return [
                {
                    "fn": `((${level}-(${c[1]})*y*y)/(${c[0]}))^(0.5)`,
                    "ind": "y",
                    "min": 0,
                    "max": max,
                    "samplePoints": 30
                },
                {
                    "fn": `((${level}-(${c[0]})*x*x)/(${c[1]}))^(0.5)`,
                    "ind": "x",
                    "min": 0,
                    "max": max,
                    "samplePoints": 30
                }
            ]
        }
    }

    export class LinearFunction extends UtilityFunction {

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

    export class MinFunction extends UtilityFunction {

        constructor(def) {
            super(def);
            let fn = this;
            fn.interpolation = 'curveLinear';
            if (def.hasOwnProperty('alpha')) {
                fn.coefficients = [divideDefs(0.5, def.alpha), divideDefs(0.5, subtractDefs(1, def.alpha))];
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

    export function getUtilityFunction(def) {
        if (def.type == 'CobbDouglas') {
            return new KGAuthor.CobbDouglasFunction(def.def)
        } else if (def.type == 'Substitutes' || def.type == 'PerfectSubstitutes') {
            return new KGAuthor.LinearFunction(def.def)
        } else if (def.type == 'Complements' || def.type == 'PerfectComplements') {
            return new KGAuthor.MinFunction(def.def)
        } else if (def.type == 'Concave') {
            return new KGAuthor.EllipseFunction(def.def)
        } else if (def.type == 'Quasilinear') {
            return new KGAuthor.QuasilinearFunction(def.def)
        } else if (def.type == 'CES') {
            return new KGAuthor.CES(def.def)
        }
    }
}