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

        constructor(def, graph?) {
            KG.setDefaults(def,{
                name: KG.randomString(10)
            });
            super(def,graph);
            let g = this;
            if(def.hasOwnProperty('color')) {
                g.color = def.color;
            }
            if(def.hasOwnProperty("clipPaths")) {
                const clipPathName = KG.randomString(10);
                let clipPathObjects = [new Rectangle({
                    x1: graph.def.xAxis.min,
                    x2: graph.def.xAxis.max,
                    y1: graph.def.yAxis.min,
                    y2: graph.def.yAxis.max,
                    inDef: true
                }, graph)];
                def.overlapShapes.forEach(function(shape) {
                    const shapeType = Object.keys(shape)[0];
                    let shapeDef = shape[shapeType];
                    shapeDef.inDef = true;
                    clipPathObjects.push(new KGAuthor[shapeType](shapeDef, graph));
                })
            }
        }

        parseSelf(parsedData: KG.ViewDefinition) {
            parsedData.layers[this.layer].push(this);
            return parsedData;
        }
    }

}