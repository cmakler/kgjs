/// <reference path="../../kg.ts" />

module KG {

    export interface EllipseDefinition extends ViewObjectDefinition {
        x: any;
        y: any;
        rx: any;
        ry: any;
    }

    export class Ellipse extends ViewObject {

        // properties
        private x;
        private y;
        private rx;
        private ry;

        constructor(def: EllipseDefinition) {

            setDefaults(def, {
                fill: 'colors.blue',
                opacity: 1,
                stroke: 'colors.blue',
                strokeWidth: 1,
                strokeOpacity: 1,
                rx: 1,
                ry: 1,
                checkOnGraph: false
            });
            setProperties(def, 'updatables',['x', 'y', 'rx','ry']);
            super(def);
        }

        // create SVG elements
        draw(layer) {
            let c = this;
            c.rootElement = layer.append('ellipse');
            return c.addClipPathAndArrows().addInteraction();
        }

        // update properties
        redraw() {
            let c = this;
            c.rootElement.attr('cx', c.xScale.scale(c.x));
            c.rootElement.attr('cy', c.yScale.scale(c.y));
            c.rootElement.attr('rx', Math.abs(c.xScale.scale(c.rx) - c.xScale.scale(0)));
            c.rootElement.attr('ry', Math.abs(c.yScale.scale(c.ry) - c.yScale.scale(0)));
            c.drawFill(c.rootElement);
            c.drawStroke(c.rootElement);
            return c;
        }
    }

    // A circle is just an ellipse defined by a single radius
    export interface CircleDefinition extends EllipseDefinition {
        r?: any;
        radius?: any;
    }

    export class Circle extends Ellipse {

        constructor(def: CircleDefinition) {



            super(def);
        }

    }

}
