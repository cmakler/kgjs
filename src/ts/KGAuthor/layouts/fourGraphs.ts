/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class FourGraphs extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let topLeftGraphDef = def['topLeftGraph'],
                bottomLeftGraphDef = def['bottomLeftGraph'],
                topRightGraphDef = def['topRightGraph'],
                bottomRightGraphDef = def['bottomRightGraph'];

            const leftX = 0.05, rightX = 0.55, topY = 0.025, bottomY = 0.525;

            topLeftGraphDef.position = {
                "x": leftX,
                "y": topY,
                "width": 0.4,
                "height": 0.4
            };

            bottomLeftGraphDef.position = {
                "x": leftX,
                "y": bottomY,
                "width": 0.4,
                "height": 0.4
            };

            topRightGraphDef.position = {
                "x": rightX,
                "y": topY,
                "width": 0.4,
                "height": 0.4
            };

            bottomRightGraphDef.position = {
                "x": rightX,
                "y": bottomY,
                "width": 0.4,
                "height": 0.4
            };

            l.subObjects.push(new Graph(topLeftGraphDef));
            l.subObjects.push(new Graph(bottomLeftGraphDef));
            l.subObjects.push(new Graph(topRightGraphDef));
            l.subObjects.push(new Graph(bottomRightGraphDef));


        }

    }

    export class FourGraphsPlusSidebar extends FourGraphs {

        constructor(def) {
            super(def);

            const l = this;
            let sidebarDef = def['sidebar'];

            l.subObjects.push(new Sidebar(sidebarDef))


        }

    }


}