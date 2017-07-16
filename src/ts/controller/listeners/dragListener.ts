/// <reference path="../../kg.ts" />

module KG {

    export interface DragListenerDefinition extends ListenerDefinition {
        draggable?: string;
        dragDirections: string;
    }

    export interface IDragListener extends IListener {
        draggable: boolean;
        dragDirections: "" | "x" | "y" | "xy";
    }

    /*

        A DragListener is a special kind of Listener that listens for drag events.
        In addition to a param and an expression, it has properties for whether it is draggable
        and, if so, in which directions it is draggable.

     */

    export class DragListener extends Listener implements IDragListener {

        public dragDirections;
        public draggable;

        constructor(def: DragListenerDefinition) {
            def = _.defaults(def, {dragDirections: "xy", updatables: []});
            def.updatables = def.updatables.concat(['draggable', 'dragDirections']);
            super(def);
        }

        update(force) {
            let dl = super.update(force);
            if(!dl.def.hasOwnProperty('draggable')) {
                dl.draggable = (dl.dragDirections.length > 0);
            }
            return dl;
        }

    }

}