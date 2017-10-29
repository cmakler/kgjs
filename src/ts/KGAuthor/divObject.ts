/// <reference path="../kg.ts" />

module KGAuthor {

    export interface DivObjectDefinition extends GraphObjectDefinition {

    }

    export class DivObject extends GraphObject {

        parseSelf(parsedData: KG.ViewDefinition) {
            parsedData.divs.push(this);
            return parsedData;
        }
    }

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
                    def.xPixelOffset = 4;
                    def.yPixelOffset = 3;
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

    export interface SidebarDefinition extends DivObjectDefinition {

    }

    export class Sidebar extends DivObject {

        constructor(def:SidebarDefinition) {
            super(def);
            this.type = 'Sidebar';
        }

    }

    export interface GeoGebraAppletDefinition extends DivObjectDefinition {

    }

    export class GeoGebraApplet extends DivObject {

        constructor(def: GeoGebraAppletDefinition, graph) {
            super(def);
            this.type = 'GeoGebraApplet';
        }
    }




}