/// <reference path="../../kg.ts" />

module KG {

    export interface ViewObjectDefinition extends UpdateListenerDefinition {
        view: View;
        layer: any;
        xScaleName?: string;
        yScaleName?: string;
        interaction?: InteractionHandlerDefinition;
    }

    export interface IViewObject extends IUpdateListener {
        xScale: Scale;
        yScale: Scale;
        interactionHandler: InteractionHandler;
        draw: (layer: any) => ViewObject;
        addSVGElement: (layer:SVGGElement,type:string) => SVGElement;
    }

    export class ViewObject extends UpdateListener implements IViewObject {

        public xScale;
        public yScale;
        public interactionHandler: InteractionHandler;

        constructor(def: ViewObjectDefinition) {
            super(def);
            let vo = this;
            vo.xScale = def.view.scales[def.xScaleName];
            vo.yScale = def.view.scales[def.yScaleName];

            def.interaction = _.defaults(def.interaction || {}, {
                viewObject: vo,
                model: vo.model
            });
            vo.interactionHandler = new InteractionHandler(def.interaction);
            vo.draw(def.layer).update();
        }

        addSVGElement(layer,type) {
            let element = document.createElementNS("http://www.w3.org/2000/svg",type);
            layer.append(element);
            return element;
        }

        draw(layer) {
            return this;
        }

    }

}