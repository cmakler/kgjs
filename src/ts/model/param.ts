/// <reference path="model.ts" />

module KG {

    export interface IParam {
        value: any;
        min: any;
        max: any;
        round: any;
        precision: any;
    }

    export class Param implements IParam {

        public value;
        public min;
        public max;
        public round;
        public precision;


        constructor(def) {

            function decimalPlaces(numAsString) {
                let match = ('' + numAsString).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
                if (!match) {
                    return 0;
                }
                return Math.max(
                    0,
                    // Number of digits right of decimal point.
                    (match[1] ? match[1].length : 0)
                    // Adjust for scientific notation.
                    - (match[2] ? +match[2] : 0));
            }

            this.value = def.value;
            this.min = def.min || 0;
            this.max = def.max || 10;
            this.round = def.round || 1;
            this.precision = def.precision || decimalPlaces(this.round.toString());

            console.log('initialized param object: ', this);
        }

        // Receives an instruction to update the parameter to a new value
        // Updates to the closest rounded value to the desired newValue within accepted range
        update(newValue) {
            let param = this;
            if (newValue < param.min) {
                param.value = param.min;
            }
            else if (newValue > param.max) {
                param.value = param.max;
            }
            else {
                param.value = Math.round(newValue / param.round) * param.round;
            }
        }

        // Displays current value of the parameter to desired precision
        // If no precision is given, uses the implied precision given by the rounding parameter
        formatted(precision) {
            precision = precision || this.precision;
            return d3.format(`.${precision}f`)(this.value);
        }

        // Creates a D3 scale for use by a scrubbable number. Uses a domain of (-100,100) by default.
        positionToValue(domain?: number) {
            domain = domain || 100;
            let param = this;
            return d3.scaleLinear()
                .clamp(true)
                .domain([domain * -1, domain])
                .range([param.min, param.max]);
        }
    }

}