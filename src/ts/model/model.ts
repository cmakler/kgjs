/// <reference path="../kg.ts" />

module KG {

    export interface IModel {
        params: Param[];
        eval: (name:string) => any;
        updateListeners: ViewObject[];
        addUpdateListener: (vo:ViewObject) => Model;
    }

    export class Model implements IModel {

        public params;
        public updateListeners;

        constructor(modelDef) {

            let model = this;

            model.updateListeners = [];

            // initialize parameters
            model.params = {};
            for (const paramName in modelDef.params) {
                if (modelDef.params.hasOwnProperty(paramName)) {
                    model.params[paramName] = new Param(modelDef.params[paramName]);
                }
            }

            model.update();

        }

        addUpdateListener(viewObject) {
            this.updateListeners.push(viewObject);
            return this;
        }

        // the model serves as a model, and can evaluate expressions within the context of that model
        eval(name) {
            console.log('getting current value of param ', name);
            let params = this.params;
            if (params.hasOwnProperty(name)) {
                return params[name].value
            }
            let p = {};
                for (const paramName in params) {
                    if(params.hasOwnProperty(paramName)) {
                        p[paramName] = params[paramName].value;
                    }
                }
            try {
                return math.eval(name, p);
            }
            catch (err) {
                    console.log('failed to parse ',name);
                return eval(name);
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
                    model.update();
                }
            }
        }

        update() {
            this.updateListeners.forEach(function(listener) {listener.update()});
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