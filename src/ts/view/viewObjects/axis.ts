/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface AxisDefinition extends ViewObjectDefinition {
        scale: any;
        orient: 'top' | 'bottom' | 'left' | 'right';
        intercept?: any;
        ticks?: any;
    }

    export class Axis extends ViewObject {

        private orient: 'top' | 'bottom' | 'left' | 'right';
        private intercept: any;
        private ticks;
        private g;

        constructor(def: AxisDefinition) {

            def = _.defaults(def, {
                ticks: 5,
                intercept: 0,
                updatables: [],
                constants: []
            });

            def.constants = def.constants.concat(['orient']);
            def.updatables = def.updatables.concat(['ticks', 'intercept']);

            super(def);

        }

        draw(layer) {
            let a = this;
            a.g = layer.append('g').attr('class', 'axis');
            return a;
        }

        update(force) {
            let a = super.update(force);
            a.g.style('display',a.show ? null : 'none');
            switch (a.orient) {
                case 'bottom':
                    a.g.attr('transform', `translate(0, ${a.yScale.scale(a.intercept)})`);
                    a.g.call(d3.axisBottom(a.xScale.scale).ticks(a.ticks));
                    return a;

                case 'left':
                    a.g.attr('transform', `translate(${a.xScale.scale(a.intercept)},0)`);
                    a.g.call(d3.axisLeft(a.yScale.scale).ticks(a.ticks));
                    return a;

                case 'top':
                    a.g.attr('transform', `translate(0, ${a.yScale.scale(a.intercept)})`);
                    a.g.call(d3.axisTop(a.xScale.scale).ticks(a.ticks));
                    return a;

                case 'right':
                    a.g.attr('transform', `translate(${a.xScale.scale(a.intercept)},0)`);
                    a.g.call(d3.axisRight(a.yScale.scale).ticks(a.ticks));
                    return a;
            }

            return a;
        }

    }

}

