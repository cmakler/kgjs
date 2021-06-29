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

    export class OneTree extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let treeDef = def['tree'];

            treeDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.74,
                "height": 0.9
            };

            l.subObjects.push(new Tree(treeDef));
        }
    }

    export class OneWideGraph extends WideRectangleLayout {

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

    export class OneTreePlusSidebar extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let treeDef = def['tree'],
                sidebarDef = def['sidebar'];

            treeDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.9
            };

            l.subObjects.push(new Tree(treeDef));
            l.subObjects.push(new Sidebar(sidebarDef));
        }
    }

    export class OneWideGraphPlusSidebar extends WideRectangleLayout {

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



    export class OneGraphPlusSidebarRoom200 extends OneGraphPlusSidebar {

        constructor(def) {
            super(def);
            this.aspectRatio = 2;
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

    export class MathboxPlusSidebar extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let mathboxDef = def['mathbox'],
                sidebarDef = def['sidebar'];

            mathboxDef.position = {
                "x": 0.025,
                "y": 0.025,
                "width": 0.95,
                "height": 0.95
            };

            l.subObjects.push(new MathboxContainer(mathboxDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }


    }




}