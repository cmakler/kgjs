/// <reference path="../kg.ts" />

module KG {

    export interface GeneratorDefinition {
        def: {};
    }

    export interface IGenerator {
        addToContainer: (currentJSON:ContainerDefinition) => ContainerDefinition;
    }

    export class Generator implements IGenerator {

        private def;

        constructor(def) {
            this.def = def;
        }

        addToContainer(currentJSON) {
            return currentJSON;
        }

    }

}