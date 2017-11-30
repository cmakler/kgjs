/// <reference path="../../kg.ts" />

module KG {

    export class PositionedDiv extends DivObject {

        draw(layer) {
            const div = this;
            div.rootElement = layer.append('div');
            div.rootElement.style('position', 'absolute');
            if (div.def.hasOwnProperty('children')) {
                div.def['children'].forEach(function (child: TypeAndDef) {
                    child.def.layer = div.rootElement;
                    child.def.model = div.model;
                    new KG[child.type](child.def);
                });
            }

            return div;

        }

        redraw() {
            let div = this;
            const width = Math.abs(div.xScale.scale(1) - div.xScale.scale(0)),
                height = Math.abs(div.yScale.scale(1) - div.yScale.scale(0));
            div.rootElement.style('left', div.xScale.scale(0) + 'px');
            div.rootElement.style('top', div.yScale.scale(1) + 'px');
            div.rootElement.style('width', width + 'px');
            div.rootElement.style('height', height + 'px');
            return div;
        }
    }

}