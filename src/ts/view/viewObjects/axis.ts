/// <reference path="../../kg.ts" />

'use strict';

module KG {
    export interface AxisDefinition extends ViewObjectDefinition {
        scale: any;
        orient: 'top' | 'bottom' | 'left' | 'right';
        intercept?: any;
        ticks?: any;
        tickPrepend?: string;
        tickPrecision?: string;
        label?: string;
        tickValues?: number[];
    }

    export class Axis extends ViewObject {

        private orient: 'top' | 'bottom' | 'left' | 'right';
        private intercept: any;
        public ticks;
        public tickValues;
        public label;
        private tickPrecision: number;
        private tickPrepend: string;

        constructor(def: AxisDefinition) {

            setDefaults(def, {
                ticks: 5,
                intercept: 0
            });

            setProperties(def,'constants',['orient']);
            setProperties(def, 'updatables',['ticks', 'intercept', 'label','min','max','otherMin','otherMax','tickPrepend', 'tickPrecision', 'tickValues']);

            super(def);

        }

        draw(layer) {
            let a = this;
            a.rootElement = layer.append('g').attr('class', 'axis');
            return a;
        }

        redraw() {
            let a = this;
            function formatTick(d) {
                if(a.tickPrecision) {
                    d = d.toFixed(a.tickPrecision);
                }
                if(a.tickPrepend) {
                    return `${a.tickPrepend}${d}`;
                } else {
                    return d;
                }

            }
            switch (a.orient) {
                case 'bottom':
                    a.rootElement.attr('transform', `translate(0, ${a.yScale.scale(a.intercept)})`);
                    if(a.tickValues) {
                        a.rootElement.call(d3.axisBottom(a.xScale.scale).tickValues(a.tickValues).tickFormat(formatTick));
                    } else {
                        a.rootElement.call(d3.axisBottom(a.xScale.scale).ticks(a.ticks).tickFormat(formatTick));
                    }
                    return a;

                case 'left':
                    a.rootElement.attr('transform', `translate(${a.xScale.scale(a.intercept)},0)`);
                    if(a.tickValues) {
                        a.rootElement.call(d3.axisLeft(a.yScale.scale).tickValues(a.tickValues).tickFormat(formatTick));
                    } else {
                        a.rootElement.call(d3.axisLeft(a.yScale.scale).ticks(a.ticks).tickFormat(formatTick));
                    }
                    return a;

                case 'top':
                    a.rootElement.attr('transform', `translate(0, ${a.yScale.scale(a.intercept)})`);
                    if(a.tickValues) {
                        a.rootElement.call(d3.axisTop(a.xScale.scale).tickValues(a.tickValues).tickFormat(formatTick));
                    } else {
                        a.rootElement.call(d3.axisTop(a.xScale.scale).ticks(a.ticks).tickFormat(formatTick));
                    }
                    return a;

                case 'right':
                    a.rootElement.attr('transform', `translate(${a.xScale.scale(a.intercept)},0)`);
                    if(a.tickValues) {
                        a.rootElement.call(d3.axisRight(a.yScale.scale).tickValues(a.tickValues).tickFormat(formatTick));
                    } else {
                        a.rootElement.call(d3.axisRight(a.yScale.scale).ticks(a.ticks).tickFormat(formatTick));
                    }
                    return a;
            }
            return a;
        }

    }

}

