/// <reference path="../../../eg.ts"/>


module KGAuthor {

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
        
        expenditure(level:(string|number), prices: (string|number)[]) {
            const s = this.s,
                oneMinusS = subtractDefs(1, s),
                a = this.alpha,
                oneMinusA = subtractDefs(1, a);

            return multiplyDefs(raiseDefToDef(
                addDefs(
                    multiplyDefs(raiseDefToDef(a, s), raiseDefToDef(prices[0], oneMinusS)),
                    multiplyDefs(raiseDefToDef(oneMinusA, s), raiseDefToDef(prices[1], oneMinusS))
                ),divideDefs(1,oneMinusS)
            ),level);

        }


    }


}