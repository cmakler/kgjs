/// <reference path="../../kg.ts" />

module KG {

    export interface ExplanationDefinition extends ViewObjectDefinition {
        border?: string;
        height?: number;
        divs: any[]
    }

    export class Explanation extends ViewObject {

        constructor(def: ExplanationDefinition) {

            setDefaults(def, {
                height: 0,
                divs: [],
                border: 'none'
            });
            setProperties(def, 'constants', ['divs', 'height', 'border']);

            super(def);
        }

        position(width, height) {
            let explanation = this;
            explanation.rootElement
                .style('left', '10px')
                .style('top', height + 20 + 'px')
                .style('width', width - 20 + 'px')
        }

        draw(layer) {
            let explanation = this;

            explanation.rootElement = layer.append('div')
                .style('position', 'absolute')
                .style('height', explanation.height == 0 ? null : explanation.height + 'px')
                .style('overflow-y','scroll')
                .style('border', explanation.border);

            explanation.divs.forEach(function (div) {
                div = setDefaults(div, {
                    layer: explanation.rootElement,
                    model: explanation.model,
                    fontSize: 12
                });
                if (div.hasOwnProperty('html')) {
                    new Div(div)
                } else if (div.hasOwnProperty('table')) {
                    div.rows = div.table.rows;
                    div.columns = div.table.columns;
                    div.fontSize = 10;
                    delete div.table;
                    new Table(div)
                }
            });

            return explanation;

        }
    }

}