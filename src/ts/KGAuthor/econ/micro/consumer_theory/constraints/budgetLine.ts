/// <reference path="../../../eg.ts"/>

module KGAuthor {

    import setDefaults = KG.setDefaults;

    export interface EconBudgetLineDefinition {
        p1?: string | number;
        p2?: string | number;
        m?: string | number;
        point?: (string|number)[];
        label?: string;
        set?: string;
        costlier?: string;

    }

    export class EconBudgetLine extends Segment {

        public p1;
        public p2;
        public m;
        public xIntercept;
        public yIntercept;
        private xInterceptPoint;
        private yInterceptPoint;
        private budgetSetArea;
        private costlierArea;

        constructor(def, graph) {

            def = setStrokeColor(def);

            // may define income either by income m or value of endowment point
            def.m = def.m || addDefs(multiplyDefs(def.p1,def.point[0]),multiplyDefs(def.p2,def.point[1]));

            const xIntercept = divideDefs(def.m, def.p1),
                yIntercept = divideDefs(def.m, def.p2),
                priceRatio = divideDefs(def.p1, def.p2);

            KG.setDefaults(def, {
                a: [xIntercept, 0],
                b: [0, yIntercept],
                stroke: 'colors.budget',
                strokeWidth: 2,
                label: 'BL',
                lineStyle: 'solid'
            });

            if (def.draggable && typeof(def.m) == 'string') {
                def.drag = [{
                    'directions': 'xy',
                    'param': paramName(def.m),
                    'expression': addDefs(multiplyDefs('drag.x', def.p1), multiplyDefs('drag.y', def.p2))
                }]
            }

            super(def, graph);

            let bl = this;

            bl.p1 = def.p1;
            bl.p2 = def.p2;
            bl.m = def.m;
            bl.xIntercept = xIntercept;
            bl.yIntercept = yIntercept;


            if (graph) {
                const subObjects = bl.subObjects;

                let xInterceptPointDef = {
                    coordinates: [xIntercept, 0],
                    fill: def.stroke,
                    r: 4
                };

                if(def.draggable && typeof(def.p1) == 'string') {
                    xInterceptPointDef['drag'] = [{
                        directions: 'x',
                        param: paramName(def.p1),
                        expression: divideDefs(def.m, 'drag.x')
                    }]
                }

                bl.xInterceptPoint = new Point(xInterceptPointDef, graph);

                let yInterceptPointDef = {
                    coordinates: [0, yIntercept],
                    fill: def.stroke,
                    r: 4
                };

                if(def.draggable && typeof(def.p2) == 'string') {
                    yInterceptPointDef['drag'] = [{
                        directions: 'y',
                        param: paramName(def.p2),
                        expression: divideDefs(def.m, 'drag.y')
                    }]
                }

                bl.yInterceptPoint = new Point(yInterceptPointDef, graph);

                bl.budgetSetArea = new Area({
                    fill: "colors.budget",
                    univariateFunction1: {
                        fn: `${yIntercept} - ${priceRatio}*x`,
                        samplePoints: 2,
                        max: xIntercept
                    },
                    show: def.set
                }, graph);

                bl.costlierArea = new Area({
                    fill: "colors.costlier",
                    univariateFunction1: {
                        fn: `${yIntercept} - ${priceRatio}*x`,
                        samplePoints: 2
                    },
                    show: def.costlier,
                    above: true
                }, graph);

                if (def.handles) {
                    subObjects.push(bl.xInterceptPoint);
                    subObjects.push(bl.yInterceptPoint);
                }

                if (def.set) {
                    subObjects.push(bl.budgetSetArea);
                }

                if (def.costlier) {
                    subObjects.push(bl.costlierArea);
                }
            }

        }
    }

}