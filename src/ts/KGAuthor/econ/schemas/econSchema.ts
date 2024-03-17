/// <reference path="../eg.ts" />

module KGAuthor {
    export class EconSchema extends Schema {

        public const

        constructor(def) {

            def.idioms = {};
            def.custom = def.custom || "0"
            const idiomMenu = [
                {
                    PPFlabel: ["PPF", "PPC"],
                    PPFword: ["frontier", "curve"],
                    PPFWord: ["Frontier", "Curve"]
                },
                {
                    good1label: ["x_1","x","X"],
                    labor1label: ["L_1","L_x","L_X"],
                    good1word: ["good 1", "good X", "good X"],
                    good1Word: ["Good 1", "Good X", "Good X"],
                    good2label: ["x_2","y","Y"],
                    labor2label: ["L_2", "L_y", "L_Y"],
                    good2word: ["good 2", "good Y", "good Y"],
                    good2Word: ["Good 2", "Good Y", "Good Y"]
                },
                {
                    oldValueLabel: ["\\ ","_1","0"],
                    newValueLabel: ["^\\prime","_2","1"]
                }
            ];

            //console.log("custom: ", def.custom)

            idiomMenu.forEach(function(idiomGroup, index) {
                // if the user has specified a choice, use it.
                if(index < def.custom.length) {
                    for (const idiomName in idiomGroup) {
                        def.idioms[idiomName] = idiomGroup[idiomName][def.custom[index]];
                    }
                }
                // otherwise default to first
                else {
                    for (const idiomName in idiomGroup) {
                        def.idioms[idiomName] = idiomGroup[idiomName][0];
                    }
                }
            })

            console.log("idioms: ",def.idioms);

            def.colors = KG.setDefaults(def.colors || {},{

                // consumer theory
                utility: 'purple',
                mrs: 'blue',
                dispreferred: 'red',
                preferred: 'green',
                offer: 'blue',
                incomeOffer: 'orange',
                demand: 'blue',
                budget: 'green',
                costlier: 'red',
                endowment: 'grey',
                incEffect: 'orange',
                subEffect: 'red',

                // producer theory
                production: 'blue',
                mpl: 'olive',
                marginalCost: 'orange',
                marginalRevenue: 'olive',
                supply: 'orange',
                shortRun: 'red',
                longRun: 'orange',
                profit: 'green',
                loss: 'red',
                ppf: 'red',
                mrt: 'orange',

                // equilibrium
                price: 'grey',
                paretoLens: "'#ffff99'",
                equilibriumPrice: 'green',

                // macro
                consumption: 'blue',
                depreciation: "red",
                savings: "green",
                tax: 'red',

                // game theory
                player1: 'blue',
                player2: 'red',
                player3: 'orange',
                nature: 'green',
                terminal: 'gray'

            });

            super(def);

            this.idiomMenu = idiomMenu;

        }
    }
}
