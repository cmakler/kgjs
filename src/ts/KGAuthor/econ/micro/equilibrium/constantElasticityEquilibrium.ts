/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconConstantElasticityEquilibriumDefinition extends GraphObjectGeneratorDefinition {
        demand: EconConstantElasticityCurveDefinition;
        supply: EconConstantElasticityCurveDefinition;
        equilibrium?: PointDefinition;
        showCS?: any;
        showPS?: any;
    }

    export class EconConstantElasticityEquilibrium extends GraphObjectGenerator {

        public demand: EconConstantElasticityCurve;
        public supply: EconConstantElasticityCurve;
        public Q: string;
        public P: string;

        constructor(def: EconConstantElasticityEquilibriumDefinition, graph) {

            KG.setDefaults(def, {
                name: 'equilibrium',
                showCS: false,
                showPS: false
            });

            super(def, graph);

            let cee = this;

            def.equilibrium.color = def.equilibrium.color || "colors.green";
            const equilibrium = new Point(def.equilibrium, graph);
            cee.Q = equilibrium.x;
            cee.P = equilibrium.y;

            def.demand.point = def.equilibrium;
            def.demand.name = def.name + "dem";
            def.demand.color = "colors.demand";
            const demand = new EconConstantElasticityCurve(def.demand, graph)
            console.log("demand: ", demand)
            cee.subObjects.push(demand);

            def.supply.point = def.equilibrium;
            def.supply.name = def.name + "sup";
            def.supply.color = "colors.supply";
            const supply = new EconConstantElasticityCurve(def.supply, graph)
            console.log('supply: ', supply)
            cee.subObjects.push(supply);

        }

        parseSelf(parsedData) {
            let cee = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[cee.name] = {
                Q: cee.Q.toString(),
                P: cee.P.toString()
            };

            return parsedData;
        }

    }


}