/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconLinearMCDefinition extends LineDefinition {
        fixedCost: string;
        yInterceptLabel?: string;
        draggable?: boolean;
        handles?: boolean;
    }

    export class EconLinearMC extends Line {

        public yIntercept;
        public slope;
        private yInterceptPoint;

        constructor(def: EconLinearSupplyDefinition, graph) {

            def = setStrokeColor(def);

            KG.setDefaults(def, {
                color: 'colors.supply',
                strokeWidth: 2,
                lineStyle: 'solid'
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

            super(def, graph);

            let ld = this;


            if (graph) {
                const subObjects = ld.subObjects;

                let yInterceptPointDef = {
                    coordinates: [0, ld.yIntercept],
                    color: def.color,
                    r: 4
                };

                if (def.draggable && typeof(ld.yIntercept) == 'string') {
                    yInterceptPointDef['drag'] = [{
                        directions: 'y',
                        param: paramName(ld.yIntercept),
                        expression: addDefs(ld.yIntercept, 'drag.dy')
                    }]
                }

                if (def.hasOwnProperty('yInterceptLabel')) {
                    yInterceptPointDef['droplines'] = {
                        horizontal: def.yInterceptLabel
                    }
                }

                ld.yInterceptPoint = new Point(yInterceptPointDef, graph);

                if (def.handles) {
                    subObjects.push(ld.yInterceptPoint);
                }

            }

        }

        parseSelf(parsedData) {
            let ld = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[ld.name] = {
                yIntercept: ld.yIntercept.toString(),
                slope: ld.slope.toString(),
                invSlope: ld.invSlope.toString()
            };

            return parsedData;
        }

    }


}