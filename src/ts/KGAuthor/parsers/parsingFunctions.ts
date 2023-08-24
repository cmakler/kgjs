/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    import UnivariateFunctionDefinition = KG.UnivariateFunctionDefinition;
    import ParametricFunctionDefinition = KG.ParametricFunctionDefinition;


    export function extractTypeAndDef(def) {
        if (def.hasOwnProperty('type')) {
            return def
        } else {
            def.type = Object.keys(def)[0];
            def.def = def[def.type];
            return def;
        }
    }

    export function parse(data: KG.TypeAndDef[], parsedData) {
        data.forEach(function (obj) {
            if (KGAuthor.hasOwnProperty(obj.type)) {
                parsedData = new KGAuthor[obj.type](obj.def).parse(parsedData);
            } else {
                console.log("Sorry, there's no ", obj.type, " object type in KGAuthor. Maybe you have a typo?")
            }
        });
        return parsedData;

    }

    export function getDefinitionProperty(def) {
        if (typeof def == 'string') {
            if (def.match(/[\*/+-]/)) {
                return '(' + def + ')'
            } else {
                return def;
            }
        } else {
            return def;
        }
    }

    export function getPropertyAsString(def) {
        var d = def;
        if (typeof d == 'number') {
            return d.toString()
        } else {
            return "(" + d.toString() + ")"
        }
    }

    export function getParameterName(str) {
        if (typeof str == 'string') {
            return str.replace('params.', '')
        } else {
            return str;
        }
    }

    export function namedCalc(str) {
        console.log('name is ', this.name);
        return "calcs." + this.name + "." + str;
    }

    export function negativeDef(def) {
        return (typeof def == 'number') ? (-1) * def : "(-" + getDefinitionProperty(def) + ")"
    }

    export function binaryFunction(def1, def2, fn) {
        if (typeof def1 == 'number' && typeof def2 == 'number') {
            switch (fn) {
                case "+":
                    return def1 + def2;
                case "-":
                    return def1 - def2;
                case "/":
                    return def1 / def2;
                case "*":
                    return def1 * def2;
                case "^":
                    return Math.pow(def1, def2);
            }
        } else {
            return "(" + getDefinitionProperty(def1) + fn + getDefinitionProperty(def2) + ")"
        }
    }

    export function addDefs(def1, def2) {
        if (def1 == 0) {
            return def2;
        }
        if (def2 == 0) {
            return def1;
        }
        return binaryFunction(def1, def2, '+');
    }

    export function subtractDefs(def1, def2) {
        if (def2 == 0) {
            return def1;
        }
        return binaryFunction(def1, def2, '-');
    }

    export function divideDefs(def1, def2) {
        if (def1 == 0) {
            return 0;
        }
        if (def2 == 1) {
            return def1;
        }
        return binaryFunction(def1, def2, '/');
    }

    export function absDef(def) {
        return "";
    }

    export function invertDef(def) {
        return binaryFunction(1, def, '/');
    }

    export function multiplyDefs(def1, def2) {
        if (def1 == 0 || def2 == 0) {
            return 0;
        }
        if (def1 == 1) {
            return def2;
        }
        if (def2 == 1) {
            return def1;
        }
        return binaryFunction(def1, def2, '*');
    }

    export function averageDefs(def1, def2, weight?) {
        weight = weight || 0.5;
        return addDefs(multiplyDefs(weight, def1), multiplyDefs(subtractDefs(1, weight), def2));
    }

    export function squareDef(def) {
        return binaryFunction(def, def, '*');
    }

    export function sqrtDef(def) {
        return 'Math.sqrt(' + def + ')';
    }

    export function raiseDefToDef(def1, def2) {
        return binaryFunction(def1, def2, '^');
    }

    export function paramName(def) {
        if (typeof (def) == 'string') {
            return def.replace('params.', '');
        } else {
            return def
        }
    }

    export function makeDraggable(def: any) {
        if (def.hasOwnProperty('draggable') && !def.hasOwnProperty('drag')) {
            if  ((def.draggable == true) || (def.draggable == 'true')){
                def.drag = [];
                if (def.x == `params.${paramName(def.x)}`) {
                    def.drag.push({horizontal: paramName(def.x)})
                }
                if (def.y == `params.${paramName(def.y)}`) {
                    def.drag.push({vertical: paramName(def.y)})
                }
            }
        }
        return def;
    }

    export function curvesFromFunctions(fns: (UnivariateFunctionDefinition | ParametricFunctionDefinition)[], def, graph) {
        return fns.map(function (fn) {
            let curveDef = copyJSON(def);
            if (curveDef.hasOwnProperty('min')) {
                fn.min = curveDef.min;
            }
            if (curveDef.hasOwnProperty('max')) {
                fn.max = curveDef.max;
            }
            if (fn.hasOwnProperty('show')) {
                curveDef.show = fn.show;
            }
            if (fn.hasOwnProperty('parametric')) {
                curveDef.parametricFunction = fn;
            } else {
                curveDef.univariateFunction = fn;
            }
            //console.log('creating curve from def', curveDef);
            return new Curve(curveDef, graph);
        })
    }

    // allow author to set fill color either by "color" attribute or "fill" attribute
    export function setFillColor(def) {
        if (def.open) {
            def.fill = 'white';
            return KG.setDefaults(def, {
                color: def.stroke,
                stroke: def.color
            });
        }
        return KG.setDefaults(def, {
            color: def.fill,
            fill: def.color
        });
    }

    // allow author to set stroke color either by "color" attribute or "stroke" attribute
    export function setStrokeColor(def) {
        return KG.setDefaults(def, {
            color: def.stroke,
            stroke: def.color
        });
    }

    // create a fresh copy of a JSON object
    export function copyJSON(def) {
        return JSON.parse(JSON.stringify(def));
    }

    export function replaceVariable(target, search, replacement) {
        return `(${target.split(search).join(replacement)})`;
    }

    // allow author to specify a function using a single string rather than a function object
    export function parseFn(def, authorName, codeName) {
        if (!def.hasOwnProperty(codeName) && def.hasOwnProperty(authorName)) {
            if (codeName == 'parametricFunction') {
                def.parametricFunction = {
                    xFunction: def.xFn,
                    yFunction: def.yFn,
                    min: def.min,
                    max: def.max,
                    samplePoints: def.samplePoints
                }
            } else {
                def[codeName] = {
                    fn: def[authorName],
                    ind: (def[authorName].indexOf('(y)') > -1) ? 'y' : 'x',
                    min: def.min,
                    max: def.max,
                    samplePoints: def.samplePoints
                }
            }
        }
    }

    // allow author to set a fill color rather than a fill object
    export function parseFill(def, attr) {
        const v = def[attr];
        if (typeof v == 'string') {
            def[attr] = {fill: v}
        }
        if (typeof v == 'boolean' && v) {
            const fillColor = def.hasOwnProperty('fill') ? def.fill : def.color
            def[attr] = {fill: fillColor}
        }
    }

    // inherit properties from a parent
    export function inheritFromParent(props: string[], parent, child) {
        props.forEach(function (prop) {
            if (parent.hasOwnProperty(prop) && !child.hasOwnProperty(prop)) {
                child[prop] = parent[prop];
            }
        })

    }

}