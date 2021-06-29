/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface GraphDefinition extends PositionedObjectDefinition {
        objects: KG.TypeAndDef[]
    }

    export class Graph extends PositionedObject {

        public clipPath;
        public markerNames;

        constructor(def) {
            def = KG.setDefaults(def,{objects: []});
            super(def);

            const g = this;

            //axes need to update when the other one's domain changes
            def.xAxis.otherMin = def.yAxis.min;
            def.xAxis.otherMax = def.yAxis.max;
            def.yAxis.otherMin = def.xAxis.min;
            def.yAxis.otherMax = def.xAxis.max;

            g.clipPath = new ClipPath({
                "name": KG.randomString(10),
                "paths": [new Rectangle({
                    x1: def.xAxis.min,
                    x2: def.xAxis.max,
                    y1: def.yAxis.min,
                    y2: def.yAxis.max,
                    inDef: true
                }, g)]
            }, g);
            g.subObjects.push(g.clipPath);
            g.def.objects.unshift({
                type: 'Axis',
                def: g.def.xAxis
            });
            g.def.objects.unshift({
                type: 'Axis',
                def: g.def.yAxis
            });
            g.def.objects.forEach(function (obj) {
                g.subObjects.push(new KGAuthor[obj.type](obj.def, g))
            });

            console.log(g);

        }

        getMarkerName(lookup: { markerType: string, color: string }) {
            const g = this;
            let name = '',
                found = false;

            // look to see if there is already a marker of that name and type
            g.subObjects.forEach(function (obj) {
                if (obj.hasOwnProperty('color') && obj['color'] == lookup.color && obj.hasOwnProperty('markerType') && obj['markerType'] == lookup.markerType) {
                    name = obj.name;
                    found = true;
                }
            });

            // if there is, return its name
            if (found) {
                return name;
            }

            // otherwise create a new marker, add to the graph's subobjects, and return the new marker's name
            else {
                const newMarker = new KGAuthor[lookup.markerType]({color: lookup.color});
                g.subObjects.push(newMarker);
                return newMarker.name;
            }

        }

        getEndArrowName(color: string) {
            return this.getMarkerName({
                markerType: 'EndArrow',
                color: color
            })
        }

        getStartArrowName(color: string) {
            return this.getMarkerName({
                markerType: 'StartArrow',
                color: color
            })
        }
    }

}