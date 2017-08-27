/// <reference path="../../kg.ts" />

module KG {

    export interface AuthoringObjectDefinition {

    }

    export interface IAuthoringObject extends IUpdateListener {
        parse: (schema:string) => any;
    }

    export class AuthoringObject implements IAuthoringObject {

        public element;

        constructor(def: AuthoringObjectDefinition) {
            def = _.defaults(def, {
                updatables: [],
                constants: [],
                show: true
            });

            super(def);

            let divObj = this;

            // the draw method creates the DOM elements for the view object
            // the update method updates their attributes
            if (def.hasOwnProperty('layer')) {
                divObj.draw(def.layer).update(true);
            }
        }

        parse(schema:any) {
            return this;
        }

    }

}