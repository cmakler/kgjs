/// <reference path="../kg.ts" />

module KG {

    export interface ViewGeneratorDefinition extends GeneratorDefinition {
        dim?: DimensionsDefinition;
    }

    export interface IViewGenerator {
        addToContainer: (currentJSON:ContainerDefinition, params) => ContainerDefinition;
    }

    export class ViewGenerator implements IViewGenerator {

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