/// <reference path="../kg.ts" />

module KGAuthor {

    export class DivObject extends GraphObject {

        public type: string;

        parse_self(parsedData: KG.ViewDefinition) {
            parsedData.divs.push(this);
            return parsedData;
        }
    }


    export class Label extends DivObject {

        constructor(def, graph) {
            super(def, graph);
            this.type = 'Label';
            this.extractCoordinates();
        }

    }

    export class Sidebar extends DivObject {

        constructor(def) {
            super(def);
            this.type = 'Sidebar';
        }

    }

    export class GeoGebraApplet extends DivObject {

        constructor(def, graph) {
            super(def);
            this.type = 'GeoGebraApplet';
        }
    }




}