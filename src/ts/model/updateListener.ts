/// <reference path="../kg.ts" />

module KG {

    export interface UpdateListenerDefinition {
        model: Model;
    }

    export interface IUpdateListener {
        def: UpdateListenerDefinition;
        updatables: string[];
        update: () => UpdateListener;
        updateDef: (name:string) => UpdateListener;
    }

    export class UpdateListener implements IUpdateListener {

        public def;
        public model;
        public updatables;

        constructor(def: UpdateListenerDefinition) {
            this.def = def;
            this.model = def.model;
            this.model.addUpdateListener(this);
            this.updatables = [];
        }

        updateDef(name) {
            if(this.def.hasOwnProperty(name)) {
                const d = this.def[name];
                this[name] = this.model.eval(d);
            }
            return this;
        }

        update() {
            let u = this;
            this.updatables.forEach(function(name) { u.updateDef(name) });
            return this;
        }

    }

}