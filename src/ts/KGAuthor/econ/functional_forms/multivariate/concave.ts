/// <reference path="../../eg.ts"/>


module KGAuthor {

    export class ConcaveFunction extends EconMultivariateFunction {

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
                    "fn": `((${level}-(${c[1]})*(y)*(y))/(${c[0]}))^(0.5)`,
                    "ind": "y",
                    "min": 0,
                    "max": max,
                    "samplePoints": 30
                },
                {
                    "fn": `((${level}-(${c[0]})*(x)*(x))/(${c[1]}))^(0.5)`,
                    "ind": "x",
                    "min": 0,
                    "max": max,
                    "samplePoints": 30
                }
            ]
        }
    }

}