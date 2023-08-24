/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface EconConstantElasticityCurveDefinition extends CurveDefinition {
        name?: string;
        point: PointDefinition;
        point2?: PointDefinition;
        elasticity?: any;
        normalizedElasticity?: any;
        draggable?: boolean;
        price?: any;
        quantity?: any;
    }

    export class EconConstantElasticityCurve extends Curve {

        public elasticity;
        public coefficient;
        public invElasticity;
        public invCoefficient;
        public absElasticity;
        public elastic;
        public inelastic;
        public unitElastic;
        public perfectlyElastic;
        public perfectlyInelastic;
        public price;
        public quantity;

        constructor(def: EconConstantElasticityCurveDefinition, graph) {

            def = setStrokeColor(def);

            KG.setDefaults(def, {
                name: 'constElasticityCurve' + KG.randomString(5),
                color: 'colors.demand',
                strokeWidth: 2,
                lineStyle: 'solid',
                show: true
            });

            // TODO shouldn't need to convert these to strings; it should work with numbers...
            if(def.hasOwnProperty('elasticity')) {
                def.elasticity = def.elasticity.toString();
            }
            if(def.hasOwnProperty('normalizedElasticity')) {
                def.normalizedElasticity = def.normalizedElasticity.toString();
            }

            // A constant elasticity curve is defined by one point and either an elasticity, a normalized elasticity, or a second point.

            let curveDef = copyJSON(def);
            curveDef.fn = multiplyDefs("calcs." + def.name + ".coefficient", raiseDefToDef("(y)", "calcs." + curveDef.name + ".elasticity"));
            curveDef.ind = 'y';
            curveDef.samplePoints = 500;
            curveDef.show = "((" + def.show + ") && !(calcs. " + def.name + ".elastic))";

            let invCurveDef = copyJSON(def);
            invCurveDef.name = def.name + "inverse";
            invCurveDef.fn = multiplyDefs("calcs." + invCurveDef.name + ".coefficient", raiseDefToDef("(x)", "calcs." + invCurveDef.name + ".elasticity"));
            invCurveDef.samplePoints = 500;
            invCurveDef.ind = 'x';
            invCurveDef.show = "((" + def.show + ") && (calcs. " + def.name + ".elastic))";

            // define the control point
            let pointDef = copyJSON(def.point || {});
            pointDef.color = pointDef.color || def.color;
            pointDef.show = pointDef.show || def.show;

            // define the second control point, if applicable
            if(def.hasOwnProperty('point2')) {
                let point2Def = copyJSON(def.point2);
                point2Def.color = point2Def.color || def.color;
                point2Def.show = point2Def.show || def.show;
            }

            super(curveDef, graph);

            let c = this;

            c.subObjects.push(new Curve(invCurveDef, graph));

            const p = new Point(pointDef, graph);
            c.subObjects.push(p);

            // If defined by a second point, calculate the elasticity implied by those two points
            if(def.hasOwnProperty('point2')) {
                let pointDef2 = def.point2;
                pointDef2.color = pointDef2.color || def.color;
                const p2 = new Point(pointDef2, graph);
                // calculate elasticity between the two points
                // we have x0 = a*y0^b, x1 = a*y1^b
                // therefore a = x0y0^(-b) = x1y1^(-b)
                // therefore (x0/x1) = (y0/y1)^b => b = log(x0/x1)/log(y0/y1)
                const x0overx1 = divideDefs(p.x, p2.x);
                const y0overy1 = divideDefs(p.y, p2.y);
                c.elasticity = divideDefs("log" + x0overx1 + "", "log" + y0overy1 + "");
                c.invElasticity = divideDefs("log" + y0overy1 + "", "log" + x0overx1 + "");
                c.perfectlyElastic = "(" + p.y  + " == " + p2.y + ")";
                c.perfectlyInelastic = "(" + p.x  + " == " + p2.x + ")";
                c.subObjects.push(p2);
            }

            // If the elasticity is normalized, 0 is perfectly inelastic, and 1 or -1 is perfectly elastic.
            else if(def.hasOwnProperty('normalizedElasticity')) {
                const absNormalizedElasticity = "(abs(" + def.normalizedElasticity + "))";
                c.elasticity = divideDefs(def.normalizedElasticity, "(1 - " + absNormalizedElasticity + ")");
                c.invElasticity = divideDefs("(1 - " + absNormalizedElasticity + ")", def.normalizedElasticity);
                c.perfectlyElastic = "(" + absNormalizedElasticity + " == 1)";
                c.perfectlyInelastic = "(" + def.normalizedElasticity + " == 0)";
            }

            // If the elasticity is defined directly, it can't be infinite
            else {
                c.elasticity = def.elasticity;
                c.invElasticity = invertDef(def.elasticity)
                c.perfectlyInelastic = "(" + def.elasticity + " == 0)";
                c.perfectlyElastic = "false";
            }

            // we have a function of the form x = ay^b => a = x0/y0^(b)
            c.coefficient = divideDefs(p.x, raiseDefToDef(p.y, c.elasticity));

            // the inverse of this function is of the form y = a'x^(b') => a' = y0/x0^(b')
            c.invCoefficient = divideDefs(p.y, raiseDefToDef(p.x, c.invElasticity))

            // Define regions of elasticity
            c.absElasticity = "(abs(" + c.elasticity + "))";
            c.elastic = "(" + c.absElasticity + " > 1)"
            c.unitElastic = "(" + c.absElasticity + " == 1)"
            c.inelastic = "(" + c.absElasticity + " < 1)"

        }

        parseSelf(parsedData) {
            let c = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[c.name] = {
                elasticity: c.elasticity,
                coefficient: c.coefficient,
                elastic: c.elastic,
                unitElastic: c.unitElastic,
                inelastic: c.inelastic,
                perfectlyElastic: c.perfectlyElastic,
                perfectlyInelastic: c.perfectlyInelastic
            };
            parsedData.calcs[c.name + 'inverse'] = {
                elasticity: c.invElasticity,
                coefficient: c.invCoefficient
            }

            return parsedData;
        }

    }

    export class EconConstantElasticityIntersection extends GraphObjectGenerator {

        public name;
        public Q;
        public Qdirect;
        public Qcalc;
        public P;
        public Pdirect;
        public Pcalc;

        constructor(def: {name: string, curve1: string, curve2: string}, graph) {
            super(def, graph);

            const intersection = this;
            intersection.name = def.name;

            const c1 = "(calcs." + def.curve1 + ".coefficient)",
                e1 = "(calcs." + def.curve1 + ".elasticity)",
                c2 = "(calcs." + def.curve2 + ".coefficient)",
                e2 = "(calcs." + def.curve2 + ".elasticity)",
                invc1 = "(calcs." + def.curve1 + "inverse.coefficient)",
                inve1 = "(calcs." + def.curve1 + "inverse.elasticity)",
                invc2 = "(calcs." + def.curve2 + "inverse.coefficient)",
                inve2 = "(calcs." + def.curve2 + "inverse.elasticity)"

            // intersection occurs at the point where c1*x^(e1) = c2*x^(e2) => x = (c1/c2)^(1/(e2 - e1))
            const P = raiseDefToDef(divideDefs(c1,c2),invertDef(subtractDefs(e2, e1)));
            const QofP = multiplyDefs(c1, raiseDefToDef(P, e1));

            intersection.Pdirect = P;
            intersection.Qcalc = QofP;

            // can also use the inverse curves to calculate the Q, and the P from that.
            const Q = raiseDefToDef(divideDefs(invc1,invc2),invertDef(subtractDefs(inve2, inve1)));
            const PofQ = multiplyDefs(invc1, raiseDefToDef(Q, inve1));

            intersection.Qdirect = Q;
            intersection.Pcalc = PofQ;

            // want to use (P, QofP) when either supply or demand is perfectly inelastic; otherwise want to use (Q, PofQ)
            const eitherPerfectlyInelastic = "(" + multiplyDefs(e1,e2) + " == 0)"
            intersection.Q = "(" + eitherPerfectlyInelastic + " ? " + QofP + " : " + Q + ")";
            intersection.P = "(" + eitherPerfectlyInelastic + " ? " + P + " : " + PofQ + ")";

        }

        parseSelf(parsedData) {
            let c = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[c.name] = {
                Pdirect: c.Pdirect,
                Pcalc: c.Pcalc,
                Qdirect: c.Qdirect,
                Qcalc: c.Qcalc,
                Q: c.Q,
                P: c.P
            };

            return parsedData;
        }
    }


}