/// <reference path="../../kg.ts" />

module KGAuthor {



    export class EconIndifferenceCurve extends GraphObjectGenerator {

        constructor(def, graph) {
            super(def, graph);
            KG.setDefaults(def, {
                strokeWidth: 2,
                color: 'colors.utility',
                layer: 1
            });
            if (Array.isArray(def.utilityFunction.type)) {
                this.subObjects = def.utilityFunction.map(function (u) {
                    let uDef = JSON.parse(JSON.stringify(def));
                    uDef.utilityFunction.type = u;
                    return getUtilityFunction(def.utilityFunction).levelCurve(def, graph);
                })
            } else {
                this.subObjects = getUtilityFunction(def.utilityFunction).levelCurve(def, graph);
            }
        }
    }

    export class EconPreferredRegion extends GraphObjectGenerator {

        constructor(def, graph) {
            super(def, graph);
            KG.setDefaults(def, {
                fill: 'purple'
            });
            this.subObjects = getUtilityFunction(def.utilityFunction).areaAboveLevelCurve(def, graph);
        }

    }

    export class EconDispreferredRegion extends GraphObjectGenerator {

        constructor(def, graph) {
            super(def, graph);
            KG.setDefaults(def, {
                fill: 'red'
            });
            this.subObjects = getUtilityFunction(def.utilityFunction).areaBelowLevelCurve(def, graph);
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