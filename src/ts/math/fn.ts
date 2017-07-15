/// <reference path="../kg.ts" />

module KG {

    export interface UnivariateFunctionDefinition extends ViewObjectDefinition {
        fn: string;
        ind?: string;
        samplePoints?: any;
    }

    export interface IUnivariateFunction {
        eval: (input: number) => number;
        dataPoints: (min: number, max: number) => { x: number, y: number }
    }

    export class UnivariateFunction extends UpdateListener {

        private fn;
        private ind;
        private samplePoints;

        constructor(def: UnivariateFunctionDefinition) {

            // establish property defaults
            def = _.defaults(def, {
                ind: 'x',
                samplePoints: 30,
                constants: [],
                updatables: []
            });

            // define updatable properties
            def.constants = def.constants.concat(['samplePoints', 'ind', 'fn']);
            //def.updatables = def.updatables.concat(['fn']);

            super(def);
        }

        eval(input) {
            const fn = this,
                compiledFunction = math.compile(fn.fn);
            let scope: any = {params: fn.model.currentParamValues()};
            scope[fn.ind] = input;
            return compiledFunction.eval(scope);
        }

        dataPoints(min, max) {
            let fn = this,
                data = [];
            const compiledFunction = math.compile(fn.fn),
                params = fn.model.currentParamValues();
            for (let i = 0; i < fn.samplePoints; i++) {
                let a = i / fn.samplePoints,
                    input = a * min + (1 - a) * max,
                    output = fn.eval(input);
                data.push((fn.ind == 'x') ? {x: input, y: output} : {x: output, y: input});
            }
            return data;

        }
    }
}