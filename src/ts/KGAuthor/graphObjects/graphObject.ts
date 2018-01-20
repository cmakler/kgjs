/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface GraphObjectDefinition extends GraphObjectGeneratorDefinition {
        type?: string;
        layer?: number;
        color?: string;
        fill?: string;
        opacity?: string | number;
        stroke?: string;
        strokeWidth?: string | number;
        strokeOpacity?: string | number;
        lineStyle?: string;
        drag?: any;
        click?: any;
        show?: string;
    }

    export class GraphObject extends GraphObjectGenerator {

        public type: string;
        public layer: number;
        public color: any;

        constructor(def, graph?) {
            KG.setDefaults(def,{
                name: KG.randomString(10)
            });
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