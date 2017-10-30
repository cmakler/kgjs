/// <reference path="../../../eg.ts"/>

module KGAuthor {


    export class EconIndifferenceCurve extends GraphObjectGenerator {

        constructor(def, graph) {
            KG.setDefaults(def, {
                strokeWidth: 2,
                color: 'colors.utility',
                layer: 1,
                showPreferred: false,
                showDispreferred: false,
                includeAreas: true
            });
            super(def, graph);
            let curve = this;
            const utilityFunction = extractUtilityFunction(def);
            if (Array.isArray(def.utilityFunction.type)) {
                curve.subObjects = def.utilityFunction.map(function (u) {
                    let uDef = JSON.parse(JSON.stringify(def));
                    uDef.utilityFunction.type = u;
                    return utilityFunction.levelCurve(uDef, graph);
                })
            } else {
                curve.subObjects = utilityFunction.levelCurve(def, graph);

                if (def.includeAreas) {
                    if (!!def.showPreferred) {
                        let preferredDef = JSON.parse(JSON.stringify(def));
                        preferredDef.fill = 'colors.preferred';
                        preferredDef.show = def.showPreferred;
                        curve.subObjects = curve.subObjects.concat(utilityFunction.areaAboveLevelCurve(preferredDef, graph));
                    }
                    if (!!def.showDispreferred) {
                        let dispreferredDef = JSON.parse(JSON.stringify(def));
                        dispreferredDef.fill = 'colors.dispreferred';
                        dispreferredDef.show = def.showDispreferred;
                        curve.subObjects = curve.subObjects.concat(utilityFunction.areaBelowLevelCurve(dispreferredDef, graph));
                    }
                }

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
            this.subObjects = def.levels.map(function (level) {
                let icDef = JSON.parse(JSON.stringify(def));
                icDef.includeAreas = false;
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