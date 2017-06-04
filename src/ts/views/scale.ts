/// <reference path="../kg.ts" />

module KG {

    export interface ScaleDefinition {
        name: string;
        axis: string; //x or y
        domain: {min: any; max: any;};
        range: {min: number; max: number;}; // fractional amounts of enclosing view dimension
    }

    export interface IScale {
        name: string;
        axis: string;
        domain: {min: number; max: number;};
        range: {min: number; max: number;};
        extent: number; // pixel length of enclosing view dimension
        scale: (value:number) => number;
        invert: (pixels:number) => number;
    }

    export class Scale implements IScale {

        public name;
        public axis;
        public domain;   // container object that contains this view, and also the model
        public range;         // root div of this view
        public extent;


        constructor(def:ScaleDefinition) {

            let s = this;
            s.name = def.name;
            s.axis = def.axis;
            s.domain = def.domain;
            s.range = def.range;

        }

        scale(value) {
            const s = this;
            let percent = (value - s.domain.min)/(s.domain.max - s.domain.min);
            return (s.range.min + percent*(s.range.max - s.range.min))*s.extent;

        }

        invert(pixels) {
            const s = this;
            let pixelMin = s.range.min*s.extent,
                pixelMax = s.range.max*s.extent;
            let percent = (pixels - pixelMin)/(pixelMax - pixelMin);
            return s.domain.min + percent*(s.domain.max - s.domain.min);
        }

    }

}