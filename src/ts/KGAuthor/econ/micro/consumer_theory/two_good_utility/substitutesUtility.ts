/// <reference path="../../../eg.ts"/>


module KGAuthor {

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
}