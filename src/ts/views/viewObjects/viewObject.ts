/// <reference path="../../kg.ts" />

module KG {

    export interface ViewObjectDefinition extends UpdateListenerDefinition {
        view: View;
        layer: any;
        name?: string;
        xScaleName?: string;
        yScaleName?: string;
        clipPath?: string;
        show?: any;
        interaction?: InteractionHandlerDefinition;
    }

    export interface IViewObject extends IUpdateListener {
        xScale: Scale;
        yScale: Scale;
        clipPath: ClipPath;
        interactionHandler: InteractionHandler;
        draw: (layer: any) => ViewObject;
    }

    export class ViewObject extends UpdateListener implements IViewObject {

        public name;
        public xScale;
        public yScale;
        public clipPath;
        public interactionHandler: InteractionHandler;

        constructor(def: ViewObjectDefinition) {
            def = _.defaults(def,{show: true});
            super(def);

            let vo = this;

            // the scales determine the coordinate system for this viewObject
            vo.xScale = def.view.scales[def.xScaleName];
            vo.yScale = def.view.scales[def.yScaleName];

            // the clip path clips the viewObject
            if(vo.hasOwnProperty('clipPath')) {
                vo.clipPath = def.view.clipPaths[def.clipPath];
            }

            // the interaction handler manages drag and hover events
            def.interaction = _.defaults(def.interaction || {}, {
                viewObject: vo,
                model: vo.model,
                dragUpdates: []
            });
            vo.interactionHandler = new InteractionHandler(def.interaction);

            // the draw method creates the DOM elements for the view object
            // the update method updates their attributes
            vo.draw(def.layer).update(true);
        }

        draw(layer) {
            return this;
        }

    }

}