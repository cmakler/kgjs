/// <reference path="../kg.ts" />

module KGAuthor {

    export function parse(data, parsedData) {
        for (let prop in data) {
                if (KGAuthor.hasOwnProperty(prop)) {
                    parsedData = new KGAuthor[prop](data[prop]).parse(parsedData);
                } else if (prop == 'graphs'){
                    data['graphs'].forEach(function(def) {
                        parsedData = new Graph(def).parse(parsedData);
                    })
                } else {
                    parsedData[prop] = parsedData[prop];
                }
            }
            return parsedData;

    }

        export function getDefinitionProperty(def) {
        if(typeof def == 'string') {
            if(def.match(/[\*/+-]/)) {
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
        if(typeof d == 'number') {
            return d.toString()
        } else {
            return "(" + d.toString() + ")"
        }
    }

    export function getParameterName(str) {
        if(typeof str == 'string') {
            return str.replace('params.','')
        } else {
            return str;
        }
    }

    export function binaryFunction(def1,def2,fn) {
        if(typeof def1 == 'number' && typeof def2 == 'number') {
            switch(fn) {
                case "+":
                    return def1 + def2;
                case "-":
                    return def1 - def2;
                case "/":
                    return def1 / def2;
                case "*":
                    return def1 * def2;
                case "^":
                    return Math.pow(def1,def2);
            }
        } else {
            return "(" + getDefinitionProperty(def1) + fn + getDefinitionProperty(def2) + ")"
        }
    }

    export function addDefs(def1,def2) {
        return binaryFunction(def1,def2,'+');
    }

    export function subtractDefs(def1,def2) {
        return binaryFunction(def1,def2,'-');
    }

    export function divideDefs(def1,def2) {
        return binaryFunction(def1,def2,'/');
    }

    export function multiplyDefs(def1,def2) {
        return binaryFunction(def1,def2,'*');
    }

    export function squareDef(def) {
        return binaryFunction(def,def,'*');
    }

    export function sqrtDef(def) {
        return 'Math.sqrt('+def+')';
    }

    export function raiseDefToDef(def1, def2) {
        return binaryFunction(def1,def2,'^');
    }

    export function paramName(def) {
        return def.replace('params.','');
    }

}