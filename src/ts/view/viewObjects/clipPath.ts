/// <reference path="../../kg.ts" />

module KG {

    export interface ClipPathDefinition extends ViewObjectDefinition {

    }

    export class ClipPath extends ViewObject {

        private rect;

        // create SVG elements
        draw(layer) {
            let cp = this;
            const clipPath = layer.append('clipPath').attr('id', cp.id);
            cp.rect = clipPath.append('rect');
            return cp;
        }

        // update properties
        redraw() {
            const cp = this;
            const x1 = cp.xScale.scale(cp.xScale.domainMin),
                y1 = cp.yScale.scale(cp.yScale.domainMin),
                x2 = cp.xScale.scale(cp.xScale.domainMax),
                y2 = cp.yScale.scale(cp.yScale.domainMax);
            cp.rect.attr('x', Math.min(x1, x2));
            cp.rect.attr('y', Math.min(y1, y2));
            cp.rect.attr('width', Math.abs(x2 - x1));
            cp.rect.attr('height', Math.abs(y2 - y1));
            return cp;
        }
    }

}