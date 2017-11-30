/// <reference path="../../kg.ts" />

module KG {

    export interface DivObjectDefinition extends UpdateListenerDefinition {
        layer: any;
        name?: string;
        show?: any;
    }

    export interface IDivObject extends IUpdateListener {
        draw: (layer: any) => DivObject;
    }

    export class DivObject extends ViewObject implements IDivObject {
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