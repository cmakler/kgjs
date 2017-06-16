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

        updateDrag(coords) {
            const d = this;
            d.draggable = true; //TODO make things draggable or not
            if (d.draggable) {
                let compiledMath = math.compile(d.dragUpdateExpression);
                let parsedMath = compiledMath.eval(coords);
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

        private scope: number;
        private dragUpdateListeners: DragUpdateListener[];

        constructor(def: InteractionHandlerDefinition) {
            def.updatables = ['xDrag', 'yDrag'];
            super(def);
            this.update();
            this.dragUpdateListeners = def.dragUpdates.map(function (d) {
                d.model = def.model;
                return new DragUpdateListener(d)
            });
        }

        private startDrag(handler) {
            handler.scope = _.defaults(handler.model.currentParamValues(),{
                x0: handler.def.viewObject.xScale.invert(d3.event.x),
                y0: handler.def.viewObject.yScale.invert(d3.event.y)
            });
        }

        private onDrag(handler) {

            handler.scope.x = handler.def.viewObject.xScale.invert(d3.event.x);
            handler.scope.y = handler.def.viewObject.yScale.invert(d3.event.y);
            handler.scope.dx = handler.scope.x - handler.scope.x0;
            handler.scope.dy = handler.scope.y - handler.scope.y0;

            handler.dragUpdateListeners.forEach(function (d) {
                d.updateDrag(handler.scope)
            });
        }

        private endDrag(handler) {
            handler.scope = {};
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