/// <reference path="../eg.ts" />

module KGAuthor {
    export class EconSchema extends Schema {
        constructor(def) {

            def.colors = KG.setDefaults(def.colors || {},{

                // consumer theory
                utility: 'purple',
                mrs: 'blue',
                dispreferred: 'red',
                preferred: 'purple',
                offer: 'blue',
                incomeOffer: 'orange',
                demand: 'blue',
                budget: 'green',
                costlier: 'red',
                endowment: 'grey',
                incEffect: 'orange',
                subEffect: 'red',

                // producer theory
                production: 'blue',
                mpl: 'olive',
                marginalCost: 'orange',
                marginalRevenue: 'olive',
                supply: 'orange',
                shortRun: 'red',
                longRun: 'orange',
                profit: 'green',
                loss: 'red',
                ppf: 'red',
                mrt: 'orange',

                // equilibrium
                price: 'grey',
                paretoLens: "'#ffff99'",
                equilibriumPrice: 'green',

                // macro
                consumption: 'blue',
                depreciation: "red",
                savings: "green",
                tax: 'red'
            });

            super(def);

        }
    }
}
