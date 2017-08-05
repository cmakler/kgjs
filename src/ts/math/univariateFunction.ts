/// <reference path="../kg.ts" />

module KG {

    export interface UnivariateFunctionDefinition extends ViewObjectDefinition {
        fn: string;
        ind?: string;
        samplePoints?: any;
    }

    export interface IUnivariateFunction {
        eval: (input: number) => number;
        dataPoints: (min: number, max: number) => { x: number, y: number }[]
    }

    export class UnivariateFunction extends UpdateListener implements IUnivariateFunction {

        private fn;
        private scope;
        private compiledFunction;
        private ind;
        private samplePoints;

        constructor(def: UnivariateFunctionDefinition) {

            // establish property defaults
            def = _.defaults(def, {
                ind: 'x',
                samplePoints: 50,
                constants: [],
                updatables: []
            });

            // define updatable properties
            def.constants = def.constants.concat(['samplePoints', 'ind', 'fn']);

            super(def);

            this.compiledFunction = math.compile(def.fn);
        }

        eval(input) {
            let fn = this;
            fn.scope = fn.scope || {params: fn.model.currentParamValues()};
            fn.scope[fn.ind] = input;
            return fn.compiledFunction.eval(fn.scope);
        }

        dataPoints(min, max) {
            let fn = this,
                data = [];
            for (let i = 0; i < fn.samplePoints; i++) {
                let a = i / fn.samplePoints,
                    input = a * min + (1 - a) * max,
                    output = fn.eval(input);
                data.push((fn.ind == 'x') ? {x: input, y: output} : {x: output, y: input});
            }
            return data;
        }

        update(force) {
            let fn = this;
            fn.scope = {params: fn.model.currentParamValues()};
            return fn;
        }

    }
}