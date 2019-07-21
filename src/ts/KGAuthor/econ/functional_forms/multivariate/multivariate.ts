/// <reference path="../../eg.ts"/>


module KGAuthor {

    export interface IMultivariateFunction {

        value: (x: any[]) => any;

        levelSet: (def: any, graph: Graph) => KG.UnivariateFunctionDefinition[];
        levelCurve: (def: any, graph: Graph) => Curve[];
        levelCurveSlope: (x: any[]) => any;

        // used for consumer theory

        optimalBundle: (budgetLine: EconBudgetLine) => any[];
        lagrangeBundle: (budgetLine: EconBudgetLine) => any[];
        cornerCondition: (budgetLine: EconBudgetLine) => string;
        lowestCostBundle: (level: (string | number), prices: (string | number)[]) => false | any[];

        demandFunction: (budgetLine: EconBudgetLine, good: number, graph: Graph) => KG.UnivariateFunctionDefinition[];
        demandCurve: (budgetLine: EconBudgetLine, good: number, def: any, graph: Graph) => Curve[];

        indirectUtility: (income: (string | number), prices: (string | number)[]) => any;
        expenditure: (level: (string | number), prices: (string | number)[]) => any;


    }

    export class EconMultivariateFunction extends AuthoringObject implements IMultivariateFunction {

        public alpha;
        public coefficients;
        public exponents;
        public interpolation;
        public fillBelowRect;
        public fillAboveRect;

