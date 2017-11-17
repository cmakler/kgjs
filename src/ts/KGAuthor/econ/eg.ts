/// <reference path="../kgAuthor.ts" />

/* FUNCTIONAL FORMS */

/// <reference path="functional_forms/multivariate/multivariate.ts"/>
/// <reference path="functional_forms/multivariate/cobbDouglas.ts"/>
/// <reference path="functional_forms/multivariate/complements.ts"/>
/// <reference path="functional_forms/multivariate/substitutes.ts"/>
/// <reference path="functional_forms/multivariate/ces.ts"/>
/// <reference path="functional_forms/multivariate/concave.ts"/>
/// <reference path="functional_forms/multivariate/quasilinear.ts"/>

/* MICRO */


/* Consumer Theory */

/// <reference path="micro/consumer_theory/constraints/budgetLine.ts"/>

/// <reference path="micro/consumer_theory/two_good_utility/utilitySelector.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/indifferenceCurve.ts"/>
/// <reference path="micro/consumer_theory/two_good_utility/bundle.ts"/>

/// <reference path="micro/consumer_theory/optimization/optimalBundle.ts"/>
/// <reference path="micro/consumer_theory/optimization/demandCurve.ts"/>

/* Producer Theory */

/// <reference path="micro/producer_theory/linearDemand.ts"/>

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
                marginalRevenue: 'olive',
                supply: 'orange',
                shortRun: 'red',
                longRun: 'orange',
                profit: 'green',
                loss: 'red',

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
