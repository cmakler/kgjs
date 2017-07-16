/// <reference path="../kg.ts" />

module KG {

    export interface InteractionHandlerDefinition extends UpdateListenerDefinition {
        viewObject: ViewObject;
        dragListeners: DragListener[];
        clickListeners: ClickListener[];
    }

    export interface IInteractionHandler extends IUpdateListener {
        addTrigger: (el: HTMLElement) => void;
    }

    export class InteractionHandler extends UpdateListener implements IInteractionHandler {

        private scope: { params: any, drag: any };
        private dragListeners: DragListener[];
        private clickListeners: ClickListener[];
        private element;

        constructor(def: InteractionHandlerDefinition) {
            def = _.defaults(def, {constants: [], dragListeners: [], clickListeners: []});
            def.constants = def.constants.concat(["dragListeners", "clickListeners"]);
            super(def);
            this.update(true);
            this.scope = {params: {}, drag: {}}
        }

        update(force) {
            let ih = super.update(force);

            // first update dragListeners
            if (ih.hasChanged && ih.hasOwnProperty('dragListeners') && (ih.element != undefined)) {
                let xDrag = false,
                    yDrag = false;
                ih.dragListeners.forEach(function (dul) {
                    dul.update(force);
                    if (dul.dragDirections == "x") {
                        xDrag = true;
                    } else if (dul.dragDirections == "y") {
                        yDrag = true;
                    } else if (dul.dragDirections == "xy") {
                        xDrag = true;
                        yDrag = true;
                    }
                });
                ih.element.style("pointer-events", (xDrag || yDrag) ? "all" : "none");
                ih.element.style("cursor", (xDrag && yDrag) ? "move" : xDrag ? "ew-resize" : "ns-resize");
            }
            return ih;
        }

        addTrigger(element) {
            let handler = this;
            handler.element = element;

            // add click listeners
            if (handler.clickListeners.length > 0) {
                element.on("click", function () {
                    if (d3.event.defaultPrevented) return; //dragged)
                    handler.scope.params = handler.model.currentParamValues();
                    handler.clickListeners.forEach(function (d) {
                        d.onChange(handler.scope)
                    });
                })
            }

            // add drag listeners
            if (handler.dragListeners.length > 0) {
                element.call(d3.drag()
                    .on('start', function () {
                        handler.scope.params = handler.model.currentParamValues();
                        handler.scope.drag.x0 = handler.def.viewObject.xScale.scale.invert(d3.event.x);
                        handler.scope.drag.y0 = handler.def.viewObject.yScale.scale.invert(d3.event.y);
                    })
                    .on('drag', function () {
                        let drag = handler.scope.drag;
                        drag.x = handler.def.viewObject.xScale.scale.invert(d3.event.x);
                        drag.y = handler.def.viewObject.yScale.scale.invert(d3.event.y);
                        drag.dx = drag.x - drag.x0;
                        drag.dy = drag.y - drag.y0;
                        handler.dragListeners.forEach(function (d) {
                            d.onChange(handler.scope)
                        });
                    })
                    .on('end', function () {
                        //handler.element.style("cursor","default");
                    })
                );
            }

            handler.update(true);
        }

    }

}