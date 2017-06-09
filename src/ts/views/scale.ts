/// <reference path="../kg.ts" />

module KG {

    export interface ScaleDefinition extends UpdateListenerDefinition {
        name: string;
        axis: string; //x or y
        domainMin: any;
        domainMax: any;
        rangeMin: any;
        rangeMax: any;
        range: {min: number; max: number;}; // fractional amounts of enclosing view dimension
    }

    export interface IScale {
        name: string;
        axis: string;
        domainMin: any;
        domainMax: any;
        rangeMin: any;
        rangeMax: any;
        extent: number; // pixel length of enclosing view dimension
        scale: (value:number) => number;
        invert: (pixels:number) => number;
    }

    export class Scale extends UpdateListener implements IScale {

        public name;
        public axis;
        public domainMin;
        public domainMax;
        public rangeMin;
        public rangeMax;
        public extent;


        constructor(def:ScaleDefinition) {
            def.updatables = ['domainMin','domainMax','rangeMin','rangeMax'];
            super(def);
            this.update();
        }

        scale(value) {
            const s = this;
            let percent = (value - s.domainMin)/(s.domainMax - s.domainMin);
            return (s.rangeMin + percent*(s.rangeMax - s.rangeMin))*s.extent;
        }

        invert(pixels) {
            const s = this;
            let pixelMin = s.rangeMin*s.extent,
                pixelMax = s.rangeMax*s.extent;
            let percent = (pixels - pixelMin)/(pixelMax - pixelMin);
            return s.domainMin + percent*(s.domainMax - s.domainMin);
        }

    }

}