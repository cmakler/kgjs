/// <reference path="../../kg.ts" />

module KG {

    export interface ViewObjectDefinition extends UpdateListenerDefinition {
        view: View;
        layer: any;
        xScaleName?: string;
        yScaleName?: string;
        interaction?: InteractionHandlerDefintion;
    }

    export interface IViewObject {
        view: View;
        model: Model;
        update: () => ViewObject;
        xScale: Scale;
        yScale: Scale;
        interactionHandler: InteractionHandler;
    }

    export class ViewObject extends UpdateListener implements IViewObject {

        public view;
        public model;
        public xScale;
        public yScale;
        public interactionHandler;

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
                vo.interactionHandler = new InteractionHandler(def.interaction);
            }
        }

    }

}