/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface AuthoringObjectDefinition {
        name?: string;
        tabbable?: boolean;
        srTitle?: string;
        srDesc?: string;
    }

    export interface IAuthoringObject {
        parse: (parsedData: KG.ViewDefinition) => KG.ViewDefinition;
    }

    export class AuthoringObject implements IAuthoringObject {

        public name: any;
        public def: any;
        public subObjects: AuthoringObject[];
        public tabbable: boolean;
        public srTitle: string;
        public srDesc: string;

        constructor(def: AuthoringObjectDefinition) {
            this.def = def;
            this.name = def.name;
            this.subObjects = [];


            if(def.hasOwnProperty('srTitle')) {
                this.srTitle = def.srTitle;
                this.tabbable = true;
            }

            if(def.hasOwnProperty('srDesc')) {
                this.srDesc = def.srDesc;
                this.tabbable = true;
            }
        }

        parseSelf(parsedData: KG.ViewDefinition) {
            return parsedData;
        }

        parse(parsedData: KG.ViewDefinition) {
            this.subObjects.forEach(function (obj) {
                parsedData = obj.parse(parsedData);
            });
            delete this.subObjects;
            parsedData = this.parseSelf(parsedData);
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