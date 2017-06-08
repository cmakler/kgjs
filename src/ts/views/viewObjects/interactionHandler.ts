/// <reference path="../../kg.ts" />

module KG {

    export interface InteractionHandlerDefintion extends UpdateListenerDefinition {
        viewObject: ViewObject;
        xDrag?: any;
        yDrag?: any;
        xDragUpdateParam?: string;
        yDragUpdateParam?: string;
        xDragUpdateValue?: string;
        yDragUpdateValue?: string;
    }

    export interface IInteractionHandler {
        viewObject: View;
        xDrag?: any;
        yDrag?: any;
        xDragUpdateParam?: string;
        yDragUpdateParam?: string;
        xDragUpdateValue?: string;
        yDragUpdateValue?: string;
        xDragFunction: () => any;
        yDragFunction: () => any;
        addTrigger: (el:HTMLElement) => InteractionHandler;
    }

    export class InteractionHandler extends UpdateListener implements IInteractionHandler {

        public viewObject;
        public elements: HTMLElement[];
        public xDrag;
        public yDrag;
        public xDragUpdateParam;
        public yDragUpdateParam;
        public xDragUpdateValue;
        public yDragUpdateValue;

        constructor(def:InteractionHandlerDefintion) {
            super(def);
            let handler = this;
            handler.viewObject = def.viewObject;
            handler.xDrag = def.xDrag;
            handler.yDrag = def.yDrag;
            handler.xDragUpdateParam = def.xDragUpdateParam;
            handler.yDragUpdateParam = def.yDragUpdateParam;
            handler.xDragUpdateValue = def.xDragUpdateValue;
            handler.yDragUpdateValue = def.yDragUpdateValue;
            handler.elements = [];
        }

        xDragFunction() {
            return this;
        }

        yDragFunction() {
            return this;
        }

        addTrigger(element) {
            return this;
        }

    }

}