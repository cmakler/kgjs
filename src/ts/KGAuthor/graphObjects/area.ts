/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    import UnivariateFunctionDefinition = KG.UnivariateFunctionDefinition;

    export interface AreaDefinition extends GraphObjectDefinition {
        fn?: string;
        fn1?: string;
        fn2?: string;
        univariateFunction1?: UnivariateFunctionDefinition;
        univariateFunction2?: UnivariateFunctionDefinition;
        above?: any;
    }

    export class Area extends GraphObject {

        constructor(def:AreaDefinition, graph) {

            KG.setDefaults(def,{
                color: 'colors.blue',
                opacity: 0.2
            });

            def = setFillColor(def);
            parseFn(def,'fn','univariateFunction1');
            parseFn(def,'fn1','univariateFunction1');
            parseFn(def,'fn2','univariateFunction2');
            super(def, graph);
            this.type = 'Area';
            this.layer = def.layer || 0;
        }

    }

}