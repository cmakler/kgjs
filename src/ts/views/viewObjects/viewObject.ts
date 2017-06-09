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
        view: View;
        xScale: Scale;
        yScale: Scale;
        interactionHandler: InteractionHandler;
    }

    export class ViewObject extends UpdateListener implements IViewObject {

        public view;
        public xScale;
        public yScale;
        public interactionHandler: InteractionHandler;

        constructor(def:ViewObjectDefinition) {
            super(def);
            let vo = this;
            vo.view = def.view;
            vo.model = vo.view.container.model;
            vo.xScale = vo.view.scales[def.xScaleName];
            vo.yScale = vo.view.scales[def.yScaleName];
            vo.model.addUpdateListener(vo);
            if(def.hasOwnProperty('interaction')) {
                def.interaction.viewObject = vo;
                def.interaction.model = vo.model;
                vo.interactionHandler = new InteractionHandler(def.interaction);
            }
        }

    }

}