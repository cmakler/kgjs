/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface LabelDefinition extends DivObjectDefinition {
        text: string;
        x?: any;
        y?: any;
        coordinates?: any[];
        fontSize?: number;
        xPixelOffset?: number;
        yPixelOffset?: number;
        rotate?: number;
        align?: string;
        position?: string;
    }

    export class Label extends DivObject {

        constructor(def:LabelDefinition, graph) {
            if(def.hasOwnProperty('position')) {
                if(def.position.toLowerCase() == 'bl') {
                    def.xPixelOffset = 5;
                    def.yPixelOffset = 10;
                    def.align = 'left';
                }
                if(def.position.toLowerCase() == 'tr') {
                    def.xPixelOffset = -5;
                    def.yPixelOffset = -12;
                    def.align = 'right';
                }
            }
            super(def, graph);
            this.type = 'Label';
            this.extractCoordinates();
        }

    }




}