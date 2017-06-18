/// <reference path="../kg.ts" />

module KG {

    export interface IModel {
        params: Param[];
        eval: (name: string) => any;
        currentParamValues: () => {};
        updateListeners: UpdateListener[];
        addUpdateListener: (updateListener: UpdateListener) => Model;
    }

    export class Model implements IModel {

        public params;
        public updateListeners;

        constructor(def) {

            let model = this;

            model.updateListeners = [];

            // initialize parameters
            model.params = {};
            for (const paramName in def.params) {
                if (def.params.hasOwnProperty(paramName)) {
                    model.params[paramName] = new Param(def.params[paramName]);
                }
            }

        }

        addUpdateListener(updateListener) {
            this.updateListeners.push(updateListener);
            return this;
        }

        currentParamValues() {
            let params = this.params;
            let p = {};
            for (const paramName in params) {
                if (params.hasOwnProperty(paramName)) {
                    p[paramName] = params[paramName].value;
                }
            }
            return p;
        }

        // the model serves as a model, and can evaluate expressions within the context of that model
        eval(name) {
            let p = this.params;

            // don't just evaluate numbers
            if (typeof name == 'number') {
                //console.log('parsed', name, 'as a number');
                return name;
            }

            // check to see if name is a param
            else if (p.hasOwnProperty(name)) {
                //console.log('parsed', name, 'as a parameter');
                return p[name].value
            }

            // collect current parameter values in a p object
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


        // method exposed to viewObjects to allow them to try to change a parameter
        updateParam(name, newValue) {
            let model = this;
            if (model.params.hasOwnProperty(name)) {
                const oldValue = model.params[name].value;
                model.params[name].update(newValue);

                // if param has changed, propagate change to fields and children
                if (oldValue != model.params[name].value) {
                    model.update(false);
                }
            }
        }

        update(force) {
            this.updateListeners.forEach(function (listener) {
                listener.update(force)
            });
        }


    }


    /*

     //initialize all fields that display this param
     model.updateParamFields(paramName);

     // set scrubbing behavior on any element that identifies itself as a control for this param
     model.root.selectAll(`[data-name='${paramName}']`).call(d3.drag()
     .on('drag', function () {
     model.updateParam(paramName, param.positionToValue()(d3.event.x));
     }));

     // update cycle stage 2: all fields displaying the updated parameter show new value
     updateParamFields(paramName) {
     let model = this;
     model.root.selectAll(`[data-name='${paramName}']`).text(() => {
     return model.params[paramName].formatted();
     });
     }

     // update cycle stage 3: coordinates of all objects are updated
     updateChildren() {
     this.children.forEach(function (child) {
     child.update()
     });
     }

     // update cycle stage 4: update text fields based on calculations
     updateCalculations() {
     let model = this,
     elements = model.root.selectAll(`[calculation]`);
     console.log(elements);
     if(elements.size() > 0) {
     let precision = elements.attr('precision') || 0;
     elements.text(() => d3.format(`.${precision}f`)(model.evaluate(elements.attr('calculation'))));}
     }*/

}