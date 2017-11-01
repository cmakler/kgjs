/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface GraphDefinition extends PositionedObjectDefinition {
        objects: KG.TypeAndDef[]
    }

    export class Graph extends PositionedObject {

        public clipPath;

        constructor(def) {
            super(def);

            const g = this;
            g.clipPath = new ClipPath({
                "name": KG.randomString(10),
                "paths": [new Rectangle({
                    x1: def.xAxis.min,
                    x2: def.xAxis.max,
                    y1: def.yAxis.min,
                    y2: def.yAxis.max,
                    inClipPath: true
                }, g)]
            }, g);
            g.subObjects.push(g.clipPath);
            g.def.objects.unshift({
                type: 'Axis',
                def: this.def.xAxis
            });
            g.def.objects.unshift({
                type: 'Axis',
                def: this.def.yAxis
            });
            g.def.objects.forEach(function (obj) {
                g.subObjects.push(new KGAuthor[obj.type](obj.def, g))
            });

            console.log(g);

        }
    }







}