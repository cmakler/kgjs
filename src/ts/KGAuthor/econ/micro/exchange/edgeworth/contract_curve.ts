/// <reference path="../../../eg.ts"/>

module KGAuthor {

    export interface EconContractCurveDefinition extends CurveDefinition {
        totalGood1: string | number;
        totalGood2: string | number;
        a: string | number; // agent A's Cobb-Douglas utility function alpha
        b: string | number; // agent B's Cobb-Douglas utility function alpha
    }


    export class EconContractCurve extends Curve {

        fnString: string;

        constructor(def: EconContractCurveDefinition, graph) {

            const a = def.a,
                b = def.b,
                ab = multiplyDefs(a, b),
                aMinusABtimesX = multiplyDefs(subtractDefs(a, ab), def.totalGood1),
                bMinusABtimesY = multiplyDefs(subtractDefs(b, ab), def.totalGood2),
                bMinusA = subtractDefs(b, a),
                fnString = `${bMinusABtimesY}*(x)/(${aMinusABtimesX} + ${bMinusA}*(x))`;

            def.univariateFunction = {fn: fnString};

            KG.setDefaults(def, {
                interpolation: 'curveMonotoneX',
                color: 'colors.budget'
            });

            super(def, graph);

            this.fnString = fnString;

        }

        parseSelf(parsedData) {
            let cc = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs['cc'] = cc.fnString;
            return parsedData;
        }
    }


}