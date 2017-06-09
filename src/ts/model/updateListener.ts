/// <reference path="../kg.ts" />

module KG {

    export interface UpdateListenerDefinition {
        model: Model;
        updatables: string[];
    }

    export interface IUpdateListener {
        model: Model;
        update: () => UpdateListener;
    }

    export class UpdateListener implements IUpdateListener {

        private updatables;
        public def;
        public model;

        constructor(def: UpdateListenerDefinition) {
            this.def = def;
            this.model = def.model;
            this.model.addUpdateListener(this);
            this.updatables = def.updatables || [];
        }

        private updateDef(name) {
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