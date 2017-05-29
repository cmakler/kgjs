/// <reference path="../scope.ts" />

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

        constructor(scope, layer, def) {
            super(scope, layer, def);

            let point = this;
            point.x = def.x;
            point.y = def.y;

            //initialize circle
            point.circle = layer.append('g')
                .attr('class', "draggable")
                .call(d3.drag().on('drag', function () {
                    point.scope.updateParam(point.x, d3.event.x / scope.scale);
                    point.scope.updateParam(point.y, 10 - d3.event.y / scope.scale);
                }));
            point.circle.append('circle')
                .attr('class', "invisible")
                .attr('r', 20);
            point.circle.append('circle')
                .attr('class', "visible")
                .attr('r', 6.5);

            console.log('initialized point object: ', point);
        }

        update() {
            let point = this;
            let x = point.scope.evaluate(point.x),
                y = point.scope.evaluate(point.y);
            point.circle.attr('transform',
                `translate(${(x - 0.5) * point.scope.scale} ${(10.5 - y) * point.scope.scale})`);
            return point;
        }
    }

}