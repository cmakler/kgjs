/// <reference path="../../kg.ts" />

module KG {

    export interface IPoint extends IViewObject {
        x: any;
        y: any;
        circle: any;
    }

    export class Point extends ViewObject implements IPoint {

        public x;
        public y;
        public circle;

        constructor(def) {
            super(def);

            let point = this;
            point.x = def.x;
            point.y = def.y;

            //initialize circle
            point.circle = def.layer.append('g')
                .attr('class', "draggable")
                .call(d3.drag().on('drag', function () {
                    point.model.updateParam(point.def.x, point.xScale.invert(d3.event.x));
                    point.model.updateParam(point.def.y, point.yScale.invert(d3.event.y));
                }));
            point.circle.append('circle')
                .attr('class', "invisible")
                .attr('r', 20);
            point.circle.append('circle')
                .attr('class', "visible")
                .attr('r', 6.5);

            point.updatables = ['x','y'];

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