/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconLinearMonopolyDefinition {
        demand: EconLinearDemandDefinition;
        cost: EconLinearMCDefinition;
        profitMax?: PointDefinition;
        showCS?: any;
        showPS?: any;
        showProfit?: any;
    }

    export class EconLinearMonopoly extends GraphObjectGenerator {

        public demand: EconLinearDemand;
        public cost: EconLinearMC;
        public Q: any;
        public P: any;
        public MRMC: any;
        public profit: any;

        constructor(def: EconLinearMonopolyDefinition, graph) {

            KG.setDefaults(def, {
                name: 'monopoly',
                showCS: false,
                showPS: false,
                showProfit: false
            });

            super(def, graph);

            let lm = this;

            def.demand.price = `calcs.${lm.name}.P`;
            def.cost.price = `calcs.${lm.name}.P`;
            if(def.cost.hasOwnProperty('surplus')){
                def.cost.surplus.quantity = `calcs.${lm.name}.Q`;
            }
            lm.demand = new KGAuthor.EconLinearDemand(def.demand, graph);
            lm.cost = new KGAuthor.EconLinearMC(def.cost, graph);

            let intersectMRMC = lineIntersection(lm.demand.marginalRevenue, lm.cost);
            
            lm.Q = intersectMRMC[0];
            lm.P = lm.demand.yOfX(lm.Q);
            lm.MRMC = lm.cost.yOfX(lm.Q);

            lm.subObjects.push(this.demand);
            lm.subObjects.push(this.cost);

        }

        parseSelf(parsedData) {
            let lm = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[lm.name] = {
                Q: lm.Q.toString(),
                P: lm.P.toString()
            };

            return parsedData;
        }

    }


}