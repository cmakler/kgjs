/// <reference path="model.ts" />

module KG {

    export interface ParamDefinition {
        name: string;     // how to refer to this parameter; e.g. if name is "x", you would refer to this as "params.x"
        label: string;    // what to label a slider that controls this param
        value: any;       // initial value (either a number or true/false)
        min?: any;        // if param is a number, lowest acceptable value; also sets left bound of a slider
        max?: any;        // ditto for max
        round?: any;      // interval to snap to as user changes 
        precision?: any;  // number of decimal places to display value to; automatically sets itself based on "round" - i.e., if round = 0.01 then precision will automatically choose 2 decimal places
    }

    export interface IParam {
        name: string;
        label: string;
        value: number;
        update: (newValue: any) => any;
        formatted: (precision?: number) => string;
    }

    export class Param implements IParam {

        public name: string;
        public label: string;
        public value: any;
        public min: number;
        public max: number;
        public round: number;
        public precision: number;

        constructor(def: ParamDefinition) {

            function decimalPlaces(numAsString: string) {
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

            setDefaults(def, {min: 0, max: 10, round: 1, label: ''});

            this.name = def.name;
            this.label = def.label;

            if (typeof def.value == 'boolean') {
                this.value = +def.value;
                this.min = 0;
                this.max = 100;
                this.round = 1;
            } else {
                this.value = parseFloat(def.value);
                this.min = parseFloat(def.min);
                this.max = parseFloat(def.max);
                this.round = parseFloat(def.round);
                this.precision = parseInt(def.precision) || decimalPlaces(this.round.toString());
            }

        }

        // Receives an instruction to update the parameter to a new value
        // Updates to the closest rounded value to the desired newValue within accepted range
        update(newValue: any) {
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
        formatted(precision?: number) {
            precision = precision || this.precision;
            return d3.format(`.${precision}f`)(this.value);
        }

    }

}