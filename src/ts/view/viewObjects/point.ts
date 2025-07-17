/// <reference path="../../kg.ts" />

module KG {

    export interface PointDefinition extends ViewObjectDefinition {
        x: any;
        y: any;
        r?: any;
        labelText?: string;
    }

    export class Point extends ViewObject {

        // SVG elements
        private dragCircle;
        private circle;

        // properties
        private x;
        private y;
        private r;

        constructor(def: PointDefinition) {

            if(def.hasOwnProperty('label') && !def.hasOwnProperty('srTitle')) {
                def.srTitle = `Point ${def['label']['text']}`
            }
            setDefaults(def, {
                fill: 'colors.blue',
                opacity: 1,
                stroke: 'white',
                strokeWidth: 1,
                strokeOpacity: 1,
                r: 6
            });
            setProperties(def, 'updatables',['x', 'y', 'r']);
            super(def);
        }

        // create SVG elements
        draw(layer) {
            let p = this;
            p.rootElement = layer.append('g'); // SVG group
            p.dragCircle = p.rootElement.append('circle').style('fill','yellow').style('fill-opacity', 0).attr('r', 20);
            p.circle = p.rootElement.append('circle');
            //p.addClipPathAndArrows()
            p.addScreenReaderDescriptions(p.circle);
            //p.rootElement.on("focus", function() {p.dragCircle.style('fill-opacity','30%')});
            //p.rootElement.on("blur", function() {p.dragCircle.style('fill-opacity',0)});
            return p.addInteraction();
        }

        // update properties
        redraw() {
            let p = this;
            p.updateScreenReaderDescriptions();
            p.rootElement.attr('transform', `translate(${p.xScale.scale(p.x)} ${p.yScale.scale(p.y)})`);
            p.circle.attr('r', p.r);
            p.circle.style('fill', p.fill);
            p.circle.style('fill-opacity', p.opacity);
            p.circle.style('stroke', p.stroke);
            p.circle.style('stroke-width', `${p.strokeWidth}px`);
            p.circle.style('stroke-opacity', p.strokeOpacity);
            return p;
        }
    }

}
