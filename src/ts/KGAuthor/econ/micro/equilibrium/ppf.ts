/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconPPFDefinition extends CurveDefinition {
        labor?: string | number;
        L1?: string | number;
        p1?: string | number;
        p2?: string | number;
        max1?: string | number;
        max2?: string | number;
        curvature?: string | number;
        linear?: boolean;
        draggable?: boolean;
        handles?: boolean;
        xInterceptLabel?: string;
        yInterceptLabel?: string;
    }

    export class EconPPF extends Curve {

        public prodFn1: EconOneInputProductionFunction;
        public prodFn2: EconOneInputProductionFunction;
        public labor;
        public L1;
        public L2;
        public y1;
        public y2;
        public optimalL1;
        public optimalL2;
        public optimaly1;
        public optimaly2;
        public mrt: string | number;

        public xInterceptPoint;
        public yInterceptPoint;

        constructor(def: EconPPFDefinition, graph) {

            def = setStrokeColor(def);

            KG.setDefaults(def, {
                name: 'ppf',
                color: 'colors.supply',
                strokeWidth: 2,
                lineStyle: 'solid',
                labor: 100,
                L1: 50,
                p1: 1,
                p2: 1,
                max1: 100,
                max2: 100,
                curvature: 0.5
            });

            if (def.linear) {
                def.curvature = 1;
            }

            const fn1coeff = divideDefs(def.max1, raiseDefToDef(def.labor, def.curvature)),
                fn2coeff = divideDefs(def.max2, raiseDefToDef(def.labor, def.curvature));

            const fn1 = new EconOneInputProductionFunction({
                name: def.name + '_prodFn1',
                coefficient: fn1coeff,
                exponent: def.curvature
            }), fn2 = new EconOneInputProductionFunction({
                name: def.name + '_prodFn2',
                coefficient: fn2coeff,
                exponent: def.curvature
            });

            def.parametricFunction = {
                xFunction: fn1.f("(t)"),
                yFunction: fn2.f(subtractDefs(def.labor, "(t)")),
                max: def.labor
            };

            if (def.draggable) {
                const dragLaborRequirement = addDefs(fn1.laborRequirement('drag.x'),fn2.laborRequirement('drag.y'));
                def.drag = [{
                    'directions': 'xy',
                    'param': paramName(def.max1),
                    'expression': fn1.f(dragLaborRequirement)
                },
                {
                    'directions': 'xy',
                    'param': paramName(def.max2),
                    'expression': fn2.f(dragLaborRequirement)
                }]
            }

            super(def, graph);

            let ppf = this;

            ppf.labor = def.labor;
            ppf.prodFn1 = fn1;
            ppf.prodFn2 = fn2;

            ppf.subObjects.push(fn1);
            ppf.subObjects.push(fn2);

            ppf.L1 = def.L1;
            ppf.L2 = subtractDefs(def.labor, def.L1);
            ppf.y1 = ppf.prodFn1.f(ppf.L1);
            ppf.y2 = ppf.prodFn2.f(ppf.L2);

            const coefficientRatio = divideDefs(def.max2, def.max1),
                laborRatio = divideDefs(ppf.L2, def.L1),
                priceRatio = divideDefs(def.p1, def.p2);

            if (def.curvature == 1) {
                ppf.mrt = coefficientRatio;
                ppf.optimalL1 = `((${coefficientRatio} > ${priceRatio}) ? 0 : ${ppf.labor})`;
                ppf.optimalL1 = `((${coefficientRatio} > ${priceRatio}) ? ${ppf.labor} : 0)`;

            } else {
                ppf.mrt = multiplyDefs(coefficientRatio, raiseDefToDef(laborRatio, subtractDefs(def.curvature, 1)));
                const theta = raiseDefToDef(divideDefs(coefficientRatio, priceRatio), invertDef(subtractDefs(def.curvature, 1)));
                ppf.optimalL1 = multiplyDefs(divideDefs(theta, addDefs(1, theta)), ppf.labor);
                ppf.optimalL2 = multiplyDefs(divideDefs(1, addDefs(1, theta)), ppf.labor);

            }


            ppf.optimaly1 = ppf.prodFn1.f(ppf.optimalL1);
            ppf.optimaly2 = ppf.prodFn2.f(ppf.optimalL2);

            if (graph) {
                const subObjects = ppf.subObjects;


                let xInterceptPointDef = {
                    coordinates: [def.max1, 0],
                    fill: def.stroke,
                    r: 4
                };

                if (def.draggable && typeof(def.max1) == 'string') {
                    xInterceptPointDef['drag'] = [{
                        directions: 'x',
                        param: paramName(def.max1),
                        expression: addDefs(def.max1, 'drag.dx')
                    }]
                }

                if (def.hasOwnProperty('xInterceptLabel')) {
                    xInterceptPointDef['droplines'] = {
                        vertical: def.xInterceptLabel
                    }
                }

                ppf.xInterceptPoint = new Point(xInterceptPointDef, graph);

                let yInterceptPointDef = {
                    coordinates: [0, def.max2],
                    fill: def.stroke,
                    r: 4
                };

                if (def.draggable && typeof(def.max2) == 'string') {
                    yInterceptPointDef['drag'] = [{
                        directions: 'y',
                        param: paramName(def.max2),
                        expression: addDefs(def.max2, 'drag.dy')
                    }]
                }

                if (def.hasOwnProperty('yInterceptLabel')) {
                    yInterceptPointDef['droplines'] = {
                        horizontal: def.yInterceptLabel
                    }
                }

                ppf.yInterceptPoint = new Point(yInterceptPointDef, graph);


                if (def.handles) {
                    subObjects.push(ppf.xInterceptPoint);
                    subObjects.push(ppf.yInterceptPoint);
                }


            }

        }

        parseSelf(parsedData) {
            let ppf = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[ppf.name] = {
                L1: ppf.L1,
                L2: ppf.L2,
                y1: ppf.y1,
                y2: ppf.y2,
                optimalL1: ppf.optimalL1,
                optimalL2: ppf.optimalL2,
                optimaly1: ppf.optimaly1,
                optimaly2: ppf.optimaly2,
                mrt: ppf.mrt
            };

            return parsedData;
        }

    }

}