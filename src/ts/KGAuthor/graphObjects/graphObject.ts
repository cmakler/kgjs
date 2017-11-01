/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface GraphObjectDefinition extends GraphObjectGeneratorDefinition {
        type?: string;
        layer?: number;
        color?: string;
        fill?: string;
        opacity?: string;
        stroke?: string;
        strokeWidth?: string;
        strokeOpacity?: string;
        lineStyle?: string;
        drag?: any;
        click?: any;
    }

    export class GraphObject extends GraphObjectGenerator {

        public type: string;
        public layer: number;
        public color: any;

        constructor(def, graph?) {
            super(def,graph);
            let g = this;
            if(def.hasOwnProperty('color')) {
                g.color = def.color;
            }
        }

        parseSelf(parsedData: KG.ViewDefinition) {
            parsedData.layers[this.layer].push(this);
            return parsedData;
        }
    }

}