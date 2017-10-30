/// <reference path="../../../eg.ts"/>

module KGAuthor {

    export interface BundleDefinition extends PointDefinition {
        utilityFunction?: KG.TypeAndDef,
        showIndifferenceCurve?: string,
        indifferenceCurveColor?: string,
        showPreferred?: string;
        showDispreferred?: string;
        indifferenceCurveLabel: LabelDefinition;

        budgetLine?: EconBudgetLineDefinition,
        showBudgetLine?: boolean,
        budgetLineLabel: LabelDefinition

        // this are used if an object representing the utility function already exists
        utilityFunctionObject?: UtilityFunction;
        budgetLineObject?: EconBudgetLine;

    }

    export function extractUtilityFunction(def) {
        return def.utilityFunctionObject || getUtilityFunction(def.utilityFunction);
    }

    export class EconBundle extends Point {

        public utilityFunction: UtilityFunction;

        constructor(def: BundleDefinition, graph) {

            KG.setDefaults(def, {
                name: KG.randomString(10),
                label: {text: 'X'},
                indifferenceCurveLabel: {text: 'U'},
                droplines: {
                    vertical: "x_1",
                    horizontal: "x_2"
                },
                showIndifferenceCurve: false,
                showPreferred: false,
                showDispreferred: false,
                color: "colors.utility"
            });

            setFillColor(def);

            super(def, graph);

            const bundle = this;


            const budgetLine = extractBudgetLine(def, graph);
            if (budgetLine) {
                this.subObjects.push(budgetLine);
            }

            bundle.utilityFunction = extractUtilityFunction(def);
            if (bundle.utilityFunction) {
                this.subObjects.push(bundle.utilityFunction);

                let indifferenceCurveDef = JSON.parse(JSON.stringify(def));
                delete indifferenceCurveDef.stroke;
                delete indifferenceCurveDef.color;
                indifferenceCurveDef = KG.setDefaults(indifferenceCurveDef, {
                    label: def.indifferenceCurveLabel,
                    level: "calcs." + bundle.name + ".level",
                    show: def.showIndifferenceCurve,
                    color: def.indifferenceCurveColor || 'colors.utility'
                });
                this.subObjects.push(new EconIndifferenceCurve(indifferenceCurveDef, graph))
            }


        }

        parseSelf(parsedData) {
            let bundle = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[bundle.name] = {
                x: bundle.x,
                y: bundle.y,
                level: bundle.utilityFunction ? bundle.utilityFunction.value([bundle.x, bundle.y]) : ''
            };

            return parsedData;
        }
    }


}