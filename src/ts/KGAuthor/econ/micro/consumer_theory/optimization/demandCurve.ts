/// <reference path="../../../eg.ts"/>

module KGAuthor {

    export interface DemandCurveDefinition extends OptimalBundleDefinition {
        good: 1 | 2;
    }

    export interface SupplyCurveDefinition extends OptimalBundleDefinition {
        good: 1 | 2;
    }

    export class EconDemandCurve extends GraphObjectGenerator {

        constructor(def: DemandCurveDefinition, graph) {
            const u = getUtilityFunction(def.utilityFunction),
                bl = new EconBudgetLine(def.budgetLine, graph);
            KG.setDefaults(def, {
                stroke: 'colors.demand',
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
                    fill: 'colors.demand',
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

    export class EconNetDemandCurve extends GraphObjectGenerator {

        constructor(def: DemandCurveDefinition, graph) {
            const u = getUtilityFunction(def.utilityFunction),
                bl = new EconBudgetLine(def.budgetLine, graph);
            KG.setDefaults(def, {
                color: 'colors.demand',
                strokeWidth: 2
            });
            super(def, graph);
            this.subObjects = u.netDemandCurve(bl, def.good, def, graph);
        }
    }

    export class EconNetDemandPoint extends Point {

        constructor(def: DemandCurveDefinition, graph) {
            if (def.hasOwnProperty('utilityFunction') && def.hasOwnProperty('budgetLine')) {
                const u = getUtilityFunction(def.utilityFunction),
                    bl = new EconBudgetLine(def.budgetLine, graph);
                KG.setDefaults(def, {
                    coordinates: [subtractDefs(u.quantityDemanded(bl,def.good), bl.point[def.good-1]),bl['p'+def.good]],
                    fill: 'colors.demand',
                    label: {text: `d_${def.good}(p_${def.good}|p_${3-def.good})`},
                    droplines: {vertical: `d_${def.good}^*`}
                });
            }
            else {
                console.log('oops, need to define an EconOptimalBundle with a utility function and budget line.')
            }

            super(def, graph);

        }
    }

    export class EconNetSupplyCurve extends GraphObjectGenerator {

        constructor(def: SupplyCurveDefinition, graph) {
            const u = getUtilityFunction(def.utilityFunction),
                bl = new EconBudgetLine(def.budgetLine, graph);
            KG.setDefaults(def, {
                color: 'colors.supply',
                strokeWidth: 2
            });
            super(def, graph);
            this.subObjects = u.netSupplyCurve(bl, def.good, def, graph);
        }
    }

    export class EconNetSupplyPoint extends Point {

        constructor(def: SupplyCurveDefinition, graph) {
            if (def.hasOwnProperty('utilityFunction') && def.hasOwnProperty('budgetLine')) {
                const u = getUtilityFunction(def.utilityFunction),
                    bl = new EconBudgetLine(def.budgetLine, graph);
                KG.setDefaults(def, {
                    coordinates: [subtractDefs(bl.point[def.good-1], u.quantityDemanded(bl,def.good)),bl['p'+def.good]],
                    fill: 'colors.supply',
                    label: {text: `s_${def.good}(p_${def.good}|p_${3-def.good})`},
                    droplines: {vertical: `s_${def.good}^*`}
                });
            }
            else {
                console.log('oops, need to define an EconOptimalBundle with a utility function and budget line.')
            }

            super(def, graph);

        }
    }

    export interface OfferCurveDefinition extends DemandCurveDefinition {
        min?: number;
        max?: number;
    }

    export class EconPriceOfferCurve extends GraphObjectGenerator {

        constructor(def: OfferCurveDefinition, graph) {
            const u = getUtilityFunction(def.utilityFunction),
                bl = new EconBudgetLine(def.budgetLine, graph);
            KG.setDefaults(def, {
                stroke: 'colors.offer',
                strokeWidth: 2
            });
            super(def, graph);
            this.subObjects = u.priceOfferCurve(bl, def.good, def.min, def.max, def, graph);
        }
    }


}