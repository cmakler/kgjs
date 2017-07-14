/// <reference path="../kg.ts" />

module KG {

    export interface IModel {
        //params: any; // object with string names and Param values; e.g., "yA" : (Param object)
        //updateListeners: UpdateListener[];
        eval: (name: string) => any;
        currentParamValues: () => {};
        addUpdateListener: (updateListener: UpdateListener) => Model;
    }

    export class Model implements IModel {

        private params: Param[];
        private updateListeners;

        constructor(params) {
            let model = this;
            model.params = params;
            model.updateListeners = [];
        }

        addUpdateListener(updateListener) {
            this.updateListeners.push(updateListener);
            return this;
        }

        currentParamValues() {
            let p = {};
            this.params.forEach(function (param) {
                p[param.name] = param.value;
            });
            return p;
        }

        // the model serves as a model, and can evaluate expressions within the context of that model
        eval(name) {
            let p = this.params;

            // don't just evaluate numbers
            if (!isNaN(parseFloat(name))) {
                //console.log('interpreted ', name, 'as a number.');
                return parseFloat(name);
            }

            // collect current parameter values in a params object
            let params = this.currentParamValues();

            // establish a function, usable by eval, that uses mathjs to parse a string in the context of p
            let v = function (s) {
                let compiledMath = math.compile(s);
                let parsedMath = compiledMath.eval();
                return parsedMath;
            };

            // try to evaluate using mathjs
            try {
                let result = v(name);
                //console.log('parsed', name, 'as a pure math expression with value', result);
                return result;
            }
            catch (err) {

                // if that doesn't work, try to evaluate using native js eval
                //console.log('unable to parse', name, 'as a pure math function, trying general eval');

                try {
                    let result = eval(name);
                    //console.log('parsed', name, 'as an expression with value', result);
                    return result;
                }

                catch (err) {
                    // if that doesn't work, try to evaluate using native js eval
                    //console.log('unable to parse', name,'as a valid expression; generates error:', err.message);
                    return name;
                }

            }

        }

        getParam(paramName) {
            const params = this.params;
            for (let i = 0; i < params.length; i++) {
                if (params[i].name == paramName) {
                    return params[i];
                }
            }
        }


        // method exposed to viewObjects to allow them to try to change a parameter
        updateParam(name, newValue) {
            let model = this,
                param = model.getParam(name);
            const oldValue = param.value;
            param.update(newValue);
            // if param has changed, propagate change to fields and children
            if (oldValue != param.value) {
                model.update(false);
            }
        }

        update(force) {
            this.updateListeners.forEach(function (listener) {
                listener.update(force)
            });
        }


    }

}