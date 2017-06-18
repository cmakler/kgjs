/// <reference path="../../kg.ts" />

module KG {

    export interface PointDefinition extends ViewObjectDefinition {
        x: any;
        y: any;
    }

    export class Point extends ViewObject {

        private x;
        private y;
        private circle;

        constructor(def: PointDefinition) {
            def.updatables = ['x', 'y'];
            super(def);
        }

        draw(layer) {

            let p = this;

            //initialize circle
            p.circle = layer.append('g')
                .attr('class', "draggable");

            p.circle.append('circle')
                .attr('class', "invisible")
                .attr('r', 20);

            p.circle.append('circle')
                .attr('class', "visible")
                .attr('r', 6.5);

            p.interactionHandler.addTrigger(p.circle);

            return p;
        }

        update(force) {
            let p = super.update(force);
            if (p.hasChanged) {
                p.circle.attr('transform',`translate(${p.xScale.scale(p.x)} ${p.yScale.scale(p.y)})`);
            }
            return p;
        }
    }

}