/// <reference path="../../kg.ts" />

module KGAuthor {

    export function getIndifferenceCurveFunction(def) {
        if (def.utilityFunction.type == 'CobbDouglas') {
            return new KGAuthor.CobbDouglasFunction(def.utilityFunction.def)
        } else if (def.utilityFunction.type == 'Substitutes' || def.utilityFunction.type == 'PerfectSubstitutes') {
            return new KGAuthor.LinearFunction(def.utilityFunction.def)
        } else if (def.utilityFunction.type == 'Complements' || def.utilityFunction.type == 'PerfectComplements') {
            return new KGAuthor.MinFunction(def.utilityFunction.def)
        }
    }

    export class EconIndifferenceCurve extends GraphObjectGenerator {

        constructor(def, graph) {
            super(def, graph);
            KG.setDefaults(def, {
                strokeWidth: 2,
                stroke: 'purple'
            });
            this.subObjects = getIndifferenceCurveFunction(def).levelCurve(def, graph);
        }
    }

    export class EconPreferredRegion extends GraphObjectGenerator {

        constructor(def, graph) {
            super(def, graph);
            KG.setDefaults(def, {
                fill: 'purple'
            });
            this.subObjects = getIndifferenceCurveFunction(def).areaAboveLevelCurve(def, graph);
        }

    }

    export class EconDispreferredRegion extends GraphObjectGenerator {

        constructor(def, graph) {
            super(def, graph);
            KG.setDefaults(def, {
                fill: 'red'
            });
            this.subObjects = getIndifferenceCurveFunction(def).areaBelowLevelCurve(def, graph);
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
            this.subObjects = def.levels.map(function (level) {
                let icDef = JSON.parse(JSON.stringify(def));
                delete icDef.levels;
                if (Array.isArray(level)) {
                    icDef.point = level;
                } else {
                    icDef.level = level;
                }
                return new EconIndifferenceCurve(icDef, graph);
            })
        }
    }
}