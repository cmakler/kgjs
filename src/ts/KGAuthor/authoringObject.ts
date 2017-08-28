/// <reference path="../kg.ts" />

module KGAuthor {

    export function parse(data, parsedData) {
        for (let prop in data) {
                if (KGAuthor.hasOwnProperty(prop)) {
                    parsedData = new KGAuthor[prop](data[prop]).parse(parsedData);
                } else if (prop == 'graphs'){
                    data['graphs'].forEach(function(def) {
                        parsedData = new Graph(def).parse(parsedData);
                    })
                } else {
                    parsedData[prop] = parsedData[prop];
                }
            }
            return parsedData;

    }

    interface IAuthoringObject {
        parse: (parsedData:KG.ViewDefinition) => KG.ViewDefinition;
    }

    export class AuthoringObject implements IAuthoringObject {

        public def:any;
        public name: string;

        constructor(def) {
            this.def = def;
        }

        parse(parsedData:KG.ViewDefinition) {
            return parsedData;
        }
    }

}