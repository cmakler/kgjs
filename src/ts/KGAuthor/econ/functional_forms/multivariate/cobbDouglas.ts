/// <reference path="../../eg.ts"/>


module KGAuthor {

    export class CobbDouglasFunction extends EconMultivariateFunction {

        value(x) {
            const e = this.exponents,
                scalar = this.coefficients.length == 1 ? this.coefficients[0] : 1;
            return `(${scalar}*(${x[0]})^(${e[0]}))*((${x[1]})^(${e[1]}))`;
        }

        levelSet(def) {
            const e = this.exponents,
                scalar = this.coefficients.length == 1 ? this.coefficients[0] : 1,
                level = divideDefs(this.extractLevel(def),scalar),
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
                    "fn": `((${level})/(y)^(${e[1]}))^(1/(${e[0]}))`,
                    "ind": "y",
                    "min": yMin,
                    "samplePoints": 30
                },
                {
                    "fn": `((${level})/(x)^(${e[0]}))^(1/(${e[1]}))`,
                    "ind": "x",
                    "min": xMin,
                    "samplePoints": 30
                }
            ]
        }

        levelCurveSlope(x) {
            const c = this.coefficients;
            return negativeDef(divideDefs(multiplyDefs(c[0], x[1]),multiplyDefs(c[1], x[0])));
        }

        optimalBundle(budgetLine: EconBudgetLine) {
            const a = this.alpha;
            return [multiplyDefs(a, budgetLine.xIntercept), multiplyDefs(subtractDefs(1, a), budgetLine.yIntercept)]
        }

        lowestCostBundle(level: (string | number), prices: (string | number)[]) {
            const e = this.exponents,
                ratio = multiplyDefs(
                    divideDefs(prices[0],prices[1]),
                    divideDefs(e[1],e[0])
                ),
                scale = addDefs(e[0],e[1]),
                scaledLevel = raiseDefToDef(level,divideDefs(1,scale));

            return [
                divideDefs(
                    scaledLevel,
                    raiseDefToDef(ratio,divideDefs(e[1],scale))
                ),
                multiplyDefs(
                    scaledLevel,
                    raiseDefToDef(ratio,divideDefs(e[0],scale))
                )
            ]

        }

        laborRequirement(level, capital) {
            const e = this.exponents;
            return `((${level})/(${capital})^(${e[1]}))^(1/(${e[0]}))`
        }
    }

}