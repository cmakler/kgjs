/// <reference path="../kg.ts" />

module KG {

    export interface DragUpdateListenerDefinition extends UpdateListenerDefinition {
        dragDirections: string;
        dragParam: string;
        dragUpdateExpression: string;
    }

    export interface IDragUpdateListener extends IUpdateListener {
        dragDirections: "" | "x" | "y" | "xy";
        updateDrag: (scope: { params: {}, drag: {} }) => void;
    }

    export class DragUpdateListener extends UpdateListener implements IDragUpdateListener {

        public dragDirections;
        private dragParam;
        private dragUpdateExpression;

        constructor(def: DragUpdateListenerDefinition) {
            def.updatables = ['draggable','dragDirections'];
            def.constants = ['dragParam','dragUpdateExpression','name'];
            def = _.defaults(def, {dragDirections: "xy"});
            super(def);
        }

        updateDrag(scope) {
            const d = this;
            if (d.dragDirections.length > 0) {
                let compiledMath = math.compile(d.dragUpdateExpression);
                let parsedMath = compiledMath.eval(scope);
                d.model.updateParam(d.dragParam, parsedMath);
            }
        }

    }

}