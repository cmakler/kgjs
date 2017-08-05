/// <reference path="../../kg.ts" />

module KG {

    export interface ViewObjectDefinition extends UpdateListenerDefinition {
        layer: any;
        name?: string;
        show?: any;
        xScale: Scale;
        yScale: Scale;
        clipPath: ClipPath;
        drag?: DragListenerDefinition[];
        click?: ClickListenerDefinition[];
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
                def.drag = def.drag || [];
                const dragListeners = def.drag.map(function(dragDef) {
                    dragDef.model = vo.model;
                    return new DragListener(dragDef)
                });
                def.click = def.click || [];
                const clickListeners = def.click.map(function(clickDef) {
                    clickDef.model = vo.model;
                    return new ClickListener(clickDef)
                });
                vo.interactionHandler = new InteractionHandler({
                    viewObject: vo,
                    model: vo.model,
                    dragListeners: dragListeners,
                    clickListeners: clickListeners
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