/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface CurveDefinition extends GraphObjectDefinition {
        label?: LabelDefinition
        univariateFunction?: KG.UnivariateFunctionDefinition;
        parametricFunction?: KG.ParametricFunctionDefinition;
        pts?: {name: string; x?: string; y?: string;}[];
        areaBelow?: AreaDefinition;
        areaAbove?: AreaDefinition;
    }

    export class Curve extends GraphObject {

        public pts: string[];
        public univariateFunction: KG.UnivariateFunction;
        public parametricFunction: KG.ParametricFunction;


        constructor(def, graph) {
            def = setStrokeColor(def);
            super(def, graph);

            const c = this;
            c.type = 'Curve';
            c.layer = def.layer || 1;
            c.pts = def.pts || [];

            if (def.hasOwnProperty('areaBelow')) {
                let areaBelowDef = KG.setDefaults(def.areaBelow, {
                    univariateFunction1: def.univariateFunction,
                    fill: def.color
                });
                c.subObjects.push(new Area(areaBelowDef, graph));
            }

            if (def.hasOwnProperty('areaAbove')) {
                let areaAboveDef = KG.setDefaults(def.areaAbove, {
                    univariateFunction1: def.univariateFunction,
                    fill: def.color,
                    above: true
                });
                c.subObjects.push(new Area(areaAboveDef, graph));
            }

            if (def.hasOwnProperty('label')) {
                let labelDef = copyJSON(def);
                delete labelDef.label;
                labelDef = KG.setDefaults(labelDef, def.label);
                labelDef = KG.setDefaults(labelDef, {
                    fontSize: 12,
                    color: def.color
                });
                if (def.hasOwnProperty('univariateFunction')) {
                    if (labelDef.hasOwnProperty('x') && def.univariateFunction.ind != 'y') {
                        labelDef.coordinates = [
                            labelDef.x,
                            `(${replaceVariable(def.univariateFunction.fn, '(x)', `(${labelDef.x})`)})`
                        ];
                        c.subObjects.push(new Label(labelDef, graph));
                    } else if (labelDef.hasOwnProperty('y') && def.univariateFunction.ind != 'x') {
                        labelDef.coordinates = [
                            `(${replaceVariable(def.univariateFunction.fn, '(y)', `(${labelDef.y})`)})`,
                            labelDef.y
                        ];
                        c.subObjects.push(new Label(labelDef, graph));
                    }
                }
                if (def.hasOwnProperty('parametricFunction')) {
                    if (labelDef.hasOwnProperty('t')) {
                        labelDef.coordinates = [
                            replaceVariable(def.parametricFunction.xFunction, '(t)', `(${labelDef.t})`),
                            replaceVariable(def.parametricFunction.yFunction, '(t)', `(${labelDef.t})`)
                        ];
                        c.subObjects.push(new Label(labelDef, graph));
                    }
                }


            }
        }

        parseSelf(parsedData) {
            let c = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[c.name] = parsedData.calcs[c.name] || {};
            c.pts.forEach(function(p) {
                if (p.hasOwnProperty('x')) {
                    parsedData.calcs[c.name][p['name']] = {
                        x: p['x'],
                        y: `(${replaceVariable(c.def.univariateFunction.fn, '(x)', `(${p['x']})`)})`
                    }
                }
                if (p.hasOwnProperty('y')) {
                    parsedData.calcs[c.name][p['name']] = {
                        x: `(${replaceVariable(c.def.univariateFunction.yFn, '(y)', `(${p['y']})`)})`,
                        y: p['y']
                    }
                }
            });
            return parsedData;
        }

    }

}