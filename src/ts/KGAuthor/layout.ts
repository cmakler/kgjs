/// <reference path="../kg.ts" />

module KGAuthor {

    export class Layout extends AuthoringObject {

        parse_self(parsedData) {
            parsedData.aspectRatio = 2;
            return parsedData;
        }

    }

    export class SquareLayout extends Layout {

        // creates a square layout (aspect ratio of 1)

        parse_self(parsedData) {
            parsedData.aspectRatio = 1.22;
            return parsedData;
        }
    }

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

    export class SquarePlusSidebarLayout extends Layout {

        // creates a square within the main body of the text
        // to make a square graph, the ratio of width to height should be 0.82

        parse_self(parsedData) {
            parsedData.aspectRatio = 1.22;
            return parsedData;
        }

    }

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

    export class TwoVerticalGraphsPlusSidebar extends SquarePlusSidebarLayout {

        constructor(def) {
            super(def);

            const l = this;
            let topGraphDef = def['topGraph'],
                bottomGraphDef = def['bottomGraph'],
                sidebarDef = def['sidebar'];

            topGraphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.738,
                "height": 0.4
            };

            bottomGraphDef.position = {
                "x": 0.15,
                "y": 0.525,
                "width": 0.738,
                "height": 0.4
            };

            l.subObjects.push(new Graph(topGraphDef));
            l.subObjects.push(new Graph(bottomGraphDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }

    export class WideRectanglePlusSidebarLayout extends Layout {

        // creates a rectangle, twice as wide as it is high, within the main body of the text
        // to make a square graph, the ratio of width to height should be 0.41

        parse_self(parsedData) {
            parsedData.aspectRatio = 2.44;
            return parsedData;
        }

    }

    export class OneGraphPlusSidebar extends SquarePlusSidebarLayout {

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

    export class GeoGebraPlusSidebar extends SquarePlusSidebarLayout {

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

            l.subObjects.push(new Graph(leftGraphDef));
            l.subObjects.push(new Graph(rightGraphDef));
            l.subObjects.push(new Sidebar(sidebarDef));

        }


    }


}