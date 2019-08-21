/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    import UnivariateFunctionDefinition = KG.UnivariateFunctionDefinition;

    export interface AreaDefinition extends GraphObjectDefinition {
        fn?: string;
        fn1?: string;
        fn2?: string;
        univariateFunction1?: UnivariateFunctionDefinition;
        univariateFunction2?: UnivariateFunctionDefinition;
    }

    export class Area extends GraphObject {

        constructor(def:AreaDefinition, graph) {
            if(!def.hasOwnProperty('univariateFunction1') && def.hasOwnProperty('fn')) {
                def.univariateFunction1 = {fn: def.fn};
            }
            if(!def.hasOwnProperty('univariateFunction1') && def.hasOwnProperty('fn1')) {
                def.univariateFunction1 = {fn: def.fn1};
            }
            if(!def.hasOwnProperty('univariateFunction2') && def.hasOwnProperty('fn2')) {
                def.univariateFunction1 = {fn: def.fn2};
            }
            super(def, graph);
            this.type = 'Area';
            this.layer = def.layer || 0;
        }

    }

}