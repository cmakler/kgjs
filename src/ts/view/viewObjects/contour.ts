/// <reference path='../../kg.ts' />

module KG {

    export interface ContourDefinition extends ViewObjectDefinition {
        fn: string;
        level: any;
        areaAbove?: AreaDefinition;
        areaBelow?: AreaDefinition;
    }

    export class Contour extends ViewObject {

        private path;
        private negativePath;

        public fn: MultivariateFunction;
        public negativeFn: MultivariateFunction;
        public level;

        private areaAbove;
        private areaBelow;

        constructor(def: ContourDefinition) {
            setDefaults(def, {
                opacity: 0.2,
                stroke: "grey",
                areaAbove: "none",
                areaBelow: "none",
                strokeOpacity: 1
            });
            setProperties(def, 'colorAttributes', ['areaAbove', 'areaBelow']);
            setProperties(def, 'updatables', ['level', 'areaBelow', 'areaAbove']);
            super(def);

            // used for shading area above
            this.fn = new MultivariateFunction({
                fn: def.fn,
                model: def.model
            }).update(true);

            // used for shading area below
            this.negativeFn = new MultivariateFunction({
                fn: `-1*(${def.fn})`,
                model: def.model
            }).update(true);
        }

        draw(layer) {
            let c = this;
            c.rootElement = layer.append('g');
            c.negativePath = c.rootElement.append('path');
            c.path = c.rootElement.append('path');
            return c.addClipPathAndArrows();
        }

        redraw() {
            let c = this;
            if (undefined != c.fn) {


                c.path.attr("d", c.fn.contour(c.level, c.xScale, c.yScale));
                c.path.style('fill', c.areaAbove);
                c.path.style('fill-opacity', c.opacity);
                c.path.style('stroke', c.stroke);
                c.path.style('stroke-width', c.strokeWidth);
                c.path.style('stroke-opacity', c.strokeOpacity);

                c.negativePath.attr("d", c.negativeFn.contour(-1*c.level, c.xScale, c.yScale));
                c.negativePath.style('fill', c.areaBelow);
                c.negativePath.style('fill-opacity', c.opacity);

            }


            return c;
        }

    }

}