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
        clipPaths?: any[];
    }

    export class GraphObject extends GraphObjectGenerator {

        public type: string;
        public layer: number;
        public color: any;
        public clearColor: any;

        constructor(def, graph?) {

            if(def.hasOwnProperty('clipPaths')) {
                def.clipPathName = KG.randomString(10)
            }

            KG.setDefaults(def,{
                name: KG.randomString(10)
            });

            super(def,graph);

            let g = this;

            if(def.hasOwnProperty('color')) {
                g.color = def.color;
            }

            if(def.hasOwnProperty("clipPaths")) {
                let clipPathObjects = def.clipPaths.map(function(shape) {
                    const shapeType = Object.keys(shape)[0];
                    let shapeDef = shape[shapeType];
                    shapeDef.inDef = true;
                    return new KGAuthor[shapeType](shapeDef, graph);
                });
                g.subObjects.push(new ClipPath({name:def.clipPathName, paths:clipPathObjects},graph));
            }
        }

        parseSelf(parsedData: KG.ViewDefinition) {
            parsedData.layers[this.layer].push(this);
            return parsedData;
        }
    }

}