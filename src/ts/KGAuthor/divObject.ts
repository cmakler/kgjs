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
        }

    }

    export class Sidebar extends DivObject {

        constructor(def, graph) {
            super(def, graph);
            this.type = 'Sidebar';
        }

    }




}