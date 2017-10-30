/// <reference path="../kg.ts" />

module KG {

    export interface ParametricFunctionDefinition extends ViewObjectDefinition {
        xFunction: string;
        yFunction: string;
        min: any;
        max: any;
        samplePoints?: any;
        parametric: boolean;
    }

    export interface IParametricFunction {
        eval: (input: number) => { x: number, y: number };
        generateData: (min?: number, max?: number) => { x: number, y: number }[]
    }

    export class ParametricFunction extends UpdateListener implements IParametricFunction {

        private scope;
        private xCompiledFunction;
        private yCompiledFunction;
        public ind;
        private samplePoints;
        private min;
        private max;
        public data;

        constructor(def: ParametricFunctionDefinition) {

            setDefaults(def, {
                min: 0,
                max: 10,
                samplePoints: 50
            });
            setProperties(def, 'constants', ['samplePoints']);
            setProperties(def, 'updatables', ['min', 'max']);
            super(def);

            this.xCompiledFunction = math.compile(def.xFunction);
            this.yCompiledFunction = math.compile(def.yFunction);
        }

        eval(input) {
            let fn = this;
            fn.scope = fn.scope || {params: fn.model.currentParamValues};
            fn.scope.t = input;
            return {x: fn.xCompiledFunction.eval(fn.scope), y: fn.yCompiledFunction.eval(fn.scope)};
        }

        generateData(min?, max?) {
            let fn = this,
                data = [];
            min = fn.min || min;
            max = fn.max || max;
            for (let i = 0; i < fn.samplePoints + 1; i++) {
                let a = i / fn.samplePoints,
                    input = a * min + (1 - a) * max,
                    output = fn.eval(input);
                if (!isNaN(output.x) && output.x != Infinity && output.x != -Infinity && !isNaN(output.y) && output.y != Infinity && output.y != -Infinity) {
                    data.push(output);
                }
            }
            this.data = data;
            return data;
        }

        update(force) {
            let fn = super.update(force);
            fn.scope = {params: fn.model.currentParamValues};
            return fn;
        }

    }
}