        constructor(def) {
            KG.setDefaults(def, {
                name: KG.randomString(10)
            });
            super(def);
            let fn = this;
            fn.interpolation = 'curveMonotoneX';
            if (def.hasOwnProperty('alpha')) {
                fn.alpha = def.alpha;
                fn.exponents = def.exponents || [def.alpha, subtractDefs(1, def.alpha)];
                fn.coefficients = def.coefficients || [def.alpha, subtractDefs(1, def.alpha)];
            } else if (def.hasOwnProperty('exponents')) {
                fn.exponents = def.exponents;
                fn.alpha = divideDefs(fn.exponents[0], addDefs(fn.exponents[0], fn.exponents[1]));
                fn.coefficients = def.coefficients;
            } else if (def.hasOwnProperty('coefficients')) {
                fn.exponents = def.coefficients;
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

        levelCurveSlope(x) {
            return null;
        }

        areaBelowLevelCurve(def, graph) {
            const fn = this;
            fn.fillBelowRect = null;
            def.interpolation = fn.interpolation;
            const fns = fn.levelSet(def);
            let objs = [];
            fns.forEach(function (fn) {
                let areaDef = copyJSON(def);
                areaDef.univariateFunction1 = fn;
                objs.push(new Area(areaDef, graph));
            });
            if (fn.fillBelowRect) {
                fn.fillBelowRect.show = def.show;
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
                let areaDef = copyJSON(def);
                areaDef.univariateFunction1 = fn;
                areaDef.above = true;
                objs.push(new Area(areaDef, graph));
            });
            if (fn.fillAboveRect) {
                fn.fillAboveRect.show = def.show;
                fn.fillAboveRect.fill = def.fill;
                fn.fillAboveRect.inDef = true;
                objs.push(new Rectangle(fn.fillAboveRect, graph));
            }
            const clipPathName = def.hasOwnProperty('name') ? def.name + "_above" : KG.randomString(10);
            return [
                new Rectangle({
                    clipPathName: clipPathName,
                    x1: graph.def.xAxis.min,
                    x2: graph.def.xAxis.max,
                    y1: graph.def.yAxis.min,
                    y2: graph.def.yAxis.max,
                    fill: def.fill,
                    show: def.show
                }, graph),
                new ClipPath({
                    "name": clipPathName,
                    "paths": objs
                }, graph)
            ]
        }

        lowestCostBundle(level: (string | number), prices: (string | number)[]) {
            return [];// defined at the subclass level
        }

        /* Optimization with an exogenous income */

        cornerCondition(budgetLine: EconBudgetLine) {
            return 'false';
        }

        lagrangeBundle(budgetLine: EconBudgetLine) {
            return [];
        }

        optimalBundle(budgetLine: EconBudgetLine) {
            return [];
        }

        quantityDemanded(budgetLine, good) {
            return this.optimalBundle(budgetLine)[good - 1];
        }

        priceOfferFunction(budgetLine: EconBudgetLine, good: number, min: number, max: number, graph) {
            const u = this;
            let blDef;
            if (budgetLine.hasOwnProperty('point') && budgetLine.point != undefined) {
                min = 0.01;
                max = 0.99;
                blDef = {
                    p1: '(t)',
                    p2: '1 - (t)',
                    m: `${budgetLine.point[0]}*(t) + ${budgetLine.point[1]}*(1-(t))`
                }
            } else {
                blDef = (good == 1) ? {p1: '(t)', p2: budgetLine.p2, m: budgetLine.m} : {
                    p1: budgetLine.p1,
                    p2: '(t)',
                    m: budgetLine.m
                }
            }
            const optimalBundle = u.optimalBundle(new EconBudgetLine(blDef, graph));
            return [
                {
                    xFunction: optimalBundle[0],
                    yFunction: optimalBundle[1],
                    min: min,
                    max: max,
                    samplePoints: 100,
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
                blDef = (good == 1) ? {p1: '(y)', p2: budgetLine.p2, m: budgetLine.m} : {
                    p1: budgetLine.p1,
                    p2: '(y)',
                    m: budgetLine.m
                };
            return [
                {
                    "fn": u.quantityDemanded(new EconBudgetLine(blDef, graph), good),
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

        /* Net demand and supply from an endowment */

        endowmentDemandFunction(budgetLine: EconBudgetLine, good: number, graph) {
            const u = this;
            let netDemand = '',
                netSupply = '',
                grossDemand = '';
            const x1 = budgetLine.point[0],
                x2 = budgetLine.point[1];
            if (good == 2) {
                const optimalBundle = u.optimalBundle(new EconBudgetLine({
                    p1: budgetLine.p1,
                    p2: '(y)',
                    m: `(${x1}*${budgetLine.p1} + ${x2}*(y))`
                }, graph));
                grossDemand = optimalBundle[1];
                netDemand = subtractDefs(grossDemand, x2);
                netSupply = subtractDefs(x2, grossDemand);
            } else {
                const optimalBundle = u.optimalBundle(new EconBudgetLine({
                    p1: '(y)',
                    p2: budgetLine.p2,
                    m: `(${x1}*(y) + ${x2}*${budgetLine.p2})`
                }, graph));
                grossDemand = optimalBundle[0];
                netDemand = subtractDefs(grossDemand, x1);
                netSupply = subtractDefs(x1, grossDemand);
            }

            return {
                grossDemand: [
                    {
                        fn: grossDemand,
                        ind: 'y'
                    }
                ],
                netDemand: [
                    {
                        fn: netDemand,
                        ind: 'y'
                    }
                ],
                netSupply: [
                    {
                        fn: netSupply,
                        ind: 'y'
                    }
                ]
            }
        }

        grossDemandCurve(budgetLine, good, def, graph) {
            const u = this;
            def.interpolation = 'curveMonotoneX';
            return curvesFromFunctions(u.endowmentDemandFunction(budgetLine, good, graph).grossDemand, def, graph);
        }

        netDemandCurve(budgetLine, good, def, graph) {
            const u = this;
            def.interpolation = 'curveMonotoneX';
            return curvesFromFunctions(u.endowmentDemandFunction(budgetLine, good, graph).netDemand, def, graph);
        }

        netSupplyCurve(budgetLine, good, def, graph) {
            const u = this;
            def.interpolation = 'curveMonotoneX';
            return curvesFromFunctions(u.endowmentDemandFunction(budgetLine, good, graph).netSupply, def, graph);
        }


        indirectUtility(income: (string | number), prices: (string | number)[]) {
            return this.extractLevel({budgetLine: {p1: prices[0], p2: prices[1], m: income}});
        }

        expenditure(level: (string | number), prices: (string | number)[]) {
            const b = this.lowestCostBundle(level, prices);
            return addDefs(multiplyDefs(b[0], prices[0]), multiplyDefs(b[1], prices[1]));
        }

        laborRequirement(level: (string | number), capital: (string | number)) {
            // defined at subclass level
        }


    }

}