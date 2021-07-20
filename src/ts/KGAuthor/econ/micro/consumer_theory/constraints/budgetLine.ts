/// <reference path="../../../eg.ts"/>

module KGAuthor {

    export function extractBudgetLine(def, graph) {
        if (def.hasOwnProperty('budgetLineObject')) {
            return def.budgetLineObject;
        }
        if (def.hasOwnProperty('budgetLine')) {
            let budgetDef = JSON.parse(JSON.stringify(def.budgetLine));
            budgetDef.show = budgetDef.show || def.show;
            if(!budgetDef.hasOwnProperty('m')) {
                if(def.hasOwnProperty('point') && def.point.length == 2) {
                    budgetDef.point = def.point;
                }
                if(def.hasOwnProperty('coordinates') && def.coordinates.length == 2) {
                    budgetDef.point = def.coordinates;
                }
                if(def.hasOwnProperty('x') && def.hasOwnProperty('y')) {
                    budgetDef.x = def.x;
                    budgetDef.y = def.y;
                }
            }
            budgetDef.color = budgetDef.color || def.color;
            return new EconBudgetLine(budgetDef, graph);
        }
        //console.log('tried to instantiate a budget line without either a budget line def or object')
    }

    export interface EconBudgetLineDefinition  {
        p1?: string | number;
        p2?: string | number;
        m?: string | number;
        point?: (string | number)[];
        label?: string;
        set?: string;
        costlier?: string;
        xInterceptLabel?: string;
        yInterceptLabel?: string;
        buyOnly?: boolean;
        sellOnly?: boolean;
    }

    export class EconBudgetLine extends Segment {

        public p1;
        public p2;
        public m;
        public point;
        public xIntercept;
        public yIntercept;
        private xInterceptPoint;
        private yInterceptPoint;
        private budgetSetArea;
        private costlierArea;
        private priceRatio;
        public endowment;

        constructor(def, graph) {

            def = setStrokeColor(def);

            def.name = def.name || 'BL' + KG.randomString(5);

            // may define income either by income m or value of endowment point
            if(!def.hasOwnProperty('m')) {
                if(def.hasOwnProperty('x') && def.hasOwnProperty('y')) {
                    def.point = [def.x,def.y];
                }
                if(def.hasOwnProperty('point') && def.point.length == 2) {
                    def.m = addDefs(multiplyDefs(def.p1, def.point[0]), multiplyDefs(def.p2, def.point[1]))
                }
            }

            const xIntercept = divideDefs(def.m, def.p1),
                yIntercept = divideDefs(def.m, def.p2),
                priceRatio = divideDefs(def.p1, def.p2),
                endowment = {x: def.x, y: def.y};

            console.log('xIntercept', xIntercept);

            if (def.inMap) {
                def.strokeWidth = 1;
                def.lineStyle = 'dotted';
                def.layer = 0;
                def.handles = false;
                def.draggable = false;
            }

            KG.setDefaults(def, {
                a: [`calcs.${def.name}.xIntercept`, 0],
                b: [0, `calcs.${def.name}.yIntercept`],
                color: 'colors.budget',
                strokeWidth: 2,
                lineStyle: 'solid',
                buyOnly: false,
                sellOnly: false
            });

            if(def.sellOnly) {
                def.a = [def.x, def.y]
            }

            if(def.buyOnly) {
                def.b = [def.x, def.y]
            }

            if (def.draggable && typeof(def.m) == 'string') {
                def.drag = [{
                    'directions': 'xy',
                    'param': paramName(def.m),
                    'expression': addDefs(multiplyDefs('drag.x', def.p1), multiplyDefs('drag.y', def.p2))
                }]
            }

            if (!def.inMap) {
                def.label = KG.setDefaults(def.label || {}, {
                    text: "BL",
                    location: def.sellOnly ? 0.1 : 0.9
                });
            }

            super(def, graph);

            let bl = this;

            bl.p1 = def.p1;
            bl.p2 = def.p2;
            bl.m = def.m;
            bl.xIntercept = xIntercept;
            bl.yIntercept = yIntercept;
            bl.priceRatio = priceRatio;
            bl.point = def.point;
            bl.endowment = endowment;


            if (graph) {
                const subObjects = bl.subObjects;


                let xInterceptPointDef = {
                    coordinates: [`calcs.${bl.name}.xIntercept`, 0],
                    color: def.stroke,
                    r: 4
                };

                if (def.draggable && typeof(def.p1) == 'string') {
                    xInterceptPointDef['drag'] = [{
                        directions: 'x',
                        param: paramName(def.p1),
                        expression: divideDefs(`calcs.${bl.name}.m`, 'drag.x')
                    }]
                }

                if (def.hasOwnProperty('xInterceptLabel')) {
                    xInterceptPointDef['droplines'] = {
                        vertical: def.xInterceptLabel
                    }
                }

                bl.xInterceptPoint = new Point(xInterceptPointDef, graph);

                let yInterceptPointDef = {
                    coordinates: [0, `calcs.${bl.name}.yIntercept`],
                    color: def.stroke,
                    r: 4
                };

                if (def.draggable && typeof(def.p2) == 'string') {
                    yInterceptPointDef['drag'] = [{
                        directions: 'y',
                        param: paramName(def.p2),
                        expression: divideDefs('calcs.'+bl.name+'.m', 'drag.y')
                    }]
                }

                if (def.hasOwnProperty('yInterceptLabel')) {
                    yInterceptPointDef['droplines'] = {
                        horizontal: def.yInterceptLabel
                    }
                }

                bl.yInterceptPoint = new Point(yInterceptPointDef, graph);

                bl.budgetSetArea = new Area({
                    fill: "colors.budget",
                    univariateFunction1: {
                        fn: `calcs.${bl.name}.yIntercept - calcs.${bl.name}.priceRatio*(x)`,
                        samplePoints: 2,
                        max: `calcs.${bl.name}.xIntercept`
                    },
                    show: def.set
                }, graph);

                bl.costlierArea = new Area({
                    fill: "colors.costlier",
                    univariateFunction1: {
                        fn: `calcs.${bl.name}.yIntercept - calcs.${bl.name}.priceRatio*(x)`,
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

        cost(bundle:EconBundle) {
            const c = `((${this.p1})*(${bundle.x}) + (${this.p2})*(${bundle.y}))`;
            //console.log(c);
            return c;
        }

        parseSelf(parsedData) {
            let bl = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[bl.name] = {
                xIntercept: bl.xIntercept.toString(),
                yIntercept: bl.yIntercept.toString(),
                m: bl.m.toString(),
                p1: bl.p1.toString(),
                p2: bl.p2.toString(),
                priceRatio: bl.priceRatio.toString(),
                endowment: bl.endowment.toString()
            };
            return parsedData;
        }
    }

}