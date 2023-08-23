/// <reference path="../../eg.ts"/>

module KGAuthor {

    export interface ConstantElasticityCurveDefinition extends CurveDefinition {
        name?: string;
        point: PointDefinition;
        point2?: PointDefinition;
        elasticity?: any;
        normalizedElasticity?: any;
        draggable?: boolean;
        handles?: boolean;
    }

    export class ConstantElasticityCurve extends Curve {

        public elasticity;
        public absElasticity;
        public elastic;
        public inelastic;
        public unitElastic;
        public perfectlyElastic;
        public perfectlyInelastic;

        constructor(def: ConstantElasticityCurveDefinition, graph) {

            def = setStrokeColor(def);

            KG.setDefaults(def, {
                color: 'colors.demand',
                strokeWidth: 2,
                lineStyle: 'solid',
                show: true,
                ind: 'y'
            });

            let pointDef = def.point || {};
            pointDef.color = pointDef.color || def.color;
            const p = new Point(pointDef, graph);
            let p2;
            let elasticity, perfectlyElastic, perfectlyInelastic

            if(def.hasOwnProperty('point2')) {
                let pointDef2 = def.point2;
                pointDef2.color = pointDef2.color || def.color;
                p2 = new Point(pointDef2, graph);
                // calculate elasticity between the two points
                // we have x0 = a*y0^b, x1 = a*y1^b
                // therefore a = x0y0^(-b) = x1y1^(-b)
                // therefore (x0/x1) = (y0/y1)^b => b = log(x0/x1)/log(y0/y1)
                const x0overx1 = divideDefs(p.x, p2.x);
                const y0overy1 = divideDefs(p.y, p2.y);
                elasticity = divideDefs("log" + x0overx1 + "", "log" + y0overy1 + "");
                perfectlyElastic = "(" + p.y  + " == " + p2.y + ")";
                perfectlyInelastic = "(" + p.x  + " == " + p2.x + ")";
            }

            // If the elasticity is normalized, 0 is perfectly inelastic, and 1 or -1 is perfectly elastic.
            else if(def.hasOwnProperty('normalizedElasticity')) {
                const absNormalizedElasticity = "(abs(" + def.normalizedElasticity + "))";
                elasticity = divideDefs(def.normalizedElasticity, "(1 - " + absNormalizedElasticity + ")");
                perfectlyElastic = "(" + absNormalizedElasticity + " == 1)";
                perfectlyInelastic = "(" + def.normalizedElasticity + "== 0)";
            }

            // If the elasticity is defined directly, it can't be infinite
            else {
                elasticity = def.elasticity;
                perfectlyInelastic = "(" + def.elasticity + "== 0)";
                perfectlyElastic = "false";
            }

            // we have a function of the form x = ay^b => a = x0y0^(-b)
            const a = divideDefs(p.x, raiseDefToDef(p.y, elasticity));
            def.fn = multiplyDefs(a, raiseDefToDef("(y)", elasticity));
            const showPerfectlyElastic = "((" + def.show + ") && (calcs. " + def.name + ".perfectlyElastic))"
            def.show = "((" + def.show + ") && !(calcs. " + def.name + ".perfectlyElastic))";

            super(def, graph);

            let c = this;

            c.elasticity = elasticity;
            c.perfectlyElastic = perfectlyElastic;
            c.perfectlyInelastic = perfectlyInelastic;

            // Define regions of elasticity
            c.absElasticity = "(abs(" + c.elasticity + "))";
            c.elastic = "(" + c.absElasticity + " > 1)"
            c.unitElastic = "(" + c.absElasticity + " == 1)"
            c.inelastic = "(" + c.absElasticity + " < 1)"

            // Add subobjects
            c.subObjects.push(p);
            if(def.hasOwnProperty('p2')) {
                c.subObjects.push(p2);
            }
            // Need to create a horizontal line if perfectly elastic
            let perfectlyElasticLineDef = copyJSON(def);
            delete perfectlyElasticLineDef.fn;
            delete perfectlyElasticLineDef.point2;
            perfectlyElasticLineDef.name = def.name + "-peline";
            perfectlyElasticLineDef.point = [p.x, p.y];
            perfectlyElasticLineDef.slope = 0;
            perfectlyElasticLineDef.show = showPerfectlyElastic;
            c.subObjects.push(new Line(perfectlyElasticLineDef, graph));

        }

        parseSelf(parsedData) {
            let c = this;
            parsedData = super.parseSelf(parsedData);
            parsedData.calcs[c.name] = {
                elasticity: c.elasticity,
                elastic: c.elastic,
                unitElastic: c.unitElastic,
                inelastic: c.inelastic,
                perfectlyElastic: c.perfectlyElastic,
                perfectlyInelastic: c.perfectlyInelastic
            };

            return parsedData;
        }

    }


}