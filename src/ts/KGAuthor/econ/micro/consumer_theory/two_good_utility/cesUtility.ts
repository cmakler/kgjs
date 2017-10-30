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

        parseSelf(parsedData) {
            const u = this,
                a = getDefinitionProperty(u.alpha),
                r = getDefinitionProperty(u.r),
                b = subtractDefs(1, u.alpha);
            parsedData.calcs[u.name] = {
                xFunction: 'foo'
            }
            return parsedData;
        }

        value(x) {
            const c = this.coefficients,
                r = this.r;
            return "((params.r == 0) ? (" + multiplyDefs(raiseDefToDef(x[0], c[0]), raiseDefToDef(x[1], c[1])) + ") : (" + raiseDefToDef(addDefs(multiplyDefs(c[0], raiseDefToDef(x[0], r)), multiplyDefs(c[1], raiseDefToDef(x[1], r))), divideDefs(1, r)) + "))";
        }

        levelSet(def) {
            const u = this,
                a = getDefinitionProperty(u.alpha),
                r = getDefinitionProperty(u.r),
                b = subtractDefs(1, u.alpha),
                level = this.extractLevel(def);

            this.fillBelowRect = {
                x1: 0,
                x2: level,
                y1: 0,
                y2: level,
                show: def.show
            };
            return [
                {
                    "fn": `((${r} == 0) ? (${level}/x^(${a}))^(1/(${b})) : ((${level}^${r} - ${a}*x^${r})/${b})^(1/${r}))`,
                    "ind": "x",
                    "min": level,
                    "samplePoints": 60
                },
                {
                    "fn": `((${r} == 0) ? (${level}/y^( ${b}))^(1/(${a})) : ((${level}^${r} - ${b}*y^${r})/${a})^(1/${r}))`,
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

        denominator(p1, p2) {
            const a1 = this.alpha,
                a2 = subtractDefs(1, a1),
                r = this.r,
                pOverA1 = divideDefs(p1, a1),
                pOverA2 = divideDefs(p2, a2),
                oneOverR = divideDefs(1, r),
                rOverRminusOne = divideDefs(r, subtractDefs(r, 1));

            return raiseDefToDef(addDefs(
                multiplyDefs(
                    a1,
                    raiseDefToDef(pOverA1, rOverRminusOne)
                ),
                multiplyDefs(
                    a2,
                    raiseDefToDef(pOverA2, rOverRminusOne)
                )
            ), oneOverR)
        }

        // see http://personal.stthomas.edu/csmarcott/ec418/ces_cost_minimization.pdf
        lowestCostBundle(level: (string | number), prices: (string | number)[]) {
            const a1 = this.alpha,
                a2 = subtractDefs(1, a1),
                p1 = prices[0],
                p2 = prices[1],
                r = this.r,
                pOverA1 = divideDefs(p1, a1),
                pOverA2 = divideDefs(p2, a2),
                oneOverRminusOne = divideDefs(1, subtractDefs(r, 1)),
                denominator = this.denominator(p1,p2),
                numerator1 = raiseDefToDef(pOverA1, oneOverRminusOne),
                numerator2 = raiseDefToDef(pOverA2, oneOverRminusOne);

            console.log('denominator', denominator);
            console.log('numerator1', numerator1);
            console.log('numerator2', numerator2);


            return [
                divideDefs(
                    multiplyDefs(level, numerator1),
                    denominator
                ),
                divideDefs(
                    multiplyDefs(level, numerator2),
                    denominator
                )]
        }


    }


}