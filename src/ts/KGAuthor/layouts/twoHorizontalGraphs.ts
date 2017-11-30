/// <reference path="../kgAuthor.ts" />

module KGAuthor {


    export class TwoHorizontalGraphs extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let leftGraphDef = def['leftGraph'],
                rightGraphDef = def['rightGraph'];

            leftGraphDef.position = {
                "x": 0.05,
                "y": 0.025,
                "width": 0.45,
                "height": 0.9
            };

            rightGraphDef.position = {
                "x": 0.55,
                "y": 0.025,
                "width": 0.45,
                "height": 0.9
            };

            l.subObjects.push(new Graph(leftGraphDef));
            l.subObjects.push(new Graph(rightGraphDef));

        }

    }

    export class TwoHorizontalGraphsPlusSidebar extends WideRectanglePlusSidebarLayout {

        constructor(def) {
            super(def);

            const l = this;
            let leftGraphDef = def['leftGraph'],
                rightGraphDef = def['rightGraph'],
                sidebarDef = def['sidebar'];

            leftGraphDef.position = {
                "x": 0.1,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };

            rightGraphDef.position = {
                "x": 0.6,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };

            const leftGraph = new Graph(leftGraphDef),
                rightGraph = new Graph(rightGraphDef),
                sidebar = new Sidebar(sidebarDef);

            l.subObjects.push(leftGraph);
            l.subObjects.push(rightGraph);
            l.subObjects.push(sidebar);

        }

    }

    export class GeoGebraPlusGraph extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let ggbAppletDef = def['ggbApplet'],
                graphDef = def['graph'];

            ggbAppletDef.position = {
                "x": 0.05,
                "y": 0.025,
                "width": 0.45,
                "height": 0.9
            };

            graphDef.position = {
                "x": 0.6,
                "y": 0.2,
                "width": 0.3,
                "height": 0.6
            };

            l.subObjects.push(new GeoGebraContainer(ggbAppletDef));
            l.subObjects.push(new Graph(graphDef));

        }

    }

    export class GeoGebraPlusGraphPlusSidebar extends WideRectanglePlusSidebarLayout {

        constructor(def) {
            super(def);

            const l = this;
            let ggbAppletDef = def['ggbApplet'],
                graphDef = def['graph'],
                sidebarDef = def['sidebar'];

            ggbAppletDef.position = {
                "x": 0.1,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };

            graphDef.position = {
                "x": 0.6,
                "y": 0.025,
                "width": 0.369,
                "height": 0.9
            };

            l.subObjects.push(new GeoGebraContainer(ggbAppletDef));
            l.subObjects.push(new Graph(graphDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }


    }




}