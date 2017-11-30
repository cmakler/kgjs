/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface ControlsDefinition extends DivObjectDefinition {

    }

    export class Controls extends DivObject {

        constructor(def:SidebarDefinition) {
            super(def);
            this.type = 'Controls';
        }

    }




}