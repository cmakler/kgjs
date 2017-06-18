/// <reference path="../kg.ts" />

module KG {

    export interface UpdateListenerDefinition {
        model: Model;
        updatables: string[];
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
            this.def = def;
            this.model = def.model;
            this.model.addUpdateListener(this);
            this.updatables = def.updatables || [];
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