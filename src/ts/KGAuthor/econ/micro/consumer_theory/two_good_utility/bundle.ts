/// <reference path="../../../eg.ts"/>

module KGAuthor {

    export interface BundleDefinition extends PointDefinition {
        utilityFunction?: KG.TypeAndDef,
        showIndifferenceCurve?: string,
        showPreferred?: string;
        showDispreferred?: string;
        indifferenceCurveLabel: LabelDefinition;

        // this are used if an object representing the utility function already exists
        utilityFunctionObject?: UtilityFunction,

    }

    export function extractUtilityFunction(def) {
        return def.utilityFunctionObject || getUtilityFunction(def.utilityFunction);
    }

    export class EconBundle extends Point {

        public utilityFunction: UtilityFunction;

        constructor(def: BundleDefinition, graph) {

            KG.setDefaults(def, {
                name: KG.randomString(10),
                fill: 'colors.utility',
                label: {text: 'X'},
                indifferenceCurveLabel: {text: 'U'},
                droplines: {
                    vertical: "x_1",
                    horizontal: "x_2"
                },
                showIndifferenceCurve: false,
                showPreferred: false,
                showDispreferred: false
            });

            super(def, graph);

            const bundle = this;

            bundle.utilityFunction = extractUtilityFunction(def);

            let indifferenceCurveDef = JSON.parse(JSON.stringify(def));
            indifferenceCurveDef = KG.setDefaults(indifferenceCurveDef, {
                label: def.indifferenceCurveLabel,
                level: "calcs." + bundle.name + ".level",
                show: def.showIndifferenceCurve
            });
            this.subObjects.push(new EconIndifferenceCurve(indifferenceCurveDef, graph))

        }

        parseSelf(parsedData) {
            let bundle = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[bundle.name] = {
                x: bundle.x,
                y: bundle.y,
                level: bundle.utilityFunction.value([bundle.x,bundle.y])
            };
            return parsedData;
        }
    }


}