/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconLinearMCDefinition extends EconLinearSupplyDefinition {
        fixedCost: string;
    }

    export class EconLinearMC extends EconLinearSupply {

        public fixedCost;
        public profit;

        constructor(def: EconLinearSupplyDefinition, graph) {
            super(def, graph);
        }



    }

}