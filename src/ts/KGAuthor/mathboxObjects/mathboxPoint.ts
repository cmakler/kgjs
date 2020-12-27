/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface MathboxPointDefinition extends MathboxObjectDefinition {
        x: any;
        y: any;
        z: any;
        droplines?: any
    }

    export class MathboxPoint extends MathboxObject {

        public x;
        public y;
        public z;

        constructor(def:MathboxPointDefinition) {
            super(def);
            let p = this;
            p.type = 'MathboxPoint';
            if (def.hasOwnProperty('droplines')) {

                // vertical dropline to bottom plane
                p.subObjects.push(new MathboxLine({
                    mb: def.mb,
                    x1: def.x,
                    x2: def.x,
                    y1: def.y,
                    y2: def.y,
                    z1: 0,
                    z2: def.z,
                    stroke: def.stroke,
                    linestyle: 'dotted'
                }))

                // dropline to x axis; assume min is 0 for now
                p.subObjects.push(new MathboxLine({
                    mb: def.mb,
                    x1: def.x,
                    x2: 0,
                    y1: def.y,
                    y2: def.y,
                    z1: 0,
                    z2: 0,
                    stroke: def.stroke,
                    linestyle: 'dotted'
                }))

                // dropline to y axis; assume min is 0 for now
                p.subObjects.push(new MathboxLine({
                    mb: def.mb,
                    x1: def.x,
                    x2: def.x,
                    y1: def.y,
                    y2: 0,
                    z1: 0,
                    z2: 0,
                    stroke: def.stroke,
                    linestyle: 'dotted'
                }))
            }

        }

    }

}