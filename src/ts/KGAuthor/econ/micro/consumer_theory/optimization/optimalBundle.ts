/// <reference path="../../../eg.ts"/>

module KGAuthor {

    export interface OptimalBundleDefinition extends BundleDefinition {

    }


    export class EconOptimalBundle extends EconBundle {

        public budgetLine;
        public level;
        public cost;

        constructor(def: OptimalBundleDefinition, graph) {

            const bl = extractBudgetLine(def, graph),
                u = extractUtilityFunction(def),
                coords = u.optimalBundle(bl);

            KG.setDefaults(def, {
                coordinates: coords,
                label: {text: 'X^*'},
                color: 'demand',
                droplines: {
                    vertical: "x_1^*",
                    horizontal: "x_2^*"
                },
                indifferenceCurve: {}
            });

            console.log('coords: ',coords);

            if(bl.hasOwnProperty('endowment')) {
                if(bl.def.sellOnly) {
                    def.show = `(${def.show || true} && (${coords[0]} < ${bl.endowment.x}))`
                }
                if(bl.def.buyOnly) {
                    def.show = `(${def.show || true} && (${coords[0]} > ${bl.endowment.x}))`
                }
            }

            def.budgetLineObject = bl;

            super(def, graph);

            this.level = u.value(coords);

        }
    }

    export class EconLagrangeBundle extends EconOptimalBundle {

        constructor(def: OptimalBundleDefinition, graph) {
            if (def.hasOwnProperty('utilityFunction') && def.hasOwnProperty('budgetLine')) {
                const u = getUtilityFunction(def.utilityFunction),
                    bl = new EconBudgetLine(def.budgetLine, graph);
                KG.setDefaults(def, {
                    coordinates: u.lagrangeBundle(bl),
                    color: 'colors.incomeOffer',
                    show: u.cornerCondition(bl),
                    label: {text: 'X^*_L'}
                });
            }
            else {
                console.log('oops, need to define an EconOptimalBundle with a utility function and budget line.')
            }

            super(def, graph);

        }
    }

    export interface LowestCostBundleDefinition extends OptimalBundleDefinition {
        prices: any[];
        level: any;
    }


    export class LowestCostBundle extends EconOptimalBundle {

        constructor(def: LowestCostBundleDefinition, graph) {
            const u = extractUtilityFunction(def),
                p1 = def.prices[0],
                p2 = def.prices[1],
                m = u.expenditure(def.level, def.prices);

            delete def.prices;
            delete def.level;

            def.budgetLine = KG.setDefaults(def.budgetLine || {}, {
                p1: p1,
                p2: p2,
                m: m
            });

            super(def, graph);
        }
    }

    export interface DecompositionBundleDefinition extends OptimalBundleDefinition {
        p1?: any;
        p2?: any;
    }

    export class EconSlutskyBundle extends EconOptimalBundle {

        public p1;
        public p2;

        constructor(def: DecompositionBundleDefinition, graph) {

            const bl = extractBudgetLine(def, graph),
                u = extractUtilityFunction(def);

            def.budgetLine = def.budgetLine || {};

            if (def.hasOwnProperty('p1')) {
                def.budgetLine.p1 = def.p1;
                delete def.budgetLine.m;
            }

            if (def.hasOwnProperty('p2')) {
                def.budgetLine.p2 = def.p2;
                delete def.budgetLine.m;
            }

            def.budgetLine.label = KG.setDefaults(def.budgetLine.label || {}, {
                text: "BL_D"
            });

            def.budgetLine.point = u.optimalBundle(bl);

            delete def.budgetLineObject;
            super(def, graph);
        }

    }

    export class EconHicksBundle extends EconOptimalBundle {

        public p1;
        public p2;

        constructor(def: DecompositionBundleDefinition, graph) {

            const bl = extractBudgetLine(def, graph),
                u = extractUtilityFunction(def),
                p1 = def.hasOwnProperty('p1') ? def.p1 : def.budgetLine.p1,
                p2 = def.hasOwnProperty('p2') ? def.p2 : def.budgetLine.p2,
                level = u.value(u.optimalBundle(bl));

            def.budgetLine.p1 = p1;
            def.budgetLine.p2 = p2;
            def.budgetLine.m = u.expenditure(level, [p1, p2]);

            def.budgetLine.label = KG.setDefaults(def.budgetLine.label || {}, {
                text: "BL_C"
            });

            def.coordinates = u.lowestCostBundle(level, [p1, p2]);

            delete def.budgetLineObject;
            super(def, graph);
        }

    }

    export interface ShortRunProductionBundleDefinition extends LowestCostBundleDefinition {
        capital: any;
    }

    export class EconShortRunProductionBundle extends EconBundle {

        constructor(def: ShortRunProductionBundleDefinition, graph) {

            const u = extractUtilityFunction(def),
                p1 = def.prices[0],
                p2 = def.prices[1];

            def.coordinates = [u.laborRequirement(def.level,def.capital), def.capital];

            def.budgetLine = KG.setDefaults(def.budgetLine || {}, {
                p1: p1,
                p2: p2
            });

            def.budgetLine.label = KG.setDefaults(def.budgetLine.label || {}, {
                text: "c_s(y)"
            });

            delete def.budgetLineObject;
            super(def, graph);
        }

    }


}