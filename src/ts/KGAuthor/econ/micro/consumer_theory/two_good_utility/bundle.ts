/// <reference path="../../../eg.ts"/>

module KGAuthor {

    export interface BundleDefinition extends PointDefinition {
        utilityFunction?: KG.TypeAndDef,
        indifferenceCurve?: IndifferenceCurveDefinition
        indifferenceCurveColor?: string,
        showPreferred?: string;
        showDispreferred?: string;
        indifferenceCurveLabel: LabelDefinition;

        budgetLine?: EconBudgetLineDefinition,
        showBudgetLine?: boolean,
        budgetLineLabel: LabelDefinition

        // this are used if an object representing the utility function already exists
        utilityFunctionObject?: EconMultivariateFunction;
        budgetLineObject?: EconBudgetLine;

    }

    export function extractUtilityFunction(def) {
        return def.utilityFunctionObject || getUtilityFunction(def.utilityFunction);
    }

    export class EconBundle extends Point {

        public utilityFunction: EconMultivariateFunction;
        public budgetLine: EconBudgetLine;

        constructor(def: BundleDefinition, graph) {

            KG.setDefaults(def, {
                label: {text: 'X'},
                droplines: {
                    vertical: "x_1",
                    horizontal: "x_2"
                },
                color: "colors.utility"
            });

            setFillColor(def);

            super(def, graph);

            const bundle = this;

            bundle.budgetLine = extractBudgetLine(def, graph);
            if (bundle.budgetLine) {
                bundle.subObjects.push(bundle.budgetLine);
            }

            bundle.utilityFunction = extractUtilityFunction(def);
            if (bundle.utilityFunction) {
                bundle.subObjects.push(bundle.utilityFunction);
                if (def.hasOwnProperty('indifferenceCurve')) {
                    def.indifferenceCurve.level = `calcs.${bundle.name}.level`;
                    def.indifferenceCurve.utilityFunction = def.utilityFunction;
                    bundle.subObjects.push(extractIndifferenceCurve(def, graph));
                }

            }

        }

        parseSelf(parsedData) {
            let bundle = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[bundle.name] = {
                x: bundle.x,
                y: bundle.y,
                level: bundle.utilityFunction ? bundle.utilityFunction.value([bundle.x, bundle.y]) : '',
                cost: bundle.budgetLine ? bundle.budgetLine.cost(bundle) : '',
                mrs: bundle.utilityFunction ? negativeDef(bundle.utilityFunction.levelCurveSlope([bundle.x, bundle.y])) : ''
            };

            return parsedData;
        }
    }


}