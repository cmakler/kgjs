/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class ClipPath extends GraphObjectGenerator {

        constructor(def, graph) {
            def.inClipPath = true;
            super(def, graph);
        }

        parseSelf(parsedData: KG.ViewDefinition) {
            delete this.def.clipPathName;
            parsedData.clipPaths.push(this.def);
            return parsedData;
        }
    }

}