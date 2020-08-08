/// <reference path="../kg.ts" />

module KG {

    import MathFunction = KG.MathFunction;

    export interface UnivariateFunctionDefinition extends MathFunctionDefinition {
        fn: string; // y as a function of x
        fnZ?: string; // z as a function of x
        yFn?: string; // x as a function of y
        yFnZ?: string; // z as a function of y
        ind?: string; // which variable is independent?
    }

    export interface IUnivariateFunction extends IMathFunction {
        evaluate: (input: number, z?: boolean) => number;
        mathboxFn: (maxY, maxZ, minY?, minZ?) => (emit: (y: number, z: number, x: number) => any, x: number, y?: number, i?: number, j?: number, t?: number) => void;
        generateData: (min?: number, max?: number) => { x: number, y: number }[]
    }

    export class UnivariateFunction extends MathFunction implements IUnivariateFunction {

        private fn;
        private yFn;
        private fnZ;
        private yFnZ;
        private compiledFunction;
        private yCompiledFunction;
        private zCompiledFunction;
        private yzCompiledFunction;
        public ind;
        public fnString: string;
        public yFnString: string;
        public fnZString: string;
        public yFnZString: string;
        public fnStringDef;
        public yFnStringDef;
        public fnZStringDef;
        public yFnZStringDef;

        constructor(def: UnivariateFunctionDefinition) {

            setDefaults(def, {
                ind: 'x'
            });
            setProperties(def, 'constants', ['fn', 'yFn']);
            setProperties(def, 'updatables', ['ind', 'min', 'max']);
            super(def);
            this.fnStringDef = def.fn;
            this.fnZStringDef = def.fnZ;
            this.yFnStringDef = def.yFn;
            this.yFnZStringDef = def.yFnZ;
        }

        evaluate(input, z?: boolean) {
            let fn = this;
            if (z) {
                if (fn.hasOwnProperty('yzCompiledFunction') && fn.ind == 'y') {
                    return fn.yzCompiledFunction.evaluate({y: input});
                } else if (fn.hasOwnProperty('zCompiledFunction') && fn.ind == 'y') {
                    return fn.zCompiledFunction.evaluate({y: input});
                } else if (fn.hasOwnProperty('zCompiledFunction')) {
                    return fn.zCompiledFunction.evaluate({x: input});
                }
            } else {
                if (fn.hasOwnProperty('yCompiledFunction') && fn.ind == 'y') {
                    return fn.yCompiledFunction.evaluate({y: input});
                } else if (fn.hasOwnProperty('compiledFunction') && fn.ind == 'y') {
                    return fn.compiledFunction.evaluate({y: input});
                } else if (fn.hasOwnProperty('compiledFunction')) {
                    return fn.compiledFunction.evaluate({x: input});
                }
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
                    output = fn.evaluate(input);
                if (!isNaN(output) && output != Infinity && output != -Infinity) {
                    data.push((fn.ind == 'x') ? {x: input, y: output} : {x: output, y: input});
                }
            }
            this.data = data;
            return data;
        }

        mathboxFn(mathbox: Mathbox) {
            const fn = this;
            if (fn.ind == 'y') {
                return function (emit, y) {
                    const x = fn.evaluate(y),
                        z = fn.evaluate(y, true);
                    if (x >= mathbox.xAxis.min && x <= mathbox.xAxis.max && z >= mathbox.zAxis.min && z <= mathbox.zAxis.max) {
                        emit(y, z, x);
                    }
                };
            } else {
                return function (emit, x) {
                    const y = fn.evaluate(x),
                        z = fn.evaluate(x, true);
                    if (y >= mathbox.yAxis.min && y <= mathbox.yAxis.max && z >= mathbox.zAxis.min && z <= mathbox.zAxis.max) {
                        emit(y, z, x);
                    }

                };
            }

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
            if (fn.def.hasOwnProperty('fnZ')) {
                if (fn.fnZString != fn.updateFunctionString(fn.fnZStringDef, fn.scope)) {
                    fn.hasChanged = true;
                    fn.fnZString = fn.updateFunctionString(fn.fnZStringDef, fn.scope);
                    fn.zCompiledFunction = math.compile(fn.fnZString);
                }
            }
            if (fn.def.hasOwnProperty('yFnZ')) {
                if (fn.yFnZString != fn.updateFunctionString(fn.yFnZStringDef, fn.scope)) {
                    fn.hasChanged = true;
                    fn.yFnZString = fn.updateFunctionString(fn.yFnZStringDef, fn.scope);
                    fn.yzCompiledFunction = math.compile(fn.yFnZString);
                }
            }
            return fn;
        }

    }
}