/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface CurveDefinition extends GraphObjectDefinition {
        label?: LabelDefinition
        fn?: string;
        xFn?: string;
        yFn?: string;
        univariateFunction?: KG.UnivariateFunctionDefinition;
        parametricFunction?: KG.ParametricFunctionDefinition;
        pts?: { name: string; x?: string; y?: string; }[];
        areaBelow?: string | AreaDefinition;
        areaAbove?: string | AreaDefinition;
    }

    export class Curve extends GraphObject {

        public pts: string[];
        public univariateFunction: KG.UnivariateFunction;
        public parametricFunction: KG.ParametricFunction;


        constructor(def, graph) {
            def = setStrokeColor(def);

            parseFn(def, 'fn', 'univariateFunction');
            parseFn(def, 'xFn', 'parametricFunction');

            super(def, graph);

            const c = this;
            c.type = 'Curve';
            c.layer = def.layer || 1;
            c.pts = def.pts || [];

            if (def.hasOwnProperty('areaBelow')) {
                KG.setDefaults(def.areaBelow,{
                    color: def.color
                });
                parseFill(def, 'areaBelow');
                KG.setDefaults(def.areaBelow, def.univariateFunction);
                parseFn(def.areaBelow, 'fn', 'univariateFunction1');
                c.subObjects.push(new Area(def.areaBelow, graph));
            }

            if (def.hasOwnProperty('areaAbove')) {
                KG.setDefaults(def.areaBelow,{
                    color: def.color
                });
                parseFill(def, 'areaAbove');
                KG.setDefaults(def.areaAbove, def.univariateFunction);
                parseFn(def.areaAbove, 'fn', 'univariateFunction1');
                def.areaAbove.above = true;
                c.subObjects.push(new Area(def.areaAbove, graph));
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
                        labelDef.coordinates = [labelDef.x, c.yOfX(labelDef.x)];
                        c.subObjects.push(new Label(labelDef, graph));
                    } else if (labelDef.hasOwnProperty('y') && def.univariateFunction.ind != 'x') {
                        labelDef.coordinates = [c.xOfY(labelDef.y), labelDef.y];
                        c.subObjects.push(new Label(labelDef, graph));
                    }
                }
                if (def.hasOwnProperty('parametricFunction')) {
                    if (labelDef.hasOwnProperty('t')) {
                        labelDef.coordinates = c.xyOfT(labelDef.t);
                        c.subObjects.push(new Label(labelDef, graph));
                    }
                }


            }
        }

        yOfX(x) {
            return `(${replaceVariable(this.def.univariateFunction.fn, '(x)', `(${x})`)})`
        }

        xOfY(y) {
            const c = this;
            if (c.def.univariateFunction.hasOwnProperty('yFn')) {
                return `(${replaceVariable(c.def.univariateFunction.yFn, '(y)', `(${y})`)})`
            } else {
                return `(${replaceVariable(c.def.univariateFunction.fn, '(y)', `(${y})`)})`
            }

        }

        xyOfT(t) {
            return [
                replaceVariable(this.def.parametricFunction.xFunction, '(t)', `(${t})`),
                replaceVariable(this.def.parametricFunction.yFunction, '(t)', `(${t})`)
            ]
        }

        parseSelf(parsedData) {
            let c = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[c.name] = parsedData.calcs[c.name] || {};
            c.pts.forEach(function (p) {
                if (p.hasOwnProperty('x')) {
                    parsedData.calcs[c.name][p['name']] = {
                        x: p['x'],
                        y: c.yOfX(p['x'])
                    }
                }
                if (p.hasOwnProperty('y')) {
                    parsedData.calcs[c.name][p['name']] = {
                        x: c.xOfY(p['y']),
                        y: p['y']
                    }
                }
            });
            return parsedData;
        }

    }

}