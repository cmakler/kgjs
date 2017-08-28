/// <reference path="../kg.ts" />

module KG {

    export interface UnivariateFunctionDefinition extends ViewObjectDefinition {
        fn: string;
        ind?: string;
        samplePoints?: any;
    }

    export interface IUnivariateFunction {
        eval: (input: number) => number;
        dataPoints: (min?: number, max?: number) => { x: number, y: number }[]
    }

    export class UnivariateFunction extends UpdateListener implements IUnivariateFunction {

        private fn;
        private scope;
        private compiledFunction;
        public ind;
        private samplePoints;
        private min;
        private max;

        constructor(def: UnivariateFunctionDefinition) {

            // establish property defaults
            def = defaults(def, {
                ind: 'x',
                samplePoints: 50,
                constants: [],
                updatables: []
            });

            // define updatable properties
            def.constants = def.constants.concat(['samplePoints', 'ind', 'fn']);
            def.updatables = def.updatables.concat(['min','max']);

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
            min = fn.min || min;
            max = fn.max || max;
            for (let i = 0; i < fn.samplePoints + 1; i++) {
                let a = i / fn.samplePoints,
                    input = a * min + (1 - a) * max,
                    output = fn.eval(input);
                data.push((fn.ind == 'x') ? {x: input, y: output} : {x: output, y: input});
            }
            return data;
        }

        update(force) {
            let fn = super.update(force);
            fn.scope = {params: fn.model.currentParamValues()};
            return fn;
        }

    }
}