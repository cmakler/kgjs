/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconLinearSupplyDefinition extends LineDefinition {
        yInterceptLabel?: string;
        draggable?: boolean;
        handles?: boolean;
        price?: any;
        surplus?: SurplusDefinition;
    }

    export class EconLinearSupply extends Line {

        public yIntercept;
        public slope;
        private yInterceptPoint;
        public price;

        constructor(def: EconLinearSupplyDefinition, graph) {

            def = setStrokeColor(def);

            KG.setDefaults(def, {
                name: 'supply',
                color: 'colors.supply',
                strokeWidth: 2,
                lineStyle: 'solid',
                pts: []
            });

            if (def.draggable && typeof(def.slope) == 'string') {
                def.drag = [{
                    'directions': 'xy',
                    'param': paramName(def.slope),
                    'expression': divideDefs(subtractDefs('drag.y',def.yIntercept),'drag.x')
                }]
            } else if (def.draggable && typeof(def.invSlope) == 'string') {
                def.drag = [{
                    'directions': 'xy',
                    'param': paramName(def.invSlope),
                    'expression': divideDefs('drag.x',subtractDefs('drag.y',def.yIntercept))
                }]
            } else if (def.draggable && typeof(def.yIntercept) == 'string') {
                def.drag = [{
                    'directions': 'y',
                    'param': paramName(def.yIntercept),
                    'expression': addDefs(def.yIntercept, 'drag.dy')
                }]
            }

            if (def.hasOwnProperty("price")) {
                def.pts.push({
                    name: "PQ",
                    y: def.price
                })
            }

            super(def, graph);



            let ls = this;

            if (graph) {
                const subObjects = ls.subObjects;

                let yInterceptPointDef = {
                    coordinates: [0, ls.yIntercept],
                    color: def.color,
                    r: 4,
                    show: def.show
                };

                if (def.draggable && typeof(ls.yIntercept) == 'string') {
                    yInterceptPointDef['drag'] = [{
                        directions: 'y',
                        param: paramName(ls.yIntercept),
                        expression: addDefs(ls.yIntercept, 'drag.dy')
                    }]
                }

                if (def.hasOwnProperty('yInterceptLabel')) {
                    yInterceptPointDef['droplines'] = {
                        horizontal: def.yInterceptLabel
                    }
                }

                ls.yInterceptPoint = new Point(yInterceptPointDef, graph);

                if (def.handles) {
                    subObjects.push(ls.yInterceptPoint);
                }

                if (def.hasOwnProperty('surplus')) {
                    let surplusDef = KG.setDefaults(def.surplus || {}, {
                        "fill": "colors.supply"
                    });
                    let price = surplusDef.price || `calcs.${ls.name}.PQ.y`,
                        quantity = surplusDef.quantity || `calcs.${ls.name}.PQ.x`;
                    surplusDef.univariateFunction1 = {
                        fn: ls.def.univariateFunction.fn,
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
                    ls.subObjects.push(new Area(surplusDef, graph));
                }

            }

        }

    }


}