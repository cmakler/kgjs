/// <reference path='../../kg.ts' />

module KG {

    export interface AreaDefinition extends ViewObjectDefinition {
        univariateFunction1: UnivariateFunctionDefinition;
        univariateFunction2: UnivariateFunctionDefinition;
    }

    export class Area extends ViewObject {

        private g;
        private interpolation;

        private path1;
        private path2;

        private data1;
        private data2;

        private areaShape;
        private areaPath;

        private univariateFunction1: UnivariateFunction;
        private univariateFunction2: UnivariateFunction;

        constructor(def: AreaDefinition) {
            setDefaults(def, {
                alwaysUpdate: true,
                interpolation: 'curveBasis',
                ind: 'x',
                fill: 'lightsteelblue',
                opacity: 0.2
            });

            setProperties(def, 'constants',['interpolation']);
            super(def);

            def.univariateFunction1.model = def.model;
            def.univariateFunction2.model = def.model;
            this.univariateFunction1 = new UnivariateFunction(def.univariateFunction1);
            this.univariateFunction2 = new UnivariateFunction(def.univariateFunction2);
        }

        // create SVG elements
        draw(layer) {
            let ab = this;

            ab.g = layer.append('g');
            ab.rootElement = ab.g;

            ab.areaShape = d3.area()
                .x0(function(d: any){return ab.xScale.scale(d[0].x);})
                .y0(function(d: any){return ab.yScale.scale(d[0].y);})
                .x1(function(d: any){return ab.xScale.scale(d[1].x);})
                .y1(function(d: any){return ab.yScale.scale(d[1].y);});

            ab.areaPath = ab.g.append("path");

            console.log("Fill: %s", ab.fill);

            ab.path1 = ab.g.append('path')
                .style('fill', 'none');
            ab.path2 = ab.g.append('path')
                .style('fill', 'none');
            
            ab.data1 = [];
            ab.data2 = [];

            return ab.addClipPath();
        }

        // update properties
        redraw() {
            let ab = this;

            if (ab.hasOwnProperty('univariateFunction1')) {
                ab.data1 = this.redrawPath(ab, ab.univariateFunction1, ab.path1, ab.data1);
                ab.data2 = this.redrawPath(ab, ab.univariateFunction2, ab.path2, ab.data2);

                ab.areaPath
                    .data([d3.zip(ab.data1, ab.data2)])
                    .attr('d', ab.areaShape)
                    .style('fill', ab.fill)
                    .style('opacity', ab.opacity);
            }

            return ab;
        }

        redrawPath(ab, fn, path, data) {
            fn.update(true);
            if (fn.hasChanged) {
                const scale = fn.ind == 'y' ? ab.yScale : ab.xScale;
                data = fn.dataPoints(scale.domainMin, scale.domainMax);
                const dataLine = d3.line()
                    .curve(d3[ab.interpolation])
                    .x(function (d: any) {
                        return ab.xScale.scale(d.x)
                    })
                    .y(function (d: any) {
                        return ab.yScale.scale(d.y)
                    });
                path.data([data]).attr('d', dataLine);
            }
            path.attr('stroke', ab.stroke);
            path.attr('stroke-width', ab.strokeWidth);
            return data;
        }
    }

}