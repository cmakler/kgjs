/// <reference path="../kg.ts" />

module KG {

    export interface ScaleDefinition extends UpdateListenerDefinition {
        name: string;
        axis: 'x' | 'y';
        domainMin: any;
        domainMax: any;
        rangeMin: any;
        rangeMax: any;
        log?: boolean;
        intercept?: any;
    }

    export interface IScale {
        scale: d3.ScaleLinear<Range, Range>
    }

    export class Scale extends UpdateListener implements IScale {

        public name;
        public axis;
        public scale;
        public domainMin;
        public domainMax;
        public rangeMin;
        public rangeMax;
        public extent;
        public intercept;

        constructor(def: ScaleDefinition) {
            setDefaults(def, {
                log: false
            });
            def.constants = ['rangeMin','rangeMax','axis','name'];
            def.updatables = ['domainMin', 'domainMax','intercept'];
            super(def);
            this.scale = def.log ? d3.scaleLog() : d3.scaleLinear();
            this.update(true);
        }

        update(force) {
            let s = super.update(force);
            if (s.extent != undefined) {
                const rangeMin = s.rangeMin * s.extent,
                    rangeMax = s.rangeMax * s.extent;
                s.scale.domain([s.domainMin, s.domainMax]);
                s.scale.range([rangeMin, rangeMax]);
            }
            return s;
        }

        updateDimensions(width,height) {
            let s = this;
            s.extent = (s.axis == 'x') ? width : height;
            return s.update(true);
        }

    }

}