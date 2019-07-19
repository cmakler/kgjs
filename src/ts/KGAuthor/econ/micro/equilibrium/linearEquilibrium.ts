/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconLinearEquilibriumDefinition {
        demandDef: EconLinearDemandDefinition;
        supplyDef: EconLinearSupplyDefinition;
    }

    export class EconLinearEquilibrium extends GraphObjectGenerator {

        public demand: EconLinearDemand;
        public supply: EconLinearSupply;
        public Q: string;
        public P: string;

        constructor(def: EconLinearEquilibriumDefinition, graph) {

            super(def, graph);

            this.demand = new KGAuthor.EconLinearDemand(def.demandDef, graph);
            this.supply = new KGAuthor.EconLinearSupply(def.supplyDef, graph);

            let le = this;

            le.Q = divideDefs(addDefs(le.demand.xIntercept, multiplyDefs(le.demand.invSlope, le.supply.yIntercept)),
                subtractDefs("1", multiplyDefs(le.demand.invSlope,le.supply.slope)));

            le.P = addDefs(le.supply.yIntercept, multiplyDefs(le.supply.slope, le.Q));

            le.subObjects.push(this.demand);
            le.subObjects.push(this.supply);

        }

        parseSelf(parsedData) {
            let le = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[le.name] = {
                Q: le.Q.toString(),
                P: le.P.toString()
            };

            return parsedData;
        }

    }


}