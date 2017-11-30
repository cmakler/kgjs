/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class OneGraph extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let graphDef = def['graph'];

            graphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.74,
                "height": 0.9
            };

            l.subObjects.push(new Graph(graphDef));
        }
    }

    export class OneGraphPlusSidebar extends SquareLayout {

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

    export class GeoGebraPlusSidebar extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let ggbAppletDef = def['ggbApplet'],
                sidebarDef = def['sidebar'];

            ggbAppletDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.9
            };

            l.subObjects.push(new GeoGebraContainer(ggbAppletDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }




}