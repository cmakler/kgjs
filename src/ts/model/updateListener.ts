/// <reference path="../kg.ts" />

module KG {

    export function randomString(length: number) {
        let text = "KGID_";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    // function to determine if the value of an updatable
    // should actually be evaluated or just left alone
    export function updatable_is_evaluatable(name: any): boolean {
            if(name) {
                const nameString = name.toString();

                // evaluate if it doesn't include any letters
                if(!/[a-zA-Z]/.test(nameString)) {
                    return true;
                }

                if(nameString.includes('params.')){
                    return true;
                }
                if(nameString.includes('calcs.')){
                    return true;
                }
                if(nameString.includes('idioms.')){
                    return true;
                }
                if(nameString.includes('colors.')){
                    return true;
                }
                if(nameString.includes('d3.')){
                    return true;
                }
                if(nameString.includes('math.')){
                    return true;
                }
                if(nameString.includes('Math.')){
                    return true;
                }
                if(nameString.includes('?') && nameString.includes(':')){
                    return true;
                }
                if(nameString.includes('.')){
                    console.log("Not catching when looking for paramaterizable updatables: ",nameString);
                }
            }

            return false;
        }

    export interface UpdateListenerDefinition {
        model?: Model;
        updatables?: string[];
        constants?: any[];
    }

    export interface IUpdateListener {
        model: Model;
        update: (force: boolean) => UpdateListener;
        hasChanged: boolean;
    }

    export class UpdateListener implements IUpdateListener {

        public updatables: string[];
        public name: string;
        public id: string;
        public def: UpdateListenerDefinition;
        public model: Model;
        public hasChanged: boolean;

        [propName: string]: any;

        constructor(def: UpdateListenerDefinition) {

            def.constants = (def.constants || []).concat(['model', 'updatables', 'name']);
            let ul = this;
            ul.def = def;
            def.constants.forEach(function (c) {
                ul[c] = isNaN(parseFloat(def[c])) ? def[c] : +def[c];
            });
            ul.id = randomString(10);
            ul.model.addUpdateListener(this);
        }



        private updateArray(a: any[]) {
            let u = this;
            return a.map(function(d) {
                if(Array.isArray(d)) {
                    return u.updateArray(d)
                } else {
                    if(updatable_is_evaluatable(d)) {
                        const initialValue = d;
                        let newValue = u.model.evaluate(d);
                        if(initialValue != newValue) {
                            u.hasChanged = true;
                        }
                        return newValue;
                    }
                    else{
                        return d;
                    }

                }
            })
        }

        private updateDef(name: string) {
            let u = this;
            if (u.def.hasOwnProperty(name)) {
                const d = u.def[name],
                    initialValue = u[name];
                if (Array.isArray(d)) {
                    u[name] = u.updateArray(d);
                } else if(updatable_is_evaluatable(d)) {
                    let newValue = u.model.evaluate(d);
                    if (initialValue != newValue) {
                        u.hasChanged = true;
                        u[name] = newValue;
                    }
                } else {
                    u[name] = u.def[name];
                }
                //console.log(u.constructor['name'],name,'changed from',initialValue,'to',u[name]);

            }
            return u;
        }

        update(force: boolean) {
            let u = this;
            u.hasChanged = !!force;
            if (u.hasOwnProperty('updatables') && u.updatables != undefined) {
                u.updatables.forEach(function (name) {
                    u.updateDef(name)
                });
            }
            return u;
        }

    }

}