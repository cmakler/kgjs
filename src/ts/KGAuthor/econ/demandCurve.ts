/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface DemandCurveDefinition extends OptimalBundleDefinition {
        good: 1 | 2;
    }

    export class EconDemandCurve extends GraphObjectGenerator {

        constructor(def: DemandCurveDefinition, graph) {
            const u = getUtilityFunction(def.utilityFunction),
                bl = new EconBudgetLine(def.budgetLine, graph);
            KG.setDefaults(def, {
                stroke: 'blue',
                strokeWidth: 2
            });
            super(def, graph);
            this.subObjects = u.demandCurve(bl, def.good, def, graph);
        }
    }

    export class EconDemandPoint extends Point {

        constructor(def: DemandCurveDefinition, graph) {
            if (def.hasOwnProperty('utilityFunction') && def.hasOwnProperty('budgetLine')) {
                const u = getUtilityFunction(def.utilityFunction),
                    bl = new EconBudgetLine(def.budgetLine, graph);
                KG.setDefaults(def, {
                    coordinates: [u.quantityDemanded(bl,def.good),bl['p'+def.good]],
                    fill: 'blue',
                    label: {text: `x_${def.good}(p_${def.good}|p_${3-def.good},m)`},
                    droplines: {vertical: `x_${def.good}^*`}
                });
            }
            else {
                console.log('oops, need to define an EconOptimalBundle with a utility function and budget line.')
            }

            super(def, graph);

        }
    }

    export interface OfferCurveDefinition extends DemandCurveDefinition {
        min: number;
        max: number;
    }

    export class EconPriceOfferCurve extends GraphObjectGenerator {

        constructor(def: OfferCurveDefinition, graph) {
            const u = getUtilityFunction(def.utilityFunction),
                bl = new EconBudgetLine(def.budgetLine, graph);
            KG.setDefaults(def, {
                stroke: 'blue',
                strokeWidth: 2
            });
            super(def, graph);
            this.subObjects = u.priceOfferCurve(bl, def.good, def.min, def.max, def, graph);
        }
    }


}