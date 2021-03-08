/// <reference path="../../eg.ts"/>


module KGAuthor {

    export class MinFunction extends EconMultivariateFunction {

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

        optimalBundle(budgetLine: EconBudgetLine) {
            const good1perBundle = invertDef(this.coefficients[0]),
                good2perBundle = invertDef(this.coefficients[1]),
                bundles = divideDefs(budgetLine.m, addDefs(
                    multiplyDefs(budgetLine.p1, good1perBundle),
                    multiplyDefs(budgetLine.p2, good2perBundle)
                ));
            return [multiplyDefs(good1perBundle, bundles), multiplyDefs(good2perBundle, bundles)]
        }

        lowestCostBundle(level: (string | number), prices: (string | number)[]) {
            const a = this.coefficients[0],
                b = this.coefficients[1];

            return [
                divideDefs(level, a),
                divideDefs(level, b)
            ]


        }
    }

}