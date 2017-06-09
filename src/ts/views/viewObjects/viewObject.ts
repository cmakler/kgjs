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
    }

    export class ViewObject extends UpdateListener implements IViewObject {

        public xScale;
        public yScale;
        public interactionHandler: InteractionHandler;

        constructor(def:ViewObjectDefinition) {
            super(def);
            let vo = this;
            vo.xScale = def.view.scales[def.xScaleName];
            vo.yScale = def.view.scales[def.yScaleName];
            if(def.hasOwnProperty('interaction')) {
                def.interaction.viewObject = vo;
                def.interaction.model = vo.model;
                vo.interactionHandler = new InteractionHandler(def.interaction);
            }
        }

    }

}