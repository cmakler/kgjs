/// <reference path="model.ts" />

module KG {

    export interface RestrictionDefinition {
        expression: any;
        type: any;
        min?: any;
        max?: any;
    }

    export interface IRestriction {
        valid: (model:Model) => boolean;
    }

    export class Restriction implements IRestriction {

        private expression;
        private type;
        private min;
        private max;

        constructor(def:RestrictionDefinition) {

            this.expression = def.expression;
            this.type = def.type;
            this.min = def.min;
            this.max = def.max;
        }

        valid(model) {
            const r = this, value = model.eval(r.expression);
            return (value >= r.min && value <= r.max);
        }

    }

}