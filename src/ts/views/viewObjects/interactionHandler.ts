/// <reference path="../../kg.ts" />

module KG {

    export interface InteractionHandlerDefinition extends UpdateListenerDefinition {
        dragUpdates: DragUpdateListenerDefinition[];
    }

    export interface IInteractionHandler extends IUpdateListener {
        addTrigger: (el: HTMLElement) => void;
    }

    export class InteractionHandler extends UpdateListener implements IInteractionHandler {

        private scope: { params: {}, drag: {} };
        private dragUpdateListeners: DragUpdateListener[];
        private element;

        constructor(def: InteractionHandlerDefinition) {
            super(def);
            this.dragUpdateListeners = def.dragUpdates.map(function (d) {
                d.model = def.model;
                return new DragUpdateListener(d);
            });
            this.update(true);
            this.scope = {params: {}, drag: {}}
        }

        update(force) {
            let ih = super.update(force);

            // first update dragUpdateListeners
            if (ih.hasChanged && ih.hasOwnProperty('dragUpdateListeners') && (ih.element != undefined)) {
                let xDrag = false,
                    yDrag = false;
                ih.dragUpdateListeners.forEach(function (dul) {
                    dul.update(force);
                    if(dul.dragDirections == "x") {
                        xDrag = true;
                    } else if(dul.dragDirections == "y") {
                        yDrag = true;
                    } else if(dul.dragDirections == "xy") {
                        xDrag = true;
                        yDrag = true;
                    }
                });
                ih.element.style("pointer-events", (xDrag || yDrag) ? "all" : "none");
                ih.element.style("cursor", (xDrag && yDrag) ? "move" : xDrag ? "ew-resize" : "ns-resize");
                
            }
            return ih;
        }

        private startDrag(handler) {
            handler.scope.params = handler.model.currentParamValues();
            handler.scope.drag.x0 = handler.def.viewObject.xScale.scale.invert(d3.event.x);
            handler.scope.drag.y0 = handler.def.viewObject.yScale.scale.invert(d3.event.y);
        }

        private onDrag(handler) {

            let drag = handler.scope.drag;
            drag.x = handler.def.viewObject.xScale.scale.invert(d3.event.x);
            drag.y = handler.def.viewObject.yScale.scale.invert(d3.event.y);
            drag.dx = drag.x - drag.x0;
            drag.dy = drag.y - drag.y0;
            handler.dragUpdateListeners.forEach(function (d) {
                d.updateDrag(handler.scope)
            });
        }

        private endDrag(handler) {
            //console.log('finished dragging');
        }

        addTrigger(element) {
            let handler = this;
            handler.element = element;
            element.call(d3.drag()
                .on('start', function () {
                    handler.startDrag(handler)
                })
                .on('drag', function () {
                    handler.onDrag(handler)
                })
                .on('end', function () {
                    handler.endDrag(handler)
                })
            );
            handler.update(true);
        }

    }

}