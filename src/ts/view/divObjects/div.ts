/// <reference path="../../kg.ts" />
module KG {

    export interface DivDefinition extends DivObjectDefinition {
        html: string;
        fontSize?: string;
    }

    export class Div extends DivObject {

        private html: string;

        constructor(def) {

            //establish property defaults
            setDefaults(def, {
                xPixelOffset: 0,
                yPixelOffset: 0,
                fontSize: 12
            });

            // define constant and updatable properties
            setProperties(def, 'constants', ['fontSize']);
            setProperties(def, 'updatables', ['html']);

            super(def);

        }

        // create div for text
        draw(layer) {
            let div = this;

            div.rootElement = layer.append('div')
                .style('font-size', div.fontSize + 'pt')
                .style('padding-top', '2px')
                .style('padding-bottom', '2px');

            return div;
        }

        // update properties
        redraw() {
            let div = this;
            if (div.show) {
                div.rootElement.html(div.html);
                renderMathInElement(div.rootElement.node(), {
                    delimiters: [
                        {left: "$$", right: "$$", display: true},
                        {left: "\\[", right: "\\]", display: true},
                        {left: "$", right: "$", display: false},
                        {left: "\\(", right: "\\)", display: false}
                    ]
                });
            } else {
                div.rootElement.html(null);
            }
            return div;
        }
    }

}