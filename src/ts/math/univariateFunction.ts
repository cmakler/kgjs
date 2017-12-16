/// <reference path="../kg.ts" />

module KG {

    import MathFunction = KG.MathFunction;

    export interface UnivariateFunctionDefinition extends MathFunctionDefinition {
        fn: string;
        yFn?: string;
        ind?: string;
    }

    export interface IUnivariateFunction extends IMathFunction {
        eval: (input: number) => number;
        generateData: (min?: number, max?: number) => { x: number, y: number }[]
    }

    export class UnivariateFunction extends MathFunction implements IUnivariateFunction {

        private fn;
        private yFn;
        private yCompiledFunction;
        private compiledFunction;
        public ind;
        public fnStringDef;
        public yFnStringDef;

        constructor(def: UnivariateFunctionDefinition) {

            setDefaults(def, {
                ind: 'x'
            });
            setProperties(def, 'constants', ['fn', 'yFn']);
            setProperties(def, 'updatables', ['ind']);
            super(def);
            this.fnStringDef = def.fn;
            this.yFnStringDef = def.yFn;
        }

        eval(input) {
            let fn = this;
            if (fn.hasOwnProperty('yCompiledFunction') && fn.ind == 'y') {
                return fn.yCompiledFunction.eval({y: input});
            } else if (fn.ind == 'y') {
                return fn.compiledFunction.eval({y: input});
            } else {
                return fn.compiledFunction.eval({x: input});
            }
        }

        generateData(min, max) {
            let fn = this,
                data = [];
            if (undefined != fn.min) {
                min = fn.min;
            }
            if (undefined != fn.max) {
                max = fn.max;
            }
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
            //console.log('updating; currently ', fn.fnString);
            fn.scope = {
                params: fn.model.currentParamValues,
                calcs: fn.model.currentCalcValues,
                colors: fn.model.currentColors
            };
            const originalString = fn.fnString;
            if (originalString != fn.updateFunctionString(fn.fnStringDef, fn.scope)) {
                fn.hasChanged = true;
                fn.fnString = fn.updateFunctionString(fn.fnStringDef, fn.scope);
                fn.compiledFunction = math.compile(fn.fnString);
            }
            if (fn.def.hasOwnProperty('yFn')) {
                if (fn.yFnString != fn.updateFunctionString(fn.yFnStringDef, fn.scope)) {
                    fn.hasChanged = true;
                    fn.yFnString = fn.updateFunctionString(fn.yFnStringDef, fn.scope);
                    fn.yCompiledFunction = math.compile(fn.yFnString);
                }
            }
            return fn;
        }

    }
}