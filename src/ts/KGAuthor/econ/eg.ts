/// <reference path="../../kg.ts"/>


/* MICRO */


/* Consumer Theory */

/// <reference path="micro/consumer_theory/constraints/budgetLine.ts"/>

/// <reference path="micro/consumer_theory/two_good_utility/twoGoodUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/cobbDouglasUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/complementsUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/substitutesUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/cesUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/concaveUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/quasilinearUtility.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/utilitySelector.ts"/>

/// <reference path="micro/consumer_theory/two_good_utility/indifferenceCurve.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/bundle.ts"/>

/// <reference path="micro/consumer_theory/optimization/optimalBundle.ts"/>
/// <reference path="micro/consumer_theory/optimization/demandCurve.ts"/>

module KGAuthor {
    export class EconSchema extends Schema {
        constructor(def) {
            def.colors = {

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

                // producer theory
                production: 'blue',
                marginalCost: 'orange',
                supply: 'orange',

                // equilibrium
                price: 'grey',

                // macro
                consumption: 'blue',
                depreciation: "red",
                savings: "green",
                tax: 'red'
            };
            super(def);

        }
    }
}
