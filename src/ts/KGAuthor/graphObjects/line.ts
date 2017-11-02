/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export class Line extends Curve {

        constructor(def, graph) {

            const intercept = subtractDefs(def.point[1],multiplyDefs(def.slope,def.point[0]));

            def.univariateFunction = {
                fn: `${intercept} + (${def.slope})*(x)`,
                samplePoints: 2
            };

            super(def, graph);
        }

    }

}