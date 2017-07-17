/// <reference path="../../kg.ts" />

module KG {

    export interface ViewObjectDefinition extends UpdateListenerDefinition {
        layer: any;
        name?: string;
        show?: any;
        xScale: Scale;
        yScale: Scale;
        clipPath: ClipPath;
        dragListeners?: DragListener[];
        clickListeners?: ClickListener[];
        interactive?: boolean;
    }

    export interface IViewObject extends IUpdateListener {
        xScale: Scale;
        yScale: Scale;
        clipPath: ClipPath;
        interactionHandler: InteractionHandler;
        draw: (layer: any) => ViewObject;
    }

    export class ViewObject extends UpdateListener implements IViewObject {

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
            def = _.defaults(def, {
                updatables: [],
                constants: [],
                interactive: true,
                stroke: 'black',
                strokeWidth: 1,
                show: true
            });
            def.updatables = def.updatables.concat('fill', 'stroke', 'strokeWidth', 'opacity', 'strokeOpacity');
            def.constants = def.constants.concat(['xScale', 'yScale', 'clipPath']);

            super(def);

            let vo = this;

            // the interaction handler manages drag and hover events
            if (def.interactive) {
                vo.interactionHandler = new InteractionHandler({
                    viewObject: vo,
                    model: vo.model,
                    dragListeners: def.dragListeners || [],
                    clickListeners: def.clickListeners || []
                });
            }

            // the draw method creates the DOM elements for the view object
            // the update method updates their attributes
            if (def.hasOwnProperty('layer')) {
                vo.draw(def.layer).update(true);
            }
        }

        draw(layer) {
            return this;
        }

    }

}