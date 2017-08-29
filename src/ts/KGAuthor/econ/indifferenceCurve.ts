/// <reference path="../../kg.ts" />

module KGAuthor {

    export class EconIndifferenceCurve extends GraphObjectGenerator {

        constructor(def, graph) {
            super(def, graph);
            KG.setDefaults(def, {
                strokeWidth: 2,
                stroke: 'purple'
            });
            let ic = this;
            if(def.utilityFunction.type == 'CobbDouglas') {
                ic.subObjects = new KGAuthor.CobbDouglasFunction(def.utilityFunction.def).levelCurve(def, graph)
            } else if (def.utilityFunction.type == 'Substitutes' || def.utilityFunction.type == 'PerfectSubstitutes') {
                ic.subObjects = new KGAuthor.LinearFunction(def.utilityFunction.def).levelCurve(def, graph)
            } else if (def.utilityFunction.type == 'Complements' || def.utilityFunction.type == 'PerfectComplements') {
                ic.subObjects = new KGAuthor.MinFunction(def.utilityFunction.def).levelCurve(def, graph)
            }
        }
    }

    export class EconIndifferenceMap extends GraphObjectGenerator {

        constructor(def, graph) {
            super(def, graph);
            KG.setDefaults(def, {
                strokeWidth: 1,
                stroke: 'lightgrey',
                layer: 0
            });
            this.subObjects = def.levels.map(function(level) {
                let icDef = JSON.parse(JSON.stringify(def));
                delete icDef.levels;
                if(Array.isArray(level)) {
                    icDef.point = level;
                } else {
                    icDef.level = level;
                }
                return new EconIndifferenceCurve(icDef, graph);
            })
        }
    }
}