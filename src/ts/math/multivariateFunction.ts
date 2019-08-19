/// <reference path="../kg.ts" />

module KG {

    import MathFunction = KG.MathFunction;

    export interface MultivariateFunctionDefinition extends MathFunctionDefinition {
        fn: string;
        domainCondition?: string;
    }

    export interface IMultivariateFunction extends IMathFunction {
        inDomain: (x: number, y: number, z: number) => boolean;
        eval: (x: number, y: number) => number;
        mathboxFn: (maxY, maxZ, minY?, minZ?) => (emit: (y: number, z: number, x: number) => any, x: number, y: number, i?: number, j?: number, t?: number) => void;
    }

    export class MultivariateFunction extends MathFunction implements IMultivariateFunction {

        private fn;
        private fnString;
        private domainConditionString;
        public fnStringDef;
        public domainConditionStringDef;
        private compiledFunction;
        private compiledDomainCondition;

        constructor(def: MultivariateFunctionDefinition) {
            def.samplePoints = 100;
            super(def);
            this.fnStringDef = def.fn;
            this.domainConditionStringDef = def.domainCondition;
        }

        inDomain(x, y, z) {
            let fn = this;
            if (fn.hasOwnProperty('compiledDomainCondition')) {
                return fn.compiledDomainCondition.eval({x: x, y: y, z: z});
            } else {
                return true;
            }
        }

        eval(x, y) {
            let fn = this;
            if (fn.hasOwnProperty('compiledFunction')) {
                const z = fn.compiledFunction.eval({x: x, y: y});
                if (fn.inDomain(x, y, z)) {
                    return z;
                }
            }
        }

        mathboxFn() {
            const fn = this;
            return function (emit, x, y) {
                emit(y, fn.eval(x, y), x);
            };
        }

        update(force) {
            let fn = super.update(force);
            //console.log('updating; currently ', fn.fnString);
            fn.scope = {
                params: fn.model.currentParamValues,
                calcs: fn.model.currentCalcValues,
                colors: fn.model.currentColors
            };
            const originalString = fn.fnString,
                originalDomainCondition = fn.domainConditionString;
            if (originalString != fn.updateFunctionString(fn.fnStringDef, fn.scope)) {
                fn.hasChanged = true;
                fn.fnString = fn.updateFunctionString(fn.fnStringDef, fn.scope);
                fn.compiledFunction = math.compile(fn.fnString);
            }
            if (fn.domainConditionStringDef != undefined) {
                if (originalDomainCondition != fn.updateFunctionString(fn.domainConditionStringDef, fn.scope)) {
                    fn.hasChanged = true;
                    fn.domainConditionString = fn.updateFunctionString(fn.domainConditionStringDef, fn.scope);
                    fn.compiledDomainCondition = math.compile(fn.domainConditionString);
                }
            }


            return fn;
        }

    }
}