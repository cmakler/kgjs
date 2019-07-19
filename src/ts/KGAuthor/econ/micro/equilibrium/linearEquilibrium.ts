/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconLinearEquilibriumDefinition {
        demand: EconLinearDemandDefinition;
        supply: EconLinearSupplyDefinition;
        equilibrium?: PointDefinition;
        showCS?: any;
        showPS?: any;
    }

    export class EconLinearEquilibrium extends GraphObjectGenerator {

        public demand: EconLinearDemand;
        public supply: EconLinearSupply;
        public Q: string;
        public P: string;

        constructor(def: EconLinearEquilibriumDefinition, graph) {

            KG.setDefaults(def, {
                showCS: false,
                showPS: false
            });

            super(def, graph);

            let le = this;

            le.demand = new KGAuthor.EconLinearDemand(def.demand, graph);
            le.supply = new KGAuthor.EconLinearSupply(def.supply, graph);

            le.Q = divideDefs(addDefs(le.demand.xIntercept, multiplyDefs(le.demand.invSlope, le.supply.yIntercept)),
                subtractDefs("1", multiplyDefs(le.demand.invSlope, le.supply.slope)));

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
                    "color": "colors.green",
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

            console.log(le);


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