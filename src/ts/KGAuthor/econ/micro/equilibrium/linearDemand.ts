/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface SurplusDefinition extends AreaDefinition {
        price?: any;
        quantity?: any;
    }

    export interface EconLinearDemandDefinition extends LineDefinition {
        xInterceptLabel?: string;
        yInterceptLabel?: string;
        marginalRevenue?: any;
        surplus?: SurplusDefinition;
        draggable?: boolean;
        handles?: boolean;
        price?: any;
    }

    export class EconLinearDemand extends Line {

        public xInterceptPoint;
        public yInterceptPoint;
        public marginalRevenue: Line;
        public price;

        constructor(def: EconLinearDemandDefinition, graph) {

            def = setStrokeColor(def);

            KG.setDefaults(def, {
                name: "demand",
                point: [0, def.yIntercept],
                slope: 0,
                color: 'colors.demand',
                strokeWidth: 2,
                lineStyle: 'solid',
                pts: []
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
            //def.max = def.xIntercept;

            if (def.hasOwnProperty("price")) {
                def.pts.push({
                    name: "PQ",
                    y: def.price
                })
            }

            if (def.hasOwnProperty("surplus")) {
                if (!def.hasOwnProperty("price") && def.surplus.hasOwnProperty("quantity")) {
                    def.pts.push({
                        name: "PQ",
                        x: def.surplus.quantity
                    })
                }
            }

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
                        expression: negativeDef(divideDefs(ld.xIntercept, 'max(drag.y,0.01)'))
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

                if (def.hasOwnProperty('marginalRevenue')) {
                    let marginalRevenueDef = KG.setDefaults(def.marginalRevenue || {}, {
                        "color": "colors.marginalRevenue",
                        "yIntercept": ld.yIntercept,
                        "slope": multiplyDefs(2, ld.slope),
                        "label": {
                            "text": "MR",
                            "x": multiplyDefs(0.6, ld.xIntercept)
                        }
                    });
                    ld.marginalRevenue = new Line(marginalRevenueDef, graph);
                    ld.subObjects.push(ld.marginalRevenue);
                }


                if (def.hasOwnProperty('surplus')) {
                    let surplusDef = KG.setDefaults(def.surplus || {}, {
                        "fill": "colors.demand"
                    });
                    let price = surplusDef.price || `calcs.${ld.name}.PQ.y`,
                        quantity = surplusDef.quantity || `calcs.${ld.name}.PQ.x`;
                    surplusDef.univariateFunction1 = {
                        fn: ld.def.univariateFunction.fn,
                        min: 0,
                        max: quantity,
                        samplePoints: 2
                    };
                    surplusDef.univariateFunction2 = {
                        fn: price,
                        min: 0,
                        max: quantity,
                        samplePoints: 2
                    };
                    ld.subObjects.push(new Area(surplusDef, graph));
                }

            }

        }

    }

    export class EconCompetitiveDemand extends EconLinearDemand {

    }


}