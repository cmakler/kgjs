/// <reference path="../kg.ts" />

module KG {

    export interface UpdateListenerDefinition {
        model: Model;
        updatables: string[];
        constants: any[];
    }

    export interface IUpdateListener {
        model: Model;
        update: (force:boolean) => UpdateListener;
        hasChanged: boolean;
    }

    export class UpdateListener implements IUpdateListener {

        private updatables;
        public def;
        public model;
        public hasChanged;

        constructor(def: UpdateListenerDefinition) {
            def = _.defaults(def,{updatables: [],constants: []});
            def.constants.push('model','updatables');
            let ul = this;
            ul.def = def;
            def.constants.forEach(function(c) {
                ul[c] = isNaN(parseFloat(def[c])) ? def[c] : +def[c];
            });
            ul.model.addUpdateListener(this);
        }

        private updateDef(name) {
            let u = this;
            if(u.def.hasOwnProperty(name)) {
                const d = u.def[name],
                    initialValue = u[name];
                let newValue = u.model.eval(d);
                if(initialValue != newValue) {
                    u.hasChanged = true;
                    u[name] = newValue;
                    console.log(u.constructor['name'],name,'changed from',initialValue,'to',newValue);
                }
            }
            return u;
        }

        update(force) {
            let u = this;
            u.hasChanged = !!force;
            u.updatables.forEach(function(name) { u.updateDef(name) });
            return u;
        }

    }

}