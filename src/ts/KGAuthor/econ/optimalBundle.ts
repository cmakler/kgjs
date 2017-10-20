/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface OptimalBundleDefinition extends PointDefinition {
        utilityFunction?: KG.TypeAndDef,
        budgetLine?: EconBudgetLineDefinition,
        showIndifferenceCurve?: boolean,
        indifferenceCurveLabel: LabelDefinition,
        showBudgetLine?: boolean,
        budgetLineLabel: LabelDefinition

        // these are used if an object representing the budget line or utility function already exists
        utilityFunctionObject?: UtilityFunction,
        budgetLineObject?: EconBudgetLine,

    }

    export function extractBudgetLine(def, graph) {
        return def.budgetLineObject || new EconBudgetLine(def.budgetLine, graph);
    }

    export function extractUtilityFunction(def) {
        return def.utilityFunctionObject || getUtilityFunction(def.utilityFunction);
    }

    export class EconOptimalBundle extends Point {

        public utilityFunction;
        public budgetLine;

        constructor(def: OptimalBundleDefinition, graph) {

            const bl = extractBudgetLine(def, graph),
                u = extractUtilityFunction(def),
                coords = u.optimalBundle(bl);

            KG.setDefaults(def, {
                coordinates: coords,
                fill: 'purple',
                label: {text: 'X^*'},
                indifferenceCurveLabel: {text: 'U'},
                budgetLineLabel: {text: 'BL'},
                droplines: {
                    vertical: "x_1^*",
                    horizontal: "x_2^*"
                },
                showIndifferenceCurve: false,
                showBudgetLine: false
            });

            super(def, graph);

            const point = this;

            if (def.showIndifferenceCurve) {
                const indifferenceCurveDef = JSON.parse(JSON.stringify(def));
                delete indifferenceCurveDef.budgetLine;
                indifferenceCurveDef.label = def.indifferenceCurveLabel;
                indifferenceCurveDef.point = coords;
                point.subObjects.push(new EconIndifferenceCurve(indifferenceCurveDef, graph))
            }

            if (def.showBudgetLine) {
                point.subObjects.push(bl);
            }

        }
    }

    export class EconLagrangeBundle extends Point {

        constructor(def: OptimalBundleDefinition, graph) {
            if (def.hasOwnProperty('utilityFunction') && def.hasOwnProperty('budgetLine')) {
                const u = getUtilityFunction(def.utilityFunction),
                    bl = new EconBudgetLine(def.budgetLine, graph);
                KG.setDefaults(def, {
                    coordinates: u.lagrangeBundle(bl),
                    fill: 'orange',
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

    export interface SlutskyBundleDefintion extends OptimalBundleDefinition {
        p1?: any;
        p2?: any;
    }

    export class EconSlutskyBundle extends EconOptimalBundle {

        public p1;
        public p2;

        constructor(def, graph) {

            const bl = extractBudgetLine(def, graph),
                u = extractUtilityFunction(def);

            def.budgetLine = def.budgetLine || {};

            if(def.hasOwnProperty('p1')) {
                def.budgetLine.p1 = def.p1;
                delete def.budgetLine.m;
            }

            if(def.hasOwnProperty('p2')) {
                def.budgetLine.p2 = def.p2;
                delete def.budgetLine.m;
            }

            def.budgetLine.point = u.optimalBundle(bl);

            delete def.budgetLineObject;
            super(def, graph);
        }

    }


}