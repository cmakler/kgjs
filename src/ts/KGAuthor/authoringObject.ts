/// <reference path="../kg.ts" />

module KGAuthor {

    interface IAuthoringObject {
        parse: (parsedData:KG.ViewDefinition) => KG.ViewDefinition;
    }

    export class AuthoringObject implements IAuthoringObject {

        public name: any;
        public def:any;
        public subObjects: AuthoringObject[];

        constructor(def) {
            this.def = def;
            this.name = def.name;
            this.subObjects = [];
        }

        parse_self(parsedData:KG.ViewDefinition) {
            return parsedData;
        }

        parse(parsedData:KG.ViewDefinition) {
            parsedData = this.parse_self(parsedData);
            this.subObjects.forEach(function(obj) {
                parsedData = obj.parse(parsedData);
            });
            return parsedData;
        }
    }

}