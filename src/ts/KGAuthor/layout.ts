/// <reference path="../kg.ts" />

module KGAuthor {

    export class Layout extends AuthoringObject {

        parse_self(parsedData) {
            parsedData.aspectRatio = 2;
            return parsedData;
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

            console.log(l.subObjects);

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