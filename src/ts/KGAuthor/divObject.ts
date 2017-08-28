/// <reference path="../kg.ts" />

module KGAuthor {

    export class DivObjectGenerator extends GraphObjectGenerator {

        public def: any;
        public subObjects: DivObject[];

        constructor(def, graph: Graph) {
            super(def, graph);
            this.def.xScaleName = graph.xScaleName;
            this.def.yScaleName = graph.yScaleName;
            this.def.clipPathName = graph.clipPathName;
            this.subObjects = [];
        }

        extractCoordinates(coordinatesKey?, xKey?, yKey?) {
            coordinatesKey = coordinatesKey || 'coordinates';
            xKey = xKey || 'x';
            yKey = yKey || 'y';
            let def = this.def;
            if (def.hasOwnProperty(coordinatesKey)) {
                def[xKey] = def[coordinatesKey][0].toString();
                def[yKey] = def[coordinatesKey][1].toString();
                delete def[coordinatesKey];
            }
        }
    }

    export class DivObject extends DivObjectGenerator {

        public type: string;

        parse_self(parsedData: KG.ViewDefinition) {
            parsedData.divs.push({"type": "Label", "def": this.def});
            return parsedData;
        }
    }


    export class Label extends DivObject {

        constructor(def, graph) {
            super(def, graph);
            this.type = 'Label';
        }

    }




}