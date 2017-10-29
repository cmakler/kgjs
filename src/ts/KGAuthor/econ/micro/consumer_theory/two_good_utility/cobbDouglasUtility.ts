/// <reference path="../../../eg.ts"/>


module KGAuthor {

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

}