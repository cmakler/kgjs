/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class SquarePlusTwoVerticalGraphs extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            let bigGraphDef = def['bigGraph'],
                topGraphDef = def['topGraph'],
                bottomGraphDef = def['bottomGraph'];

            bigGraphDef.position = {
                "x": 0.05,
                "y": 0.025,
                "width": 0.5,
                "height": 0.9
            };

            topGraphDef.position = {
                "x": 0.6,
                "y": 0.025,
                "width": 0.35,
                "height": 0.4
            };

            bottomGraphDef.position = {
                "x": 0.6,
                "y": 0.525,
                "width": 0.35,
                "height": 0.4
            };

            l.subObjects.push(new Graph(bigGraphDef));
            l.subObjects.push(new Graph(topGraphDef));
            l.subObjects.push(new Graph(bottomGraphDef));


        }

    }

    export class TwoVerticalSquaresOneBigSquare extends Layout {

        constructor(def) {
            super(def);

            const l = this;
            l.aspectRatio = 1.6;

            let bigGraphDef = def['bigGraph'],
                topGraphDef = def['topGraph'],
                bottomGraphDef = def['bottomGraph'];

            topGraphDef.position = {
                "x": 0.125,
                "y": 0.06,
                "width": 0.225,
                "height": 0.36
            };

            bottomGraphDef.position = {
                "x": 0.125,
                "y": 0.5,
                "width": 0.225,
                "height": 0.36
            };

            bigGraphDef.position = {
                "x": 0.5,
                "y": 0.06,
                "width": 0.5,
                "height": 0.8
            };

            l.subObjects.push(new Graph(bigGraphDef));
            l.subObjects.push(new Graph(topGraphDef));
            l.subObjects.push(new Graph(bottomGraphDef));


        }

    }


}