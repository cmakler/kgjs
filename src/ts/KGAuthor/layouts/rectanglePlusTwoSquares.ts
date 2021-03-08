/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class RectanglePlusTwoSquaresPlusSidebar extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let topGraph = def['topGraph'],
                bottomLeftGraph = def['bottomLeftGraph'],
                bottomRightGraph = def['bottomRightGraph'],
                sidebarDef = def['sidebar'];

            topGraph.position = {
                "x": 0.15,
                "y": 0.05,
                "width": 0.8,
                "height": 0.4
            };

            bottomLeftGraph.position = {
                "x": 0.15,
                "y": 0.6,
                "width": 0.35,
                "height": 0.35
            };

            bottomRightGraph.position = {
                "x": 0.6,
                "y": 0.6,
                "width": 0.35,
                "height": 0.35
            };

            l.subObjects.push(new Graph(topGraph));
            l.subObjects.push(new Graph(bottomLeftGraph));
            l.subObjects.push(new Graph(bottomRightGraph));
            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }

    export class RectangleBelowTwoSquaresPlusSidebar extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let bottomGraph = def['bottomGraph'],
                topLeftGraph = def['topLeftGraph'],
                topRightGraph = def['topRightGraph'],
                sidebarDef = def['sidebar'];

            bottomGraph.position = {
                "x": 0.15,
                "y": 0.55,
                "width": 0.8,
                "height": 0.4
            };

            topLeftGraph.position = {
                "x": 0.15,
                "y": 0.05,
                "width": 0.35,
                "height": 0.35
            };

            topRightGraph.position = {
                "x": 0.6,
                "y": 0.05,
                "width": 0.35,
                "height": 0.35
            };

            l.subObjects.push(new Graph(bottomGraph));
            l.subObjects.push(new Graph(topLeftGraph));
            l.subObjects.push(new Graph(topRightGraph));
            l.subObjects.push(new Sidebar(sidebarDef));

        }

    }


}