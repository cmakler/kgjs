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

        constructor(def: AxisDefinition) {

            setDefaults(def, {
                ticks: 5,
                intercept: 0
            });

            setProperties(def,'constants',['orient']);
            setProperties(def, 'updatables',['ticks', 'intercept']);

            super(def);

        }

        draw(layer) {
            let a = this;
            a.rootElement = layer.append('g').attr('class', 'axis');
            return a;
        }

        redraw() {
            let a = this;
            switch (a.orient) {
                case 'bottom':
                    a.rootElement.attr('transform', `translate(0, ${a.yScale.scale(a.intercept)})`);
                    a.rootElement.call(d3.axisBottom(a.xScale.scale).ticks(a.ticks));
                    return a;

                case 'left':
                    a.rootElement.attr('transform', `translate(${a.xScale.scale(a.intercept)},0)`);
                    a.rootElement.call(d3.axisLeft(a.yScale.scale).ticks(a.ticks));
                    return a;

                case 'top':
                    a.rootElement.attr('transform', `translate(0, ${a.yScale.scale(a.intercept)})`);
                    a.rootElement.call(d3.axisTop(a.xScale.scale).ticks(a.ticks));
                    return a;

                case 'right':
                    a.rootElement.attr('transform', `translate(${a.xScale.scale(a.intercept)},0)`);
                    a.rootElement.call(d3.axisRight(a.yScale.scale).ticks(a.ticks));
                    return a;
            }
            return a;
        }

    }

}

