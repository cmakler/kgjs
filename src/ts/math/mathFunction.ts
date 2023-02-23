/// <reference path="../kg.ts" />

module KG {

    export interface MathFunctionDefinition extends ViewObjectDefinition {
        min?: any;
        max?: any;
        samplePoints?: any;
        parametric?: boolean;
    }

    export interface IMathFunction {

    }

    export class MathFunction extends UpdateListener implements IMathFunction {

        public samplePoints;
        public data;
        public scope;

        constructor(def: MathFunctionDefinition) {

            setDefaults(def, {
                samplePoints: 50
            });
            setProperties(def, 'constants', ['samplePoints']);
            setProperties(def, 'updatables', ['min', 'max']);
            super(def);
        }

        updateFunctionString(str: string, scope: { params: {}, calcs: {}, colors: {} }) {
            function getCalc(o, s) {
                s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
                s = s.replace(/^\./, '');           // strip a leading dot
                let a = s.split('.');
                for (let i = 0, n = a.length; i < n; ++i) {
                    let k = a[i];
                    if (k in o) {
                        o = o[k];
                    } else {
                        return;
                    }
                }
                return o;
            }
            str = str.toString();

            if(str.indexOf('null') > -1 || str.indexOf('Infinity') > -1) {
                return null;
            }

            const re = /((calcs|params).[.\w]*)+/g;
            const references = str.match(re);
            if (references) {
                references.forEach(function (name) {
                    str = KGAuthor.replaceVariable(str, name, getCalc(scope, name));
                });
            }
            //console.log('updated function to ',str);
            return str;
        }

    }
}