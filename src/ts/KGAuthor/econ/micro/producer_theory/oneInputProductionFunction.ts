/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconOneInputProductionFunctionDefinition extends CurveDefinition {
        coefficient?: string | number;
        exponent?: string | number;
        wage?: string | number;
        price?: string | number;
    }

    export class EconOneInputProductionFunction extends AuthoringObject {

        public coefficient;
        public exponent;
        public wage;
        public price;
        public laborRequirementCoefficient;
        public laborRequirementExponent;
        public marginalProductCoefficient;
        public marginalProductExponent;
        public marginalCostCoefficient;
        public marginalCostExponent;
        public outputSupplyCoefficient;
        public outputSupplyExponent;
        public laborDemandCoefficient;
        public laborDemandExponent;

        constructor(def: EconOneInputProductionFunctionDefinition, graph?) {

            KG.setDefaults(def, {
                coefficient: 1,
                exponent: 0.5,
                wage: 1,
                price: 1
            });

            super(def);

            const f = this;
            f.coefficient = def.coefficient;
            f.exponent = def.exponent;
            f.wage = def.wage;
            f.price = def.price;

            // if y(L) = AL^b, L(y) = [A^(-1/b)] * y^[1/b]
            f.laborRequirementExponent = invertDef(def.exponent);
            f.laborRequirementCoefficient = raiseDefToDef(def.coefficient, negativeDef(f.laborRequirementExponent));

            // if f(L) = AL^b, f'(L) = [bA] * L^[b-1]
            f.marginalProductExponent = subtractDefs(def.exponent, 1);
            f.marginalProductCoefficient = multiplyDefs(def.exponent, def.coefficient);

            // if c(y) = wL(y) = w*LRC * y^LRE, c'(y) = [w*LRC*LRE] * y^[LRE - 1]
            f.marginalCostCoefficient = multiplyDefs(def.wage, multiplyDefs(f.laborRequirementExponent, f.laborRequirementCoefficient));
            f.marginalCostExponent = subtractDefs(f.laborRequirementExponent, 1);

            // if c'(y) = MCC * y^MCE, y*(p) = MCC^(-1/MCE) * p^(1/MCE)
            f.outputSupplyCoefficient = raiseDefToDef(f.marginalCostCoefficient, negativeDef(invertDef(f.marginalCostExponent)));
            f.outputSupplyExponent = invertDef(f.marginalCostExponent);

            // if MRPL = [p * MPC] * L^MPE, L*(w) = (p*MPC)^(-1/MPE) * w^(1/MPE)
            f.laborDemandCoefficient = raiseDefToDef(multiplyDefs(f.price,f.marginalProductCoefficient), negativeDef(invertDef(f.marginalProductExponent)));
            f.laborDemandExponent = invertDef(f.marginalProductExponent);

        }

        // output produced by L units of olabor
        f(L) {
            const f = this;
            return multiplyDefs(f.coefficient, raiseDefToDef(L, f.exponent));
        }

        // labor required to produce y units of output
        laborRequirement(y) {
            const f = this;
            return multiplyDefs(f.laborRequirementCoefficient, raiseDefToDef(y, f.laborRequirementExponent));
        }

        // marginal product of labor
        MPL(L) {
            const f = this;
            return multiplyDefs(f.marginalProductCoefficient, raiseDefToDef(L, f.marginalProductExponent));
        }

        // marginal revenue product of labor is price times MPL
        MRPL(L) {
            const f = this;
            return multiplyDefs(f.price, f.MPL(L));
        }

        // cost is wage times labor requirement
        cost(y) {
            const f = this;
            return multiplyDefs(f.wage, f.laborRequirement(y));
        }

        marginalCost(y) {
            const f = this;
            return multiplyDefs(f.marginalCostCoefficient, raiseDefToDef(y, f.marginalCostExponent));
        }

        // labor demand
        laborDemand(w) {
            const f = this;
            return multiplyDefs(f.laborDemandCoefficient, raiseDefToDef(w, f.laborDemandExponent));
        }

        // optimal output
        optimalOutput(p) {
            const f = this;
            return multiplyDefs(f.outputSupplyCoefficient, raiseDefToDef(p, f.outputSupplyCoefficient));
        }

        parseSelf(parsedData) {
            let ppf = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[ppf.name] = {
                coefficient: ppf.coefficient,
                exponent: ppf.exponent,
                curve: ppf.f('(x)')
            };

            return parsedData;
        }

    }

}