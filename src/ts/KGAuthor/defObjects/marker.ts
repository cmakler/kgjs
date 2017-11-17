/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Marker extends DefObject {

        public refX;
        public maskPath;
        public markerType;

        constructor(def,graph) {
            super(def,graph);
            this.maskPath = def.maskPath;
        }

        parseSelf(parsedData: KG.ViewDefinition) {
            parsedData.markers.push(this.def);
            return parsedData;
        }
    }

}