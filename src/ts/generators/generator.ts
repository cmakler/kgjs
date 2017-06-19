/// <reference path="../kg.ts" />

module KG {

    export interface GeneratorDefinition {

    }

    export interface IGenerator {
        addToContainer: (currentJSON:ContainerDefinition, params) => ContainerDefinition;
    }

    export class Generator implements IGenerator {

        public def;
        public params:Param[];

        constructor(def,params) {
            this.def = def;
            this.params = params;
        }

        addToContainer(currentJSON) {
            return currentJSON;
        }

    }

}