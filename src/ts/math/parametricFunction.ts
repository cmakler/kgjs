/// <reference path="../kg.ts" />

module KG {

    export interface ParametricFunctionDefinition extends MathFunctionDefinition {
        xFunction: string;
        yFunction: string;
    }

    export interface IParametricFunction extends IMathFunction {
        eval: (input: number) => { x: number, y: number };
        generateData: (min?: number, max?: number) => { x: number, y: number }[]
    }

    export class ParametricFunction extends MathFunction implements IParametricFunction {

        private xCompiledFunction;
        private yCompiledFunction;

        constructor(def: ParametricFunctionDefinition) {

            setDefaults(def, {
                min: 0,
                max: 10
            });
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
            if(undefined != fn.min) {
                min = fn.min;
            }
            if(undefined != fn.max) {
                max = fn.max;
            }
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