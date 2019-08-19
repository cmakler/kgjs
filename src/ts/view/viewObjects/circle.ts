/// <reference path="../../kg.ts" />

module KG {

    export interface CircleDefinition extends ViewObjectDefinition {
        x: any;
        y: any;
        r?: any;
    }

    export class Circle extends ViewObject {

        // properties
        private x;
        private y;
        private r;

        constructor(def: CircleDefinition) {

            setDefaults(def, {
                fill: 'colors.blue',
                opacity: 1,
                stroke: 'colors.blue',
                strokeWidth: 1,
                strokeOpacity: 1,
                r: 1
            });
            setProperties(def, 'updatables',['x', 'y', 'r']);
            super(def);
        }

        // create SVG elements
        draw(layer) {
            let c = this;
            c.rootElement = layer.append('circle');
            return c.addClipPathAndArrows().addInteraction();
        }

        // update properties
        redraw() {
            let c = this;
            c.rootElement.attr('cx', c.xScale.scale(c.x));
            c.rootElement.attr('cy', c.yScale.scale(c.y));
            c.rootElement.attr('r', c.xScale.scale(c.r) - c.xScale.scale(0));
            c.rootElement.style('fill', c.fill);
            c.rootElement.style('fill-opacity', c.opacity);
            c.rootElement.style('stroke', c.stroke);
            c.rootElement.style('stroke-width', `${c.strokeWidth}px`);
            c.rootElement.style('stroke-opacity', c.strokeOpacity);
            return c;
        }
    }

}
