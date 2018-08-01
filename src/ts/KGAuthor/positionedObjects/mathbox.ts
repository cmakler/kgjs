/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Mathbox extends PositionedObject {

        constructor(def) {
            def.xAxis = {min: 0, max: 1};
            def.yAxis = {min: 0, max: 1};
            super(def);
            const mb = this;
            def.xScaleName = mb.xScale.name;
            def.yScaleName = mb.yScale.name;
            mb.subObjects.push(new MathboxApplet(def));
        }
    }

}