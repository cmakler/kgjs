/// <reference path="../kgAuthor.ts" />

module KGAuthor {

    export interface LineDefinition extends CurveDefinition {
        point?: (string|number)[];
        point2?: (string|number)[];
        slope?: string|number;
        invSlope?: string|number;
        yIntercept?: string|number;
        xIntercept?: string|number;
        min?: string|number;
        max?: string|number;
    }



    export class Line extends Curve {

        public yIntercept;
        public xIntercept;
        public slope;
        public invSlope;
        public fixedPoint;

        constructor(def, graph) {

            KG.setDefaults(def,{
                color: 'colors.orange'
            });

            // may define line with two points

            let xIntercept = def.xIntercept,
                yIntercept = def.yIntercept,
                slope = def.slope,
                invSlope = def.invSlope;

            if(def.hasOwnProperty('point') && def.hasOwnProperty('point2')) {
                // still need to handle infinite case
                slope = divideDefs(subtractDefs(def.point[1],def.point2[1]),subtractDefs(def.point[0],def.point2[0]));
                yIntercept = subtractDefs(def.point[1],multiplyDefs(slope,def.point[0]));
                invSlope = divideDefs(subtractDefs(def.point[0],def.point2[0]),subtractDefs(def.point[1],def.point2[1]));
                xIntercept = subtractDefs(def.point[0],multiplyDefs(invSlope,def.point[1]));
            }

            else if(def.hasOwnProperty('xIntercept') && def.hasOwnProperty('yIntercept')) {
                slope = negativeDef(divideDefs(def.yIntercept,def.xIntercept));
                invSlope = negativeDef(divideDefs(def.xIntercept,def.yIntercept));
            }

            else if(def.hasOwnProperty('point') && def.hasOwnProperty('yIntercept')) {
                slope = divideDefs(subtractDefs(def.point[1],def.yIntercept),def.point[0]);
                invSlope = divideDefs(def.point[0],subtractDefs(def.point[1],def.yIntercept));
                xIntercept = negativeDef(multiplyDefs(yIntercept,invSlope));
            }

            else if(def.hasOwnProperty('slope') && def.hasOwnProperty('yIntercept')) {
                invSlope = invertDef(def.slope);
                xIntercept = negativeDef(divideDefs(yIntercept,slope));
            }

            else if(def.hasOwnProperty('invSlope') && def.hasOwnProperty('xIntercept')) {
                slope = invertDef(def.invSlope);
                yIntercept = negativeDef(divideDefs(xIntercept,invSlope));
            }

            else if(def.hasOwnProperty('invSlope') && def.hasOwnProperty('yIntercept')) {
                slope = invertDef(def.invSlope);
            }

            else if(def.hasOwnProperty('slope') && def.hasOwnProperty('point')) {
                invSlope = invertDef(def.slope);
                xIntercept = subtractDefs(def.point[0],divideDefs(def.point[1],def.slope));
                yIntercept = subtractDefs(def.point[1],multiplyDefs(def.point[0],def.slope));
            }

            else if(def.hasOwnProperty('invSlope') && def.hasOwnProperty('point')) {
                slope = invertDef(def.invSlope);
                xIntercept = subtractDefs(def.point[0],divideDefs(def.point[1],slope));
                yIntercept = subtractDefs(def.point[1],multiplyDefs(def.point[0],slope));
            }

            else if(def.hasOwnProperty('slope')) {
                invSlope = invertDef(def.slope);
                xIntercept = 0;
                yIntercept = 0;
            }

            else if(def.hasOwnProperty('yIntercept')) {
                invSlope = Infinity;
                xIntercept = null;
                yIntercept = def.yIntercept;
                slope = 0;
            }

            else if(def.hasOwnProperty('xIntercept')) {
                invSlope = 0;
                xIntercept = def.xIntercept;
                yIntercept = null;
                slope = Infinity;
            }

            else {
                xIntercept = 0;
                yIntercept = 0;
                slope = divideDefs(def.point[1],def.point[0]);
                invSlope = divideDefs(def.point[0],def.point[1]);
            }

            def.univariateFunction = {
                fn: `${yIntercept} + (${slope})*(x)`,
                yFn: `${xIntercept} + (${invSlope})*(y)`,
                ind: `((${invSlope} == 0) ? 'y' : 'x')`,
                samplePoints: 2
            };

            if(def.hasOwnProperty('min')) {
                def.univariateFunction.min = def.min;
                delete def.min;
            }

            if(def.hasOwnProperty('max')) {
                def.univariateFunction.max = def.max;
                delete def.max;
            }

            super(def, graph);

            this.xIntercept = xIntercept;
            this.yIntercept = yIntercept;
            this.slope = slope;
            this.invSlope = invSlope;

        }

        parseSelf(parsedData) {
            let l = this;
            parsedData = super.parseSelf(parsedData);
            let d:any = {
                slope: l.slope.toString(),
                invSlope: l.invSlope.toString()
            };
            if (l.xIntercept) {
                d.xIntercept = l.xIntercept.toString();
            }
            if (l.yIntercept) {
                d.yIntercept = l.yIntercept.toString();

            }
            if (!l.xIntercept) {
                d.fixedPoint = `((${d.yIntercept})/(1 - ${l.slope.toString()}))`;
            } else if (!l.yIntercept) {
                d.fixedPoint = `((${d.xIntercept})/(1 - ${l.invSlope.toString()}))`
            } else {
                d.fixedPoint = `(${d.invSlope} == 0 ? (${d.xIntercept})/(1 - ${l.invSlope.toString()}) : (${d.yIntercept})/(1 - ${l.slope.toString()}))`
            }
            parsedData.calcs[l.name] = KG.setDefaults(parsedData.calcs[l.name] || {} ,d);
            return parsedData;
        }
    }

    export function lineIntersection(l1: Line, l2: Line) {
        const x = divideDefs(addDefs(l1.xIntercept, multiplyDefs(l1.invSlope, l2.yIntercept)),
                subtractDefs("1", multiplyDefs(l1.invSlope, l2.slope)));

        const y = l2.yOfX(x);

        return [x,y];
    }

}