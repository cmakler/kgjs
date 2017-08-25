/// <reference path="model.ts" />

module KG {

    export interface ParamDefinition {
        name: string;
        label: string;
        value: any;
        min?: any;
        max?: any;
        round?: any;
        precision?: any;
    }

    export interface IParam {
        name: string;
        label: string;
        value: number;
        update: (newValue: any) => any;
        formatted: (precision?: number) => string;
        paramScale: (domain?: number) => d3.ScaleLinear<Number, Number>;
    }

    export class Param implements IParam {

        public name: string;
        public label: string;
        public value: any;
        public min: number;
        public max: number;
        public round: number;
        public precision: number;

        constructor(def:ParamDefinition) {

            function decimalPlaces(numAsString:string) {
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

            def = _.defaults(def,{min: 0, max: 10, round: 1});

            this.name = def.name;
            this.label = def.label || '';
            this.value = parseFloat(def.value);
            this.min = parseFloat(def.min);
            this.max = parseFloat(def.max);
            this.round = parseFloat(def.round);
            this.precision = parseInt(def.precision) || decimalPlaces(this.round.toString());

            //console.log('initialized param object: ', this);
        }

        // Receives an instruction to update the parameter to a new value
        // Updates to the closest rounded value to the desired newValue within accepted range
        update(newValue:any) {
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
            return param.value;
        }

        // Displays current value of the parameter to desired precision
        // If no precision is given, uses the implied precision given by the rounding parameter
        formatted(precision?:number) {
            precision = precision || this.precision;
            return d3.format(`.${precision}f`)(this.value);
        }

        // Creates a D3 scale for use by a scrubbable number. Uses a domain of (-100,100) by default.
        paramScale(domain?: number) {
            domain = domain || 100;
            let param = this;
            return d3.scaleLinear()
                .clamp(true)
                .domain([domain * -1, domain])
                .range([param.min, param.max]);
        }
    }

}