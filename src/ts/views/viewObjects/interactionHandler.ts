/// <reference path="../../kg.ts" />

module KG {

    export interface DragUpdateListenerDefinition extends UpdateListenerDefinition {
        draggable: any;
        dragParam: string;
        dragUpdateExpression: string;
    }

    export interface IDragUpdateListener extends IUpdateListener {
        dragDirection: "x" | "y" | "both";
        updateDrag: (x: number, y: number, model: Model) => void;
    }

    export class DragUpdateListener extends UpdateListener {

        private draggable;
        private dragParam;
        private dragUpdateExpression;

        constructor(def: DragUpdateListenerDefinition) {
            def.updatables = ['draggable'];
            def.draggable = !!def.draggable;
            super(def);
            let d = this;
            d.dragParam = def.dragParam;
            d.dragUpdateExpression = def.dragUpdateExpression;

        }

        updateDrag(scope:{params: {}, drag: {}}) {
            const d = this;
            d.draggable = true; //TODO make things draggable or not
            if (d.draggable) {
                let compiledMath = math.compile(d.dragUpdateExpression);
                let parsedMath = compiledMath.eval(scope);
                d.model.updateParam(d.dragParam, parsedMath);
            }
        }

    }

    export interface InteractionHandlerDefinition extends UpdateListenerDefinition {
        dragUpdates: DragUpdateListenerDefinition[];
    }

    export interface IInteractionHandler extends IUpdateListener {
        addTrigger: (el: HTMLElement) => void;
    }

    export class InteractionHandler extends UpdateListener implements IInteractionHandler {

        private scope: {params: {}, drag: {}};
        private dragUpdateListeners: DragUpdateListener[];

        constructor(def: InteractionHandlerDefinition) {
            def.updatables = ['xDrag', 'yDrag'];
            super(def);
            this.update(true);
            this.dragUpdateListeners = def.dragUpdates.map(function (d) {
                d.model = def.model;
                return new DragUpdateListener(d)
            });
            this.scope = {params: {}, drag: {}}
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
            console.log('finished dragging');
        }

        addTrigger(element) {
            let handler = this;
            element.call(d3.drag()
                .on('start', function () {
                    handler.startDrag(handler)
                })
                .on('drag', function () {
                    handler.onDrag(handler)
                })
                .on('end', function() {
                    handler.endDrag(handler)
                })
            );
        }

    }

}