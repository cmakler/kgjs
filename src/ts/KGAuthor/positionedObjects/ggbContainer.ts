/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class GeoGebraContainer extends PositionedObject {

        constructor(def) {
            def.xAxis = {min: 0, max: 1};
            def.yAxis = {min: 0, max: 1};
            super(def);
            const ggb = this;
            def.xScaleName = ggb.xScale.name;
            def.yScaleName = ggb.yScale.name;
            ggb.subObjects.push(new GeoGebraApplet(def));
        }
    }

}