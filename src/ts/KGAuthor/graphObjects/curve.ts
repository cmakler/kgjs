/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface CurveDefinition extends GraphObjectDefinition {
        label?: LabelDefinition
        univariateFunction?: KG.UnivariateFunctionDefinition;
        parametricFunction?: KG.ParametricFunctionDefinition;
    }

    export class Curve extends GraphObject {

        constructor(def, graph) {
            def = setStrokeColor(def);
            super(def, graph);

            const c = this;
            c.type = 'Curve';
            c.layer = def.layer || 1;

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

    }

}