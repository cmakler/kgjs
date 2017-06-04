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

        constructor(view, layer, def) {
            super(view, layer, def);

            let point = this;
            point.x = def.x;
            point.y = def.y;

            //initialize circle
            point.circle = layer.append('g')
                .attr('class', "draggable")
                .call(d3.drag().on('drag', function () {
                    point.model.updateParam(point.x, point.xScale.invert(d3.event.x));
                    point.model.updateParam(point.y, point.yScale.invert(d3.event.y));
                }));
            point.circle.append('circle')
                .attr('class', "invisible")
                .attr('r', 20);
            point.circle.append('circle')
                .attr('class', "visible")
                .attr('r', 6.5);

            point.update();

            console.log('initialized point object: ', point);
        }

        update() {
            let point = this;
            let x = point.xScale.scale(point.model.eval(point.x)),
                y = point.yScale.scale(point.model.eval(point.y));
            point.circle.attr('transform',
                `translate(${x} ${y})`);
            return point;
        }
    }

}