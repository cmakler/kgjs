/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class HTMLLayout extends Layout {

        constructor(def) {
            super(def);
            const l = this;
            l.nosvg = true;
            let divDef = {"html": def['html']};
            l.subObjects.push(new Div(divDef));

        }

    }

    export class HTMLPlusSidebarLayout extends HTMLLayout {

        constructor(def) {
            super(def);

            const l = this;

            l.nosvg = true;

            let sidebarDef = def['sidebar'];

            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }

}