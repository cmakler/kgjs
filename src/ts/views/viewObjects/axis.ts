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

        constructor(def:AxisDefinition) {
            super(def);

            let axis = this;

            axis.line = def.layer.append('line')
                .attr('class', "axis");

            if(def.orientation == 'top' || def.orientation == 'bottom') {
                let intercept = def.intercept || axis.yScale.domainMin;
                axis.origin = {x: axis.xScale.domainMin, y: intercept};
                axis.end = {x: axis.xScale.domainMax, y: intercept};
            } else {
                let intercept = def.intercept || axis.xScale.domainMin;
                axis.origin = {x: intercept, y: axis.yScale.domainMin};
                axis.end = {x: intercept, y: axis.yScale.domainMax};
            }

            axis.update();

            console.log('initialized axis object: ', axis);
        }

        update() {
            let axis = super.update();
            axis.line.attr('x1', axis.xScale.scale(axis.origin.x));
            axis.line.attr('y1', axis.yScale.scale(axis.origin.y));
            axis.line.attr('x2', axis.xScale.scale(axis.end.x));
            axis.line.attr('y2', axis.yScale.scale(axis.end.y));
            return axis;
        }
    }

}