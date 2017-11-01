/// <reference path="../../kg.ts" />

module KGAuthor {

    export interface SidebarDefinition extends DivObjectDefinition {

    }

    export class Sidebar extends DivObject {

        constructor(def:SidebarDefinition) {
            super(def);
            this.type = 'Sidebar';
        }

    }




}