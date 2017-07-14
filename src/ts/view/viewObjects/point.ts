/// <reference path="../../kg.ts" />

module KG {

    export interface PointDefinition extends ViewObjectDefinition {
        x: any;
        y: any;
    }

    export class Point extends ViewObject {

        // SVG elements
        private g;
        private dragCircle;
        private circle;

        // properties
        private x;
        private y;
        private r;

        constructor(def: PointDefinition) {

            // establish property defaults
            def = _.defaults(def, {
                fill: 'blue',
                opacity: 1,
                stroke: 'white',
                strokeWidth: 1,
                strokeOpacity: 1,
                r: 6.5,
                updatables: []
            });

            // define updatable properties
            def.updatables = def.updatables.concat(['x','y','r']);

            super(def);
        }

        // create SVG elements
        draw(layer) {
            let p = this;
            p.g = layer.append('g').attr('class', "draggable"); // SVG group
            p.dragCircle = p.g.append('circle').style('fill-opacity',0).attr('r', 20);
            p.circle = p.g.append('circle');
            if(p.hasOwnProperty('clipPath') && p.clipPath != undefined) {
                //p.g.attr('clip-path',`url(#${p.clipPath.id})`);
            }
            p.interactionHandler.addTrigger(p.g);
            return p;
        }

        // update properties
        update(force) {
            let p = super.update(force);
            if (p.hasChanged) {

                //updated property values
                let x = p.xScale.scale(p.x),
                    y = p.yScale.scale(p.y),
                    r = p.r;

                //assign property values to SVG attributes
                p.g.attr('transform',`translate(${x} ${y})`);
                p.circle.attr('r',p.r);
                p.circle.style('fill',p.fill);
                p.circle.style('opacity',p.opacity);
                p.circle.style('stroke',p.stroke);
                p.circle.style('stroke-width',`${p.strokeWidth}px`);
                p.circle.style('stroke-opacity',p.strokeOpacity);
            }
            return p;
        }
    }

}
