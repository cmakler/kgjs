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
                value = model.evaluate(r.expression),
                min = model.evaluate(r.min),
                max = model.evaluate(r.max);

            // restrictions aren't working right now
            return true;
            //return (value >= min && value <= max);
        }

    }

}