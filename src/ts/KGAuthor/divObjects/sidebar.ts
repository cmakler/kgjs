/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface SidebarDefinition extends DivObjectDefinition {
        controls: ControlsDefinition[]
    }

    export class Sidebar extends DivObject {

        constructor(def: SidebarDefinition) {

            def.controls.forEach(function (controlDef) {
                parseControlsDef(controlDef);
            });

            super(def);
            this.type = 'Sidebar';

        }

    }


}