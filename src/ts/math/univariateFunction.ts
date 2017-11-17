/// <reference path="../kg.ts" />

module KG {

    export interface UnivariateFunctionDefinition extends ViewObjectDefinition {
        fn: string;
        yFn?: string;
        ind?: string;
        samplePoints?: any;
    }

    export interface IUnivariateFunction {
        eval: (input: number) => number;
        generateData: (min?: number, max?: number) => { x: number, y: number }[]
    }

    export class UnivariateFunction extends UpdateListener implements IUnivariateFunction {

        private fn;
        private yFn;
        private yCompiledFunction;
        private scope;
        private compiledFunction;
        public ind;
        private samplePoints;
        private min;
        private max;
        public data;

        constructor(def: UnivariateFunctionDefinition) {

            setDefaults(def, {
                ind: 'x',
                samplePoints: 50
            });
            setProperties(def, 'constants', ['samplePoints', 'fn', 'yFn']);
            setProperties(def, 'updatables', ['min', 'max', 'ind']);
            super(def);

            this.compiledFunction = math.compile(def.fn);
            if(def.hasOwnProperty('yFn')) {
                this.yCompiledFunction = math.compile(def.yFn);
            }
        }

        eval(input) {
            let fn = this;
            // collect current values in a scope object
            const scope = {
                params: fn.model.currentParamValues,
                calcs: fn.model.currentCalcValues,
                colors: fn.model.currentColors
            };
            fn.scope = fn.scope || scope;
            fn.scope[fn.ind] = input;
            if(fn.hasOwnProperty('yCompiledFunction') && fn.ind == 'y') {
                return fn.yCompiledFunction.eval(fn.scope)
            } else {
                return fn.compiledFunction.eval(fn.scope);
            }
        }

        generateData(min, max) {
            let fn = this,
                data = [];
            min = fn.min || min;
            max = fn.max || max;
            for (let i = 0; i < fn.samplePoints + 1; i++) {
                let a = i / fn.samplePoints,
                    input = a * min + (1 - a) * max,
                    output = fn.eval(input);
                if (!isNaN(output) && output != Infinity && output != -Infinity) {
                    data.push((fn.ind == 'x') ? {x: input, y: output} : {x: output, y: input});
                }
            }
            this.data = data;
            return data;
        }

        update(force) {
            let fn = super.update(force);
            fn.scope = {
                params: fn.model.currentParamValues,
                calcs: fn.model.currentCalcValues,
                colors: fn.model.currentColors
            };
            return fn;
        }

    }
}