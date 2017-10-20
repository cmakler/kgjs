/// <reference path="../kg.ts" />

module KGAuthor {

    export interface AuthoringObjectDefinition {
        name?: string;
    }

    export interface IAuthoringObject {
        parse: (parsedData: KG.ViewDefinition) => KG.ViewDefinition;
    }

    export class AuthoringObject implements IAuthoringObject {

        public name: any;
        public def: any;
        public subObjects: AuthoringObject[];

        constructor(def: AuthoringObjectDefinition) {
            this.def = def;
            this.name = def.name;
            this.subObjects = [];
        }

        parseSelf(parsedData: KG.ViewDefinition) {
            return parsedData;
        }

        parse(parsedData: KG.ViewDefinition) {
            parsedData = this.parseSelf(parsedData);
            this.subObjects.forEach(function (obj) {
                parsedData = obj.parse(parsedData);
            });
            return parsedData;
        }

        addSecondGraph(graph2: Graph) {
            let def = this.def;
            if (def.hasOwnProperty('yScale2Name')) {
                def.xScale2Name = graph2.xScale.name;
                def.yScale2Name = graph2.yScale.name;
            }
            this.subObjects.forEach(function(obj) {
                obj.addSecondGraph(graph2);
            })
        }

    }

}