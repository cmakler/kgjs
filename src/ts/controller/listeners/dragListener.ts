/// <reference path="../../kg.ts" />

module KG {

    export interface DragListenerDefinition extends ListenerDefinition {
        draggable?: string;
        directions: string;
    }

    export interface IDragListener extends IListener {
        draggable: boolean;
        directions: "" | "x" | "y" | "xy";
    }

    /*

        A DragListener is a special kind of Listener that listens for drag events.
        In addition to a param and an expression, it has properties for whether it is draggable
        and, if so, in which directions it is draggable.

     */

    export class DragListener extends Listener implements IDragListener {

        public directions;
        public draggable;

        constructor(def: DragListenerDefinition) {
            def = _.defaults(def, {
                directions: "xy",
                updatables: []
            });
            def.updatables = def.updatables.concat(['draggable', 'directions']);
            super(def);
        }

        update(force) {
            let dl = super.update(force);
            if(!dl.def.hasOwnProperty('draggable')) {
                dl.draggable = (dl.directions.length > 0);
            }
            return dl;
        }

    }

}