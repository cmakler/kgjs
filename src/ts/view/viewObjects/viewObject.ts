/// <reference path="../../kg.ts" />

module KG {

    export interface ViewObjectDefinition extends UpdateListenerDefinition {
        layer: any;
        name?: string;
        show?: any;
        xScale: Scale;
        yScale: Scale;
        clipPath: ClipPath;
        dragUpdates?: DragUpdateListener[];
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

        public fill;
        public opacity;
        public stroke;
        public strokeWidth;
        public strokeOpacity;

        constructor(def: ViewObjectDefinition) {
            def.updatables = (def.updatables || []).concat('fill','stroke','strokeWidth','opacity','strokeOpacity');
            def.constants = (def.constants || []).concat(['xScale','yScale','clipPath','name']);
            def = _.defaults(def,{show: true});
            super(def);

            let vo = this;

            // the interaction handler manages drag and hover events
            vo.interactionHandler = new InteractionHandler({
                viewObject: vo,
                model: vo.model,
                dragUpdateListeners: def.dragUpdates || []
            });

            // the draw method creates the DOM elements for the view object
            // the update method updates their attributes
            vo.draw(def.layer).update(true);
        }

        draw(layer) {
            return this;
        }

    }

}