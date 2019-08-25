/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface LabelDefinition extends DivObjectDefinition {
        text: string;
        x?: any;
        y?: any;
        t?: any;
        coordinates?: any[];
        fontSize?: number;
        xPixelOffset?: number;
        yPixelOffset?: number;
        rotate?: number;
        align?: string;
        position?: string;
        bgcolor?: string;
    }

    export class Label extends DivObject {

        constructor(def:LabelDefinition, graph) {
            if(def.hasOwnProperty('position')) {
                if(def.position.toLowerCase() == 'bl') {
                    def.xPixelOffset = 5;
                    def.yPixelOffset = 10;
                    def.align = 'left';
                }
                if(def.position.toLowerCase() == 'tl') {
                    def.xPixelOffset = 5;
                    def.yPixelOffset = -12;
                    def.align = 'left';
                }
                if(def.position.toLowerCase() == 'tr') {
                    def.xPixelOffset = -5;
                    def.yPixelOffset = -12;
                    def.align = 'right';
                }
                if(def.position.toLowerCase() == 'br') {
                    def.xPixelOffset = -5;
                    def.yPixelOffset = 10;
                    def.align = 'right';
                }
                if(def.position.toLowerCase() == 'tr') {
                    def.xPixelOffset = -5;
                    def.yPixelOffset = -12;
                    def.align = 'right';
                }
                if(def.position.toLowerCase() == 't') {
                    def.yPixelOffset = -15;
                }
                if(def.position.toLowerCase() == 'b') {
                    def.yPixelOffset = 12;
                }
                if(def.position.toLowerCase() == 'l') {
                    def.xPixelOffset = -8;
                    def.align = 'right';
                }
                if(def.position.toLowerCase() == 'r') {
                    def.xPixelOffset = 8;
                    def.align = 'left';
                }
            }
            super(def, graph);
            this.type = 'Label';
            this.extractCoordinates();
        }

    }




}