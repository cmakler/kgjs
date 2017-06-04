/// <reference path="../../kg.ts" />

module KG {

    export interface AxisDefinition extends ViewObjectDefinition {
        ticks: number[];
        labels?: {coord: any, label: any}[];
        intercept?: number;
        orientation: string; // 'top', 'bottom', 'left' or 'right' - also implies whether this is horiz. or vert.
    }

    export interface IAxis extends IViewObject {
        origin: {x: any, y: any};
        end: {x: any, y: any};
        line: any;
    }

    export class Axis extends ViewObject implements IAxis {

        public origin;
        public end;
        public line;

        constructor(view, layer, def:AxisDefinition) {
            super(view, layer, def);

            let axis = this;

            axis.line = layer.append('line')
                .attr('class', "axis");

            if(def.orientation == 'top' || def.orientation == 'bottom') {
                let intercept = def.intercept || axis.yScale.domain.min;
                axis.origin = {x: axis.xScale.domain.min, y: intercept};
                axis.end = {x: axis.xScale.domain.max, y: intercept};
            } else {
                let intercept = def.intercept || axis.xScale.domain.min;
                axis.origin = {x: intercept, y: axis.yScale.domain.min};
                axis.end = {x: intercept, y: axis.yScale.domain.max};
            }

            axis.update();

            console.log('initialized axis object: ', axis);
        }

        update() {
            let axis = this;
            axis.line.attr('x1', axis.xScale.scale(axis.model.eval(axis.origin.x)));
            axis.line.attr('y1', axis.yScale.scale(axis.model.eval(axis.origin.y)));
            axis.line.attr('x2', axis.xScale.scale(axis.model.eval(axis.end.x)));
            axis.line.attr('y2', axis.yScale.scale(axis.model.eval(axis.end.y)));
            return axis;
        }
    }

}