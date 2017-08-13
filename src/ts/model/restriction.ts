/// <reference path="model.ts" />

module KG {

    export interface RestrictionDefinition {
        expression: string;
        type: string;
        min?: string;
        max?: string;
    }

    export interface IRestriction {
        valid: (model:Model) => boolean;
    }

    export class Restriction implements IRestriction {

        private expression: string;
        private type: string;
        private min: any;
        private max: any;

        constructor(def:RestrictionDefinition) {

            this.expression = def.expression;
            this.type = def.type;
            this.min = def.min;
            this.max = def.max;
        }

        valid(model:Model) {
            const r = this,
                value = model.eval(r.expression),
                min = model.eval(r.min),
                max = model.eval(r.max);
            return (value >= min && value <= max);
        }

    }

}