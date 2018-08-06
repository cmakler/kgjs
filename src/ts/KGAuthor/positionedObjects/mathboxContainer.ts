/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class MathboxContainer extends PositionedObject {

        constructor(def) {
            // the container, as a div, must have an x and y axis of its own.
            // so we must first push down the author's specified x, y, and z axes down to be objects
            def.objects.push({
                "type": "MathboxXAxis",
                "def": def.xAxis
            });
            def.objects.push({
                "type": "MathboxYAxis",
                "def": def.yAxis
            });
            def.objects.push({
                "type": "MathboxZAxis",
                "def": def.zAxis
            });
            delete def.zAxis;
            def.xAxis = {min: 0, max: 1};
            def.yAxis = {min: 0, max: 1};
            super(def);
            const mb = this;
            def.xScaleName = mb.xScale.name;
            def.yScaleName = mb.yScale.name;
            mb.subObjects.push(new Mathbox(def));
        }
    }

}