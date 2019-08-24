/// <reference path="../../kg.ts" />

module KGAuthor {

    export class PositionedDiv extends DivObject {

        constructor(def, divContainer) {
            delete def.xAxis;
            delete def.yAxis;
            def.xScaleName = divContainer.xScale.name;
            def.yScaleName = divContainer.yScale.name;
            super(def);
            this.type = 'PositionedDiv';
        }

    }




}