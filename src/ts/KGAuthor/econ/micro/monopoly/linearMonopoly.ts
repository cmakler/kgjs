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
        public Q: string;
        public P: string;

        constructor(def: EconLinearMonopolyDefinition, graph) {

            KG.setDefaults(def, {
                showCS: false,
                showPS: false,
                showProfit: false
            });

            super(def, graph);

            let le = this;

            le.demand = new KGAuthor.EconLinearDemand(def.demand, graph);
            le.cost = new KGAuthor.EconLinearMC(def.cost, graph);



            le.P = addDefs(le.supply.yIntercept, multiplyDefs(le.supply.slope, le.Q));

            le.subObjects.push(this.demand);
            le.subObjects.push(this.supply);

            if (graph) {

                le.subObjects.push(new Area({
                    univariateFunction1: {
                        fn: `${le.demand.yIntercept} + (${le.demand.slope})*(x)`,
                        max: le.Q
                    },
                    univariateFunction2: {
                        fn: le.P,
                        max: le.Q
                    },
                    fill: "colors.demand",
                    show: def.showCS
                }, graph));

                le.subObjects.push(new Area({
                    univariateFunction1: {
                        fn: `${le.supply.yIntercept} + (${le.supply.slope})*(x)`,
                        max: le.Q
                    },
                    univariateFunction2: {
                        fn: le.P,
                        max: le.Q
                    },
                    fill: "colors.supply",
                    show: def.showPS
                }, graph));

                let equilibriumPointDef = {
                    "color": "colors.equilibriumPrice",
                    "x": le.Q,
                    "y": le.P,
                    "droplines": {
                        "vertical": "Q^*",
                        "horizontal": "P^*"
                    }
                };

                if(def.hasOwnProperty('equilibrium')) {
                    def.equilibrium = KG.setDefaults(def.equilibrium, equilibriumPointDef)
                    le.subObjects.push(new Point(def.equilibrium, graph));
                };

            }


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