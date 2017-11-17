/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class ClipPath extends DefObject {

        parseSelf(parsedData: KG.ViewDefinition) {
            delete this.def.clipPathName;
            parsedData.clipPaths.push(this.def);
            return parsedData;
        }
    }

}