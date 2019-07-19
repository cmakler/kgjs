/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconLinearDemandDefinition extends LineDefinition {
        xInterceptLabel?: string;
        yInterceptLabel?: string;
        marginalRevenue?: any;
        draggable?: boolean;
        handles?: boolean;
    }

    export class EconLinearDemand extends Line {

        public xIntercept;
        public slope;
        private xInterceptPoint;
        private yInterceptPoint;

        constructor(def: EconLinearDemandDefinition, graph) {

            def = setStrokeColor(def);

            KG.setDefaults(def, {
                point: [0, def.yIntercept],
                slope: 0,
                color: 'colors.demand',
                strokeWidth: 2,
                lineStyle: 'solid'
            });

            if (def.draggable && typeof(def.xIntercept) == 'string') {
                def.drag = [{
                    'directions': 'x',
                    'param': paramName(def.xIntercept),
                    'expression': addDefs(def.xIntercept, 'drag.dx')
                }]
            } else if (def.draggable && typeof(def.yIntercept) == 'string') {
                def.drag = [{
                    'directions': 'y',
                    'param': paramName(def.yIntercept),
                    'expression': addDefs(def.yIntercept, 'drag.dy')
                }]
            }
            def.max = def.xIntercept;

            super(def, graph);

            let ld = this;


            if (graph) {
                const subObjects = ld.subObjects;

                let xInterceptPointDef = {
                    coordinates: [ld.xIntercept, 0],
                    color: def.color,
                    r: 4
                };

                if (def.draggable && typeof(ld.xIntercept) == 'string') {
                    xInterceptPointDef['drag'] = [{
                        directions: 'x',
                        param: paramName(ld.xIntercept),
                        expression: addDefs(ld.xIntercept, 'drag.dx')
                    }]
                }

                if (def.hasOwnProperty('xInterceptLabel')) {
                    xInterceptPointDef['droplines'] = {
                        vertical: def.xInterceptLabel
                    }
                }

                ld.xInterceptPoint = new Point(xInterceptPointDef, graph);

                let yInterceptPointDef = {
                    coordinates: [0, ld.yIntercept],
                    color: def.color,
                    r: 4
                };

                if (def.draggable && typeof(ld.yIntercept) == 'string') {
                    yInterceptPointDef['drag'] = [{
                        directions: 'y',
                        param: paramName(ld.invSlope),
                        expression: negativeDef(divideDefs(ld.xIntercept, 'drag.y'))
                    }]
                }

                if (def.hasOwnProperty('yInterceptLabel')) {
                    yInterceptPointDef['droplines'] = {
                        horizontal: def.yInterceptLabel
                    }
                }

                ld.yInterceptPoint = new Point(yInterceptPointDef, graph);

                if (def.handles) {
                    subObjects.push(ld.xInterceptPoint);
                    subObjects.push(ld.yInterceptPoint);
                }

                let marginalRevenueDef = {
                    "color": "colors.marginalRevenue",
                    "yIntercept": ld.yIntercept,
                    "slope": multiplyDefs(2, ld.slope),
                    "label": {
                        "text": "MR",
                        "x": multiplyDefs(0.6, ld.xIntercept)
                    }
                };

                if(def.hasOwnProperty('marginalRevenue')) {
                    def.marginalRevenue = KG.setDefaults(def.marginalRevenue, marginalRevenueDef)
                    ld.subObjects.push(new Line(marginalRevenueDef, graph));
                };

            }

        }

        parseSelf(parsedData) {
            let ld = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[ld.name] = {
                yIntercept: ld.yIntercept.toString(),
                slope: ld.slope.toString(),
                xIntercept: ld.xIntercept.toString(),
                invSlope: ld.invSlope.toString()
            };

            return parsedData;
        }

    }

    export class EconCompetitiveDemand extends EconLinearDemand {

    }


}