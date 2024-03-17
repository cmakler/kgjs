/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface LabelDefinition extends DivObjectDefinition {
        text: string;

        plainText?: boolean;
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

            let xAxisIntercept = 0, yAxisIntercept = 0;
            if(graph.def.hasOwnProperty('xAxis')) {
                if(graph.def.xAxis.hasOwnProperty('intercept')) {
                    xAxisIntercept = graph.def.xAxis.intercept;
                }
            }
            if(graph.def.hasOwnProperty('yAxis')) {
                if(graph.def.yAxis.hasOwnProperty('intercept')) {
                    yAxisIntercept = graph.def.yAxis.intercept;
                }
            }

            if(def.x == 'AXIS') {
                def.x = yAxisIntercept;
                def.position = "r";
            }

            if(def.y == 'AXIS') {
                def.y = xAxisIntercept;
                def.position = "t";
            }

            if(def.hasOwnProperty('position')) {
                if(def.position.toLowerCase() == 'bl') {
                    def.xPixelOffset = 5;
                    def.yPixelOffset = def.fontSize;
                    def.align = 'left';
                }
                if(def.position.toLowerCase() == 'tl') {
                    def.xPixelOffset = 5;
                    def.yPixelOffset = -(def.fontSize + 2);
                    def.align = 'left';
                }
                if(def.position.toLowerCase() == 'tr') {
                    def.xPixelOffset = -5;
                    def.yPixelOffset = -(def.fontSize + 2);
                    def.align = 'right';
                }
                if(def.position.toLowerCase() == 'br') {
                    def.xPixelOffset = -5;
                    def.yPixelOffset = def.fontSize;
                    def.align = 'right';
                }
                if(def.position.toLowerCase() == 'tr') {
                    def.xPixelOffset = -5;
                    def.yPixelOffset = -(def.fontSize + 2);
                    def.align = 'right';
                }
                if(def.position.toLowerCase() == 't') {
                    def.yPixelOffset = -(def.fontSize + 5);
                }
                if(def.position.toLowerCase() == 'b') {
                    def.yPixelOffset = def.fontSize + 2;
                }
                if(def.position.toLowerCase() == 'r') {
                    def.xPixelOffset = -8;
                    def.align = 'right';
                }
                if(def.position.toLowerCase() == 'l') {
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