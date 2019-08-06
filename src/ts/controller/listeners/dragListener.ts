/// <reference path="../../kg.ts" />

module KG {

    export interface DragListenerDefinition extends ListenerDefinition {
        draggable?: string;
        directions?: string;
        vertical?: string;
        horizontal?: string;
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
            if(def.hasOwnProperty('vertical')) {
                def.directions = 'y';
                def.param = def.vertical;
                def.expression = `params.${def.vertical} + drag.dy`
            }
            if(def.hasOwnProperty('horizontal')) {
                def.directions = 'x';
                def.param = def.horizontal;
                def.expression = `params.${def.horizontal} + drag.dx`
            }
            setDefaults(def, {
                directions: "xy"
            });
            setProperties(def, 'updatables',['draggable', 'directions']);
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