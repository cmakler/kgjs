/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class TwoVerticalGraphs extends SquareLayout {

        constructor(def) {
            super(def);

            const l = this;
            let topGraphDef = def['topGraph'],
                bottomGraphDef = def['bottomGraph'];

            topGraphDef.position = {
                "x": 0.15,
                "y": 0.025,
                "width": 0.8,
                "height": 0.4
            };

            bottomGraphDef.position = {
                "x": 0.15,
                "y": 0.525,
                "width": 0.8,
                "height": 0.4
            };

            const topGraph = new Graph(topGraphDef),
                bottomGraph = new Graph(bottomGraphDef);

            topGraph.subObjects.forEach(function(obj) {obj.addSecondGraph(bottomGraph)});
            bottomGraph.subObjects.forEach(function(obj) {obj.addSecondGraph(topGraph)});

            l.subObjects.push(topGraph);
            l.subObjects.push(bottomGraph);

        }

    }


    export class TwoVerticalGraphsPlusSidebar extends SquareLayout {

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

            const topGraph = new Graph(topGraphDef),
                bottomGraph = new Graph(bottomGraphDef),
                sidebar = new Sidebar(sidebarDef);

            topGraph.subObjects.forEach(function(obj) {obj.addSecondGraph(bottomGraph)});
            bottomGraph.subObjects.forEach(function(obj) {obj.addSecondGraph(topGraph)});

            l.subObjects.push(topGraph);
            l.subObjects.push(bottomGraph);
            l.subObjects.push(sidebar);

        }

    }

    export class TwoVerticalGraphsRoom200 extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let topGraphDef = def['topGraph'],
                bottomGraphDef = def['bottomGraph'];

            topGraphDef.position = {
                "x": 0.1,
                "y": 0,
                "width": 0.85,
                "height": 0.4
            };

            bottomGraphDef.position = {
                "x": 0.1,
                "y": 0.62,
                "width": 0.85,
                "height": 0.38
            };

            const topGraph = new Graph(topGraphDef),
                bottomGraph = new Graph(bottomGraphDef);

            topGraph.subObjects.forEach(function(obj) {obj.addSecondGraph(bottomGraph)});
            bottomGraph.subObjects.forEach(function(obj) {obj.addSecondGraph(topGraph)});

            l.subObjects.push(topGraph);
            l.subObjects.push(bottomGraph);
            l.aspectRatio = 1.3

        }

    }



}