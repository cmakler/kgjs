/// <reference path="../kg.ts" />

module KG {

    export interface ParametricFunctionDefinition extends MathFunctionDefinition {
        xFunction: string;
        yFunction: string;
    }

    export interface IParametricFunction extends IMathFunction {
        evaluate: (input: number) => { x: number, y: number };
        generateData: (min?: number, max?: number) => { x: number, y: number }[]
    }

    export class ParametricFunction extends MathFunction implements IParametricFunction {

        private xFunctionString;
        private yFunctionString;
        private xFunctionStringDef;
        private yFunctionStringDef;
        private xCompiledFunction;
        private yCompiledFunction;

        constructor(def: ParametricFunctionDefinition) {

            setDefaults(def, {
                min: 0,
                max: 10
            });
            super(def);

            this.xFunctionStringDef = def.xFunction;
            this.yFunctionStringDef = def.yFunction;
        }

        evaluate(input) {
            let fn = this;
            fn.scope = fn.scope || {params: fn.model.currentParamValues};
            fn.scope.t = input;
            return {x: fn.xCompiledFunction.evaluate(fn.scope), y: fn.yCompiledFunction.evaluate(fn.scope)};
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
                    output = fn.evaluate(input);
                if (!isNaN(output.x) && output.x != Infinity && output.x != -Infinity && !isNaN(output.y) && output.y != Infinity && output.y != -Infinity) {
                    data.push(output);
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
            const originalXFunctionString = fn.xFunctionString;
            if (originalXFunctionString != fn.updateFunctionString(fn.xFunctionStringDef, fn.scope)) {
                fn.hasChanged = true;
                fn.xFunctionString = fn.updateFunctionString(fn.xFunctionStringDef, fn.scope);
                fn.xCompiledFunction = math.compile(fn.xFunctionString);
            }
            const originalYFunctionString = fn.yFunctionString;
            if (originalYFunctionString != fn.updateFunctionString(fn.yFunctionStringDef, fn.scope)) {
                fn.hasChanged = true;
                fn.yFunctionString = fn.updateFunctionString(fn.yFunctionStringDef, fn.scope);
                fn.yCompiledFunction = math.compile(fn.yFunctionString);
            }
            return fn;
        }

    }
}