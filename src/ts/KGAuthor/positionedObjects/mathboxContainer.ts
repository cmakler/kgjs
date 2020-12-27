/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class MathboxContainer extends PositionedObject {

        constructor(def:MathboxDefinition) {
            // the container, as a div, must have an x and y axis of its own.
            // so we must first push down the author's specified x, y, and z axes down to be objects
            def.objects.push({
                "type": "MathboxXAxis",
                "def": def.xAxis
            });
            if (def.xAxis.hasOwnProperty('title')) {
                def.objects.push({
                    "type": "MathboxLabel",
                    "def": {
                        "x": multiplyDefs(def.xAxis.max, 0.95),
                        "y": multiplyDefs(def.yAxis.max, -0.02),
                        "z": multiplyDefs(def.zAxis.max, 0.02),
                        "text": def.xAxis.title,
                        "color": "black"
                    }
                });
            }
            def.objects.push({
                "type": "MathboxYAxis",
                "def": def.yAxis
            });
            if (def.yAxis.hasOwnProperty('title')) {
                def.objects.push({
                    "type": "MathboxLabel",
                    "def": {
                        "x": multiplyDefs(def.xAxis.max, -0.02),
                        "y": multiplyDefs(def.yAxis.max, 0.95),
                        "z": multiplyDefs(def.zAxis.max, 0.02),
                        "text": def.yAxis.title,
                        "color": "black"
                    }
                });
            }
            def.objects.push({
                "type": "MathboxZAxis",
                "def": def.zAxis
            });
            if (def.zAxis.hasOwnProperty('title')) {
                def.objects.push({
                    "type": "MathboxLabel",
                    "def": {
                        "x": multiplyDefs(def.xAxis.max, -0.02),
                        "y": multiplyDefs(def.yAxis.max, -0.02),
                        "z": multiplyDefs(def.zAxis.max, 0.98),
                        "text": def.zAxis.title,
                        "color": "black"
                    }
                });
            }
            delete def.zAxis;
            def.xAxis = {min: 0, max: 1};
            def.yAxis = {min: 0, max: 1};
            super(def);
            const mb = this;
            def.xScaleName = mb.xScale.name;
            def.yScaleName = mb.yScale.name;
            def.objects.forEach(function (obj) {
                if(obj.type.indexOf('Mathbox') < 0) {
                    obj.type = 'Mathbox' + obj.type;
                }
                try {
                    const newObj = new KGAuthor[obj.type](obj.def)
                    newObj.subObjects.forEach(function (subOb) {
                    def.objects.push(subOb);
                })
                }
                catch(e) {
                    console.log("There's no object called ",obj.type);
                }
            })
            console.log('creating mathbox')
            mb.subObjects.push(new Mathbox(def));
        }
    }

}