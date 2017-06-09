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

        constructor(def:PointDefinition) {

            def.updatables = ['x','y'];
            super(def);

            let point = this;

            //initialize circle
            point.circle = def.layer.append('g')
                .attr('class', "draggable");

            point.circle.append('circle')
                .attr('class', "invisible")
                .attr('r', 20);

            point.circle.append('circle')
                .attr('class', "visible")
                .attr('r', 6.5);

            point.interactionHandler.addTrigger(point.circle);

            point.update();

            console.log('initialized point object: ', point);
        }

        update() {
            let point = super.update();
            point.circle.attr('transform',
                `translate(${point.xScale.scale(point.x)} ${point.yScale.scale(point.y)})`);
            return point;
        }
    }

}