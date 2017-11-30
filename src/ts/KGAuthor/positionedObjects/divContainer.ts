/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface DivContainerDefinition extends PositionedObjectDefinition {
        objects: KG.TypeAndDef[]
    }

    export class DivContainer extends PositionedObject {

        constructor(def) {
            def.xAxis = {min: 0, max: 1};
            def.yAxis = {min: 0, max: 1};
            super(def);
            const dc = this;
            dc.subObjects.push(new KGAuthor.PositionedDiv(def, dc));
        }
    }


}