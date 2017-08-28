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
        private restrictions: Restriction[];
        private updateListeners: UpdateListener[];

        constructor(params: ParamDefinition[], restrictions?: RestrictionDefinition[]) {
            let model = this;
            model.params = params.map(function (def) {
                return new Param(def)
            });
            model.restrictions = (restrictions || []).map(function (def) {
                return new Restriction(def)
            });
            model.updateListeners = [];
        }

        addUpdateListener(updateListener: UpdateListener) {
            this.updateListeners.push(updateListener);
            return this;
        }

        currentParamValues() {
            let p: any = {};
            this.params.forEach(function (param) {
                p[param.name] = param.value;
            });
            return p;
        }

        // the model serves as a model, and can evaluate expressions within the context of that model
        eval(name: string) {

            // don't just evaluate numbers
            if (!isNaN(parseFloat(name))) {
                //console.log('interpreted ', name, 'as a number.');
                return parseFloat(name);
            }

            // collect current parameter values in a params object
            let params = this.currentParamValues();

            // try to evaluate using mathjs
            try {
                const compiledMath = math.compile(name);
                let result = compiledMath.eval({params: params});
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
                    //console.log('unable to parse', name,'as a valid expression; generates error:', err.message);
                    return name;
                }

            }

        }

        getParam(paramName: string) {
            const params = this.params;
            for (let i = 0; i < params.length; i++) {
                if (params[i].name == paramName) {
                    return params[i];
                }
            }
        }


        // method exposed to viewObjects to allow them to try to change a parameter
        updateParam(name: string, newValue: any) {
            let model = this,
                param = model.getParam(name);
            const oldValue = param.value;
            param.update(newValue);
            // if param has changed, check to make sure the change is val
            if (oldValue != param.value) {
                let valid = true;
                model.restrictions.forEach(function (r) {
                    if (!r.valid(model)) {
                        valid = false
                    }
                    ;
                });
                if (valid) {
                    model.update(false);
                } else {
                    param.update(oldValue);
                }
            }
        }


        // method exposed to viewObjects to allow them to toggle a binary param
        toggleParam(name: string) {
            const currentValue = this.getParam(name).value;
            this.updateParam(name, !currentValue);
        }

        // method exposed to viewObjects to allow them to cycle a discrete param
        // increments by 1 if below max value, otherwise sets to zero
        cycleParam(name:string) {
            const param = this.getParam(name);
            this.updateParam(name, param.value < param.max ? param.value++ : 0 );
        }


        update(force: boolean) {
            this.updateListeners.forEach(function (listener) {
                listener.update(force)
            });
        }


    }

}