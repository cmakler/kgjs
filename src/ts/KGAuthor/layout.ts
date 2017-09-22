/// <reference path="../kg.ts" />

module KGAuthor {

    export class Layout extends AuthoringObject {

        parse_self(parsedData) {
            parsedData.aspectRatio = 2;
            return parsedData;
        }

    }

    export class SidebarLayout extends Layout {

        parse_self(parsedData) {
            parsedData.aspectRatio = 1.22;
            return parsedData;
        }

    }

    export class OneGraphPlusSidebar extends SidebarLayout {

        constructor(def) {
            super(def);

            const l = this;
            let graphDef = def['graph'],
                sidebarDef = def['sidebar'];

            graphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.9
            };

            l.subObjects.push(new Graph(graphDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }


    }


